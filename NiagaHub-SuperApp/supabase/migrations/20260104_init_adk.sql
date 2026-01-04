-- Create a table for Agent Logs (ADK Persistence) to SYNC everything
create table agent_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  mission_id text not null,
  agent_name text not null,
  input text,
  output text,
  metadata jsonb
);

-- Enable RLS for security
alter table agent_logs enable row level security;

-- Policy: Allow all inserts (Simulated "Internal" access for now)
create policy "Enable insert for authenticated users only"
on agent_logs for insert
to authenticated
with check (true);

-- Policy: Allow read for admin dashboard
create policy "Enable read for users"
on agent_logs for select
to authenticated
using (true);
