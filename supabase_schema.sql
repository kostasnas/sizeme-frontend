-- USERS PROFILE
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  height_cm integer,           -- Δηλώνεται μια φορά κατά setup
  gender text check (gender in ('male','female','unisex')),
  is_pro boolean default false,
  free_scans_used integer default 0,
  free_scans_reset_at timestamptz default now(),
  created_at timestamptz default now()
);

-- BODY SCANS
create table public.body_scans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  scan_type text check (scan_type in ('body','foot')),
  -- Body measurements (cm)
  bust_cm numeric,
  waist_cm numeric,
  hips_cm numeric,
  shoulder_width_cm numeric,
  inseam_cm numeric,
  -- Foot measurements (cm)
  foot_length_left numeric,
  foot_length_right numeric,
  foot_width_left numeric,
  foot_width_right numeric,
  foot_notes text,             -- "πλατύ πόδι", "bunion", κλπ
  -- Meta
  created_at timestamptz default now()
);

-- SIZE RESULTS (cached AI results)
create table public.size_results (
  id uuid default gen_random_uuid() primary key,
  scan_id uuid references public.body_scans(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  brand text not null,         -- "Zara", "Shein", κλπ
  category text not null,      -- "tops", "bottoms", "shoes"
  size_label text not null,    -- "M", "L", "42", "XL/XXL"
  size_notes text,             -- "πάρε ένα νούμερο μεγαλύτερο"
  affiliate_url text,          -- deep link προς brand
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.body_scans enable row level security;
alter table public.size_results enable row level security;

create policy "Users see own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users manage own scans" on public.body_scans for all using (auth.uid() = user_id);
create policy "Users see own results" on public.size_results for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Add children_data to profiles (run this if you already have the table)
alter table public.profiles
  add column if not exists children_data jsonb default '[]'::jsonb;
