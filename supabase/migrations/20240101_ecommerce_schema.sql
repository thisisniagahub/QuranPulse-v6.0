
-- MIGRATION: E-Commerce & CMS Tables (Migrating from Google Sheets)

-- 1. APP CONFIG
create table public.app_config (
  key text primary key,
  value text,
  group_name text default 'FEATURES', -- 'FEATURES', 'THEME', etc.
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. PRODUCTS (Souq)
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  price numeric default 0,
  image text,
  category text, -- 'BOOK', 'CLOTHING', etc.
  stock integer default 0,
  description text,
  is_featured boolean default false,
  seller_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. ORDERS
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  customer_name text, -- Snapshot incase profile changes
  total_amount numeric default 0,
  items jsonb, -- Store snapshot of cart items
  status text default 'PENDING', -- 'PENDING', 'PAID', 'SHIPPED', 'COMPLETED'
  payment_status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. ANNOUNCEMENTS
create table public.announcements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  message text,
  type text default 'INFO', -- 'INFO', 'WARNING', 'SUCCESS'
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. SYSTEM LOGS
create table public.system_logs (
  id uuid default uuid_generate_v4() primary key,
  action text,
  details text,
  status text, -- 'SUCCESS', 'ERROR'
  user_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS POLICIES

-- Enable RLS
alter table public.app_config enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.announcements enable row level security;
alter table public.system_logs enable row level security;

-- Policies: App Config
create policy "Public can view config" on public.app_config for select using (true);
-- (Admin update policy would go here, assuming we have a role check or separate admin client)

-- Policies: Products
create policy "Public can view products" on public.products for select using (true);
create policy "Sellers can update own products" on public.products for update using (auth.uid() = seller_id);

-- Policies: Orders
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on public.orders for insert with check (auth.uid() = user_id);

-- Policies: Announcements
create policy "Public can view active announcements" on public.announcements for select using (is_active = true);

-- Policies: Logs
create policy "Admins can view logs" on public.system_logs for select using (false); -- Default deny public
