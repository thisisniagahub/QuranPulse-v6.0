-- Create generic progress table for Iqra
create table if not exists public.iqra_progress (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    volume integer not null, -- 1 to 6
    lesson_id text not null, -- e.g., "L1-P3"
    score integer default 0, -- 0 to 100
    stars integer default 0, -- 1 to 3
    status text default 'completed', -- 'completed' | 'skipped'
    completed_at timestamptz default now(),
    
    -- Ensure user doesn't have duplicate entries for same lesson (keep latest/best)
    unique(user_id, lesson_id)
);

-- Enable RLS
alter table public.iqra_progress enable row level security;

-- Policies
create policy "Users can view own progress" 
    on public.iqra_progress for select 
    using (auth.uid() = user_id);

create policy "Users can insert/update own progress" 
    on public.iqra_progress for insert 
    with check (auth.uid() = user_id);

create policy "Users can update own progress" 
    on public.iqra_progress for update 
    using (auth.uid() = user_id);
