import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db.ts';
import {
  validateEmail,
  validatePassword,
  verifyPassword,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  createAdminToken,
  verifyAdminToken,
} from './src/server/auth.ts';
import {
  saveOrderToSupabase,
  getSupabaseConfig,
  testSupabaseConnection,
} from './src/server/supabase.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// Request logging
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// --- API ROUTES ---

// 1. Products
app.get('/api/products', (req, res) => {
  try {
    const { category, room, collection, mood, material, search, minPrice, maxPrice, inStock, sort } = req.query;
    const products = db.getProducts({
      category: category as string,
      room: room as string,
      collection: collection as string,
      mood: mood as string,
      material: material as string,
      search: search as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock: inStock === 'true',
      sort: sort as string,
    });
    res.json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    const reviews = db.getReviews(product.id);
    const related = db.getProducts({ category: product.category })
      .filter(p => p.id !== product.id)
      .slice(0, 4);

    res.json({ success: true, data: { ...product, reviews, related } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const newProduct = db.createProduct(req.body);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const success = db.deleteProduct(req.params.id);
    res.json({ success });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Categories & Collections
app.get('/api/categories', (_req, res) => {
  res.json({ success: true, data: db.getCategories() });
});

app.get('/api/collections', (_req, res) => {
  res.json({ success: true, data: db.getCollections() });
});

// 3. Orders
app.get('/api/orders', (req, res) => {
  try {
    const userId = req.query.userId as string | undefined;
    const orders = db.getOrders(userId);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/orders/:orderNumber', (req, res) => {
  try {
    const order = db.getOrderByNumber(req.params.orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = db.createOrder(req.body);

    // Save order to Supabase backend table (Project ID: qlddjxornxfeudavzoff)
    let supabaseSync;
    try {
      supabaseSync = await saveOrderToSupabase(order);
    } catch (sbErr: any) {
      console.error('[Supabase Sync Error]:', sbErr);
      supabaseSync = {
        success: false,
        error: sbErr?.message || String(sbErr),
      };
    }

    res.status(201).json({
      success: true,
      data: order,
      supabaseSync,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Supabase Backend Status & Diagnostics
app.get('/api/supabase/status', async (_req, res) => {
  try {
    const config = getSupabaseConfig();
    const testResult = await testSupabaseConnection();
    res.json({
      success: true,
      config: {
        projectId: config.projectId,
        url: config.url,
        hasKey: config.hasKey,
      },
      connection: testResult,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bulk sync orders to Supabase
app.post('/api/supabase/sync-all', async (_req, res) => {
  try {
    const orders = db.getOrders();
    const results = [];
    for (const order of orders) {
      const syncResult = await saveOrderToSupabase(order);
      results.push(syncResult);
    }
    const successful = results.filter((r) => r.success).length;
    res.json({
      success: true,
      total: orders.length,
      synced: successful,
      results,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const { status, note } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status, note);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Reviews
app.get('/api/reviews', (req, res) => {
  const productId = req.query.productId as string | undefined;
  res.json({ success: true, data: db.getReviews(productId) });
});

app.post('/api/reviews', (req, res) => {
  try {
    const review = db.createReview(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Coupons
app.post('/api/coupons/apply', (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const result = db.validateCoupon(code, Number(cartTotal));
    if (!result.valid) {
      return res.status(400).json({ success: false, error: result.error });
    }
    res.json({ success: true, data: result.coupon });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/coupons', (_req, res) => {
  res.json({ success: true, data: db.getCoupons() });
});

app.post('/api/coupons', (req, res) => {
  try {
    const coupon = db.createCoupon(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Auth
app.post('/api/auth/login', (req, res) => {
  try {
    const { email } = req.body;
    let user = db.getUserByEmail(email);
    if (!user) {
      // Auto-register convenience for seamless trial
      user = db.createUser(email.split('@')[0], email, email.includes('admin') ? 'admin' : 'customer');
    }
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email } = req.body;
    let user = db.getUserByEmail(email);
    if (user) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }
    user = db.createUser(name, email, 'customer');
    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/auth/me', (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }
  res.json({ success: true, data: user });
});

app.put('/api/auth/profile', (req, res) => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  const updated = db.updateUser(userId, req.body);
  res.json({ success: true, data: updated });
});

// Middleware: Admin Authentication & RBAC Verification
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  let token = '';
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/riwaaz_admin_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required. Admin access only.' });
  }

  const verified = verifyAdminToken(token);
  if (!verified.valid || !verified.user) {
    return res.status(401).json({ success: false, error: verified.error || 'Invalid or expired admin session.' });
  }

  if (verified.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden: Insufficient privileges. Role "admin" required.' });
  }

  (req as any).adminUser = verified.user;
  next();
}

// Secure Admin Authentication Endpoints
app.post('/api/auth/admin-login', (req, res) => {
  try {
    const rawIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress || 'unknown';

    // 1. Sliding-window rate limiting check
    const rateLimit = checkRateLimit(rawIp);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        success: false,
        error: `Security lockout active due to excessive failed attempts. Please retry after ${rateLimit.retryAfterSec} seconds.`,
        retryAfterSec: rateLimit.retryAfterSec,
      });
    }

    const { email, password } = req.body;

    // 2. Strict input validation
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    const passValidation = validatePassword(password);
    if (!passValidation.valid) {
      return res.status(400).json({ success: false, error: passValidation.error || 'Invalid password.' });
    }

    // 3. User & credential lookup
    const adminUser = db.getAdminUserWithCredentials(email.trim());
    if (!adminUser || adminUser.role !== 'admin' || !adminUser.passwordHash || !adminUser.passwordSalt) {
      const failed = recordFailedAttempt(rawIp);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
        remaining: failed.remaining,
        retryAfterSec: failed.retryAfterSec,
      });
    }

    // 4. Timing-attack resistant verification
    const isMatch = verifyPassword(password, adminUser.passwordHash, adminUser.passwordSalt);
    if (!isMatch) {
      const failed = recordFailedAttempt(rawIp);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
        remaining: failed.remaining,
        retryAfterSec: failed.retryAfterSec,
      });
    }

    // 5. Success: reset rate limit & generate signed token
    resetRateLimit(rawIp);
    const token = createAdminToken({
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      name: adminUser.name,
    });

    // Set secure HTTP-only SameSite cookie
    res.cookie('riwaaz_admin_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 12 * 3600 * 1000,
    });

    const { passwordHash, passwordSalt, ...safeUser } = adminUser;
    res.json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/admin-logout', (_req, res) => {
  res.clearCookie('riwaaz_admin_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/admin/verify', (req, res) => {
  let token = '';
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/riwaaz_admin_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, authenticated: false, error: 'No active admin session' });
  }

  const verified = verifyAdminToken(token);
  if (!verified.valid || !verified.user) {
    return res.status(401).json({ success: false, authenticated: false, error: verified.error || 'Token expired or invalid' });
  }

  res.json({ success: true, authenticated: true, user: verified.user });
});

// 7. Admin Metrics (RBAC verified or public overview)
app.get('/api/admin/metrics', (req, res) => {
  // If Bearer token provided, verify role
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    const verified = verifyAdminToken(token);
    if (!verified.valid) {
      return res.status(401).json({ success: false, error: 'Invalid admin token' });
    }
  }
  res.json({ success: true, data: db.getMetrics() });
});

// Static assets for uploaded images
app.use('/images', express.static(path.resolve(process.cwd(), 'images')));
app.use('/images', express.static(path.resolve(process.cwd(), 'public/images')));
app.use('/assets', express.static(path.resolve(process.cwd(), 'public/assets')));
app.use(express.static(path.resolve(process.cwd(), 'public')));

// --- Server Frontend Setup ---
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RIWAAZ Server] Running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
