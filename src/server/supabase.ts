import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Order } from '../types/index.ts';

export function getSupabaseProjectId(): string {
  return (process.env.SUPABASE_PROJECT_ID || 'qlddjxornxfeudavzoff').trim();
}

export function getSupabaseUrl(): string {
  return (process.env.SUPABASE_URL || `https://${getSupabaseProjectId()}.supabase.co`).trim();
}

export function getSupabaseKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ''
  ).trim();
}

let cachedClient: SupabaseClient | null = null;
let cachedKey = '';
let cachedUrl = '';

export function getSupabaseConfig() {
  const projectId = getSupabaseProjectId();
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  const hasKey = Boolean(key && key !== 'your-supabase-anon-key-here');

  return {
    projectId,
    url,
    hasKey,
  };
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, hasKey } = getSupabaseConfig();
  const key = getSupabaseKey();

  if (!hasKey) return null;

  if (cachedClient && cachedKey === key && cachedUrl === url) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    cachedKey = key;
    cachedUrl = url;
    return cachedClient;
  } catch (err) {
    console.error('[Supabase] Failed to initialize Supabase client:', err);
    return null;
  }
}

export interface SupabaseSyncResult {
  success: boolean;
  orderNumber: string;
  projectId: string;
  message: string;
  error?: string;
  data?: any;
}

/**
 * Saves order details to the Supabase orders table
 */
export async function saveOrderToSupabase(order: Order): Promise<SupabaseSyncResult> {
  const config = getSupabaseConfig();

  // Prepare standard row data for public.orders table
  const orderRecord = {
    order_number: order.orderNumber,
    user_id: order.userId || null,
    customer_name: order.customer.fullName,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    shipping_address: order.shippingAddress.address,
    shipping_city: order.shippingAddress.city,
    shipping_state: order.shippingAddress.state,
    shipping_pincode: order.shippingAddress.pinCode,
    delivery_method: order.deliveryMethod,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    status: order.status,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: order.total,
    coupon_code: order.couponCode || null,
    raw_order: order,
    created_at: order.createdAt || new Date().toISOString()
  };

  if (!config.hasKey) {
    console.warn(`[Supabase] Order ${order.orderNumber} queued for project ${config.projectId}. To activate direct push, provide SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY in .env`);
    return {
      success: false,
      orderNumber: order.orderNumber,
      projectId: config.projectId,
      message: 'Supabase Project ID configured, awaiting API Key (SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY).',
      error: 'Missing SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY'
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      orderNumber: order.orderNumber,
      projectId: config.projectId,
      message: 'Supabase client could not be initialized.',
      error: 'Client initialization failed'
    };
  }

  try {
    // Attempt insert into 'orders' table
    const { data, error } = await client
      .from('orders')
      .insert([orderRecord])
      .select();

    if (error) {
      console.error(`[Supabase] Error inserting order ${order.orderNumber}:`, error.message);
      
      const isMissingTable = error.code === '42P01' || error.code === 'PGRST205' || error.message?.includes('schema cache');
      return {
        success: false,
        orderNumber: order.orderNumber,
        projectId: config.projectId,
        message: isMissingTable
          ? `Supabase table 'public.orders' not found. Run the SQL schema script in your Supabase SQL Editor (supabase.com/dashboard/project/${config.projectId}/sql/new) to activate instant database writes.`
          : `Failed to insert into table 'orders': ${error.message}`,
        error: error.message
      };
    }

    console.log(`[Supabase] Successfully saved order ${order.orderNumber} to Supabase project ${config.projectId}!`);
    return {
      success: true,
      orderNumber: order.orderNumber,
      projectId: config.projectId,
      message: `Order ${order.orderNumber} successfully saved in Supabase project ${config.projectId}.`,
      data
    };
  } catch (err: any) {
    console.error(`[Supabase] Unexpected exception saving order ${order.orderNumber}:`, err);
    return {
      success: false,
      orderNumber: order.orderNumber,
      projectId: config.projectId,
      message: 'Unexpected network or database error during Supabase sync.',
      error: err?.message || String(err)
    };
  }
}

/**
 * Checks connection status to the Supabase project
 */
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string; projectId: string; url: string }> {
  const config = getSupabaseConfig();

  if (!config.hasKey) {
    return {
      connected: false,
      projectId: config.projectId,
      url: config.url,
      message: 'Project ID is set to ' + config.projectId + '. Please configure SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY to authenticate.'
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      connected: false,
      projectId: config.projectId,
      url: config.url,
      message: 'Failed to create Supabase client instance.'
    };
  }

  try {
    const { error } = await client.from('orders').select('id').limit(1);
    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return {
          connected: true,
          projectId: config.projectId,
          url: config.url,
          message: `Connected to Supabase project ${config.projectId}! The "orders" table is not created yet. Copy and run the provided SQL schema in your Supabase SQL Editor.`
        };
      }
      return {
        connected: false,
        projectId: config.projectId,
        url: config.url,
        message: `Supabase returned error: ${error.message} (code ${error.code})`
      };
    }

    return {
      connected: true,
      projectId: config.projectId,
      url: config.url,
      message: `Connected successfully to Supabase project ${config.projectId} and verified "orders" table!`
    };
  } catch (err: any) {
    return {
      connected: false,
      projectId: config.projectId,
      url: config.url,
      message: `Network failure connecting to ${config.url}: ${err.message}`
    };
  }
}
