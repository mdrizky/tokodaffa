create table if not exists public.contact_messages (
  id bigserial primary key,
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  source text default 'website-contact' not null,
  created_at timestamptz default now() not null,
  constraint contact_messages_email_chk check (position('@' in email) > 1)
);

create table if not exists public.reservations (
  id bigserial primary key,
  customer_name text not null,
  phone text not null,
  product_id bigint,
  product_name text not null,
  appointment_date timestamptz,
  notes text,
  status text default 'pending' not null,
  created_at timestamptz default now() not null,
  constraint reservations_status_chk check (status in ('pending', 'confirmed', 'completed', 'cancelled'))
);

create table if not exists public.wa_tracking_events (
  id bigserial primary key,
  event text not null,
  product_id bigint,
  product_name text,
  referrer text,
  tracked_at timestamptz default now() not null,
  constraint wa_tracking_event_chk check (event in ('product_inquiry', 'reservation_click', 'contact_click'))
);

create index if not exists idx_contact_messages_created_at on public.contact_messages(created_at desc);
create index if not exists idx_reservations_status on public.reservations(status);
create index if not exists idx_reservations_created_at on public.reservations(created_at desc);
create index if not exists idx_wa_tracking_event on public.wa_tracking_events(event);
create index if not exists idx_wa_tracking_tracked_at on public.wa_tracking_events(tracked_at desc);
