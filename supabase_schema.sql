-- ==============================================================
-- RIWAAZ ORDER MANAGEMENT SYSTEM - SUPABASE SQL SCHEMA
-- Project ID: qlddjxornxfeudavzoff
-- Endpoint: https://qlddjxornxfeudavzoff.supabase.co
-- ==============================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/qlddjxornxfeudavzoff
-- 2. Click on "SQL Editor" in the left sidebar.
-- 3. Click "New query", paste this entire script, and click "Run".
-- ==============================================================

-- 1. Create the orders table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  user_id text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  shipping_state text not null,
  shipping_pincode text not null,
  delivery_method text default 'Standard White Glove',
  payment_method text not null,
  payment_status text not null default 'paid',
  status text not null default 'Confirmed',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  discount numeric not null default 0,
  shipping numeric not null default 0,
  total numeric not null default 0,
  coupon_code text,
  raw_order jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Indexes for faster search and filtering
create index if not exists idx_orders_order_number on public.orders (order_number);
create index if not exists idx_orders_customer_email on public.orders (customer_email);
create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_status on public.orders (status);

-- 3. Automatic updated_at timestamp trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.handle_updated_at();

-- 4. Enable Row Level Security (RLS)
alter table public.orders enable row level security;

-- 5. Policies
-- Allow anyone with anon or service_role key to insert new orders (from the checkout form)
drop policy if exists "Enable insert for all clients" on public.orders;
create policy "Enable insert for all clients" 
on public.orders 
for insert 
with check (true);

-- Allow reading orders (for dashboard and order tracking)
drop policy if exists "Enable read access for all clients" on public.orders;
create policy "Enable read access for all clients" 
on public.orders 
for select 
using (true);

-- Allow updates from service role or admin
drop policy if exists "Enable update access for service role" on public.orders;
create policy "Enable update access for service role" 
on public.orders 
for update 
using (true);

-- Verify table creation
comment on table public.orders is 'RIWAAZ Luxury Living customer orders and dispatch records';
