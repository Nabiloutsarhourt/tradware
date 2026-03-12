-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ROLES ENUM
create type user_role as enum ('client', 'translator', 'admin');

-- USERS TABLE (Extends Supabase Auth users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null,
  role user_role default 'client'::user_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Users
alter table public.users enable row level security;
create policy "Users can view their own profile" on public.users for select using (auth.uid() = id);
create policy "Admins can view all profiles" on public.users for select using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- TRANSLATORS PROFILE TABLE
create table public.translators (
  id uuid references public.users(id) on delete cascade primary key,
  languages_spoken text[] not null default '{}',
  certification_url text,
  is_verified boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Translators
alter table public.translators enable row level security;
create policy "Anyone can view verified translators" on public.translators for select using (is_verified = true);
create policy "Translators can update their own profile" on public.translators for update using (auth.uid() = id);

-- DOCUMENTS TABLE
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  file_url text not null,
  file_name text not null,
  page_count integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Documents
alter table public.documents enable row level security;
create policy "Users can view their own documents" on public.documents for select using (auth.uid() = user_id);
create policy "Users can insert documents" on public.documents for insert with check (auth.uid() = user_id);

-- TRANSLATION ORDERS TABLE
create type order_status as enum ('pending', 'assigned', 'in_progress', 'completed', 'cancelled');
create type translation_type as enum ('certified', 'standard');

create table public.translation_orders (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.users(id) on delete restrict not null,
  translator_id uuid references public.translators(id) on delete set null,
  document_id uuid references public.documents(id) on delete cascade not null,
  source_language text not null,
  target_language text not null,
  type translation_type not null default 'certified',
  price numeric(10, 2) not null,
  status order_status default 'pending'::order_status not null,
  translated_document_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Orders
alter table public.translation_orders enable row level security;
create policy "Clients can view own orders" on public.translation_orders for select using (auth.uid() = client_id);
create policy "Translators can view assigned orders" on public.translation_orders for select using (auth.uid() = translator_id);
create policy "Admins can manage all orders" on public.translation_orders for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

create policy "Translators can view assigned documents" on public.documents for select using (
  exists (select id from translation_orders where translation_orders.document_id = public.documents.id and translator_id = auth.uid())
);

-- PAYMENTS TABLE
create type payment_status as enum ('pending', 'completed', 'failed');

create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.translation_orders(id) on delete cascade not null,
  amount numeric(10, 2) not null,
  stripe_session_id text,
  status payment_status default 'pending'::payment_status not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Payments
alter table public.payments enable row level security;
create policy "Clients can view own payments" on public.payments for select using (
  exists (select 1 from public.translation_orders where id = order_id and client_id = auth.uid())
);
