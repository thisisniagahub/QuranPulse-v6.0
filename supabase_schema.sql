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
  level integer default 1,
  badges jsonb default '[]'::jsonb,
  last_read_surah integer default 1,
  last_read_ayah integer default 1,
  khatam_count integer default 0,
  total_verses_read integer default 0,
  joined_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
-- USER SETTINGS (Preferences)
create table public.user_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) unique,
  arabic_font_size integer default 28,
  translation_font_size integer default 14,
  preferred_reciter_id integer default 7,
  preferred_translation_id integer default 131,
  theme text default 'dark',
  auto_scroll boolean default false,
  word_by_word boolean default true,
  show_transliteration boolean default true,
  notifications_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
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
  text_uthmani text,
  -- The main Arabic text
  text_imlaei text,
  -- Simple Arabic for search
  page_number integer,
  juz_number integer
);
-- TRANSLATIONS (Grounded Data)
create table public.translations (
  id serial primary key,
  ayah_id integer references public.ayahs(id),
  text text,
  language_code text default 'en',
  -- 'en' or 'ms'
  resource_name text -- e.g., 'Sahih International'
);
-- BOOKMARKS
create table public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  surah_number integer,
  ayah_number integer,
  verse_key text,
  -- e.g. "2:255"
  note text,
  -- Optional user note
  folder text default 'default',
  created_at timestamp with time zone default timezone('utc'::text, now())
);
-- READING HISTORY
create table public.reading_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  surah_number integer,
  ayah_number integer,
  verse_key text,
  duration_seconds integer default 0,
  -- How long user spent reading
  completed boolean default false,
  -- Did they finish the session?
  session_date date default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
-- RLS POLICIES (Security)
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.surahs enable row level security;
alter table public.ayahs enable row level security;
alter table public.translations enable row level security;
alter table public.bookmarks enable row level security;
alter table public.reading_history enable row level security;
-- Public read access for Quran data
create policy "Public surahs are viewable by everyone" on public.surahs for
select using (true);
create policy "Public ayahs are viewable by everyone" on public.ayahs for
select using (true);
create policy "Public translations are viewable by everyone" on public.translations for
select using (true);
-- User specific access - Profiles
create policy "Users can view own profile" on public.profiles for
select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for
update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for
insert with check (auth.uid() = id);
-- User specific access - Settings
create policy "Users can view own settings" on public.user_settings for
select using (auth.uid() = user_id);
create policy "Users can insert own settings" on public.user_settings for
insert with check (auth.uid() = user_id);
create policy "Users can update own settings" on public.user_settings for
update using (auth.uid() = user_id);
-- User specific access - Bookmarks
create policy "Users can view own bookmarks" on public.bookmarks for
select using (auth.uid() = user_id);
create policy "Users can insert own bookmarks" on public.bookmarks for
insert with check (auth.uid() = user_id);
create policy "Users can update own bookmarks" on public.bookmarks for
update using (auth.uid() = user_id);
create policy "Users can delete own bookmarks" on public.bookmarks for delete using (auth.uid() = user_id);
-- User specific access - Reading History
create policy "Users can view own reading history" on public.reading_history for
select using (auth.uid() = user_id);
create policy "Users can insert own reading history" on public.reading_history for
insert with check (auth.uid() = user_id);
create policy "Users can update own reading history" on public.reading_history for
update using (auth.uid() = user_id);
-- TRIGGER: Create profile on signup
create or replace function public.handle_new_user() returns trigger as $$ begin
insert into public.profiles (id, email, name)
values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name'
  );
-- Also create default settings
insert into public.user_settings (user_id)
values (new.id);
return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();
-- INDEXES for performance
create index idx_bookmarks_user_id on public.bookmarks(user_id);
create index idx_reading_history_user_id on public.reading_history(user_id);
create index idx_reading_history_session_date on public.reading_history(session_date);
create index idx_ayahs_surah_number on public.ayahs(surah_number);