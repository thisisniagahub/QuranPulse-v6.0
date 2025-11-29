-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text,
  avatar_url text,
  xp_total integer default 0,
  barakah_points integer default 0,
  streak integer default 0,
  last_read_surah integer default 1,
  last_read_ayah integer default 1,
  joined_at timestamp with time zone default timezone('utc'::text, now())
);

-- QURAN SURAHS (Metadata)
create table public.surahs (
  number integer primary key,
  name_simple text not null,
  name_complex text,
  name_arabic text,
  verses_count integer,
  revelation_place text,
  revelation_order integer
);

-- QURAN AYAHS (The Text)
create table public.ayahs (
  id serial primary key,
  surah_number integer references public.surahs(number),
  ayah_number integer,
  text_uthmani text, -- The main Arabic text
  text_imlaei text, -- Simple Arabic for search
  page_number integer,
  juz_number integer
);

-- TRANSLATIONS (Grounded Data)
create table public.translations (
  id serial primary key,
  ayah_id integer references public.ayahs(id),
  text text,
  language_code text default 'en', -- 'en' or 'ms'
  resource_name text -- e.g., 'Sahih International'
);

-- BOOKMARKS
create table public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  surah_number integer,
  ayah_number integer,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS POLICIES (Security)
alter table public.profiles enable row level security;
alter table public.surahs enable row level security;
alter table public.ayahs enable row level security;
alter table public.translations enable row level security;
alter table public.bookmarks enable row level security;

-- Public read access for Quran data
create policy "Public surahs are viewable by everyone" on public.surahs for select using (true);
create policy "Public ayahs are viewable by everyone" on public.ayahs for select using (true);
create policy "Public translations are viewable by everyone" on public.translations for select using (true);

-- User specific access
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can view own bookmarks" on public.bookmarks for select using (auth.uid() = user_id);
create policy "Users can insert own bookmarks" on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "Users can delete own bookmarks" on public.bookmarks for delete using (auth.uid() = user_id);

-- TRIGGER: Create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
