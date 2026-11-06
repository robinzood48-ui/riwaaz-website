import crypto from 'node:crypto';

// Secret key for HMAC token signing (falls back to secure environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'riwaaz_heritage_curator_auth_secret_autumn_2026';

// In-memory sliding-window rate limiter for sensitive admin login attempts
interface RateLimitRecord {
  attempts: number;
  lastAttempt: number;
  lockoutUntil: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

/**
 * Validates email format using standard regex
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Validates password strength & format
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }
  if (password.length > 128) {
    return { valid: false, error: 'Password exceeds maximum length limit' };
  }
  return { valid: true };
}

/**
 * Cryptographic password hashing using Node scrypt
 */
export function hashPassword(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return {
    hash: derivedKey.toString('hex'),
    salt,
  };
}

/**
 * Timing-attack resistant password verification
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  if (!password || !hash || !salt) return false;
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(hash, 'hex');
    if (derivedKey.length !== storedBuffer.length) return false;
    return crypto.timingSafeEqual(derivedKey, storedBuffer);
  } catch (err) {
    console.error('[AUTH] Password verification error:', err);
    return false;
  }
}

/**
 * Checks and records rate limit for an IP address
 */
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfterSec?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  // Check if currently locked out
  if (record.lockoutUntil > now) {
    const retryAfterSec = Math.ceil((record.lockoutUntil - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  // If window expired, reset attempts
  if (now - record.lastAttempt > WINDOW_MS) {
    rateLimitStore.delete(ip);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.attempts);
  return { allowed: remaining > 0, remaining };
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(ip: string): { remaining: number; lockedOut: boolean; retryAfterSec?: number } {
  const now = Date.now();
  let record = rateLimitStore.get(ip);

  if (!record || now - record.lastAttempt > WINDOW_MS) {
    record = { attempts: 1, lastAttempt: now, lockoutUntil: 0 };
  } else {
    record.attempts += 1;
    record.lastAttempt = now;
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockoutUntil = now + LOCKOUT_MS;
    rateLimitStore.set(ip, record);
    return {
      remaining: 0,
      lockedOut: true,
      retryAfterSec: Math.ceil(LOCKOUT_MS / 1000),
    };
  }

  rateLimitStore.set(ip, record);
  return {
    remaining: MAX_ATTEMPTS - record.attempts,
    lockedOut: false,
  };
}

/**
 * Reset rate limit counter upon successful authentication
 */
export function resetRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token
 */
export function createAdminToken(user: { id: string; email: string; role: string; name: string }): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 12 * 3600, // 12 hours validity
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(dataToSign)
    .digest('base64url');

  return `${dataToSign}.${signature}`;
}

/**
 * Verifies and decodes an HMAC-SHA256 token
 */
export function verifyAdminToken(token: string): { valid: boolean; user?: any; error?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'No token provided' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Malformed token structure' };
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(dataToSign)
    .digest('base64url');

  try {
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isSignatureValid) {
      return { valid: false, error: 'Invalid token signature' };
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Session expired. Please log in again.' };
    }

    return { valid: true, user: payload };
  } catch (err: any) {
    return { valid: false, error: 'Token verification failed: ' + err.message };
  }
}
