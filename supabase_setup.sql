-- =============================================================================
-- STUDIO MAURIZIO VINCI — PORTALE STUDIO
-- Fase 1: Architettura Dati e Fondamenta
-- =============================================================================
-- Script SQL idempotente per l'SQL Editor di Supabase.
--
-- REGOLE DI ISOLAMENTO (istanza Supabase condivisa multi-app):
--   1. Tutte le tabelle di questo progetto usano il prefisso mv_ .
--      Nessuna tabella priva di questo prefisso viene toccata o interrogata.
--   2. auth.users e' condivisa: ogni utente di questa app ha
--      user_metadata->>'app' = 'maurizio_vinci'.
--   3. mv_profiles viene popolata dal trigger SOLO per gli utenti con quel
--      metadato, cosi' da non interferire con altre app sulla stessa istanza.
--   4. Storage isolato nel bucket dedicato mv-storage.
--   5. RLS attiva e rigorosa su ogni tabella mv_*.
--
-- Lo script e' eseguibile piu' volte senza errori (IF NOT EXISTS, OR REPLACE,
-- DROP ... IF EXISTS prima di ricreare policy/trigger).
-- =============================================================================


-- =============================================================================
-- 0. ESTENSIONI NECESSARIE
-- =============================================================================
create extension if not exists "pgcrypto"; -- per gen_random_uuid()


-- =============================================================================
-- 1. TIPI ENUM (creati in modo idempotente)
-- =============================================================================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'mv_user_role') then
    create type mv_user_role as enum ('admin', 'client');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'mv_project_status') then
    create type mv_project_status as enum ('in_analisi', 'strategia', 'in_corso', 'completato');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'mv_budget_preference') then
    create type mv_budget_preference as enum (
      'quantifico_disponibilita',
      'stabilire_in_base_necessita',
      'proporzionale_margine_volumi',
      'non_ne_ho_idea'
    );
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'mv_lead_status') then
    create type mv_lead_status as enum ('nuovo', 'in_valutazione', 'contattato', 'archiviato', 'convertito');
  end if;
end
$$;


-- =============================================================================
-- 2. FUNZIONE DI SUPPORTO — updated_at automatico (riusata da piu' tabelle)
-- =============================================================================
create or replace function public.mv_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- =============================================================================
-- 3. TABELLA PROFILI (mv_profiles) — collegata a auth.users
-- =============================================================================
create table if not exists public.mv_profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text not null,
  full_name     text,
  company_name  text,
  phone         text,
  role          mv_user_role not null default 'client',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.mv_profiles is 'Profili utente Studio Maurizio Vinci (app=maurizio_vinci). Isolato dalle altre app sulla stessa istanza Supabase.';

drop trigger if exists mv_profiles_set_updated_at on public.mv_profiles;
create trigger mv_profiles_set_updated_at
  before update on public.mv_profiles
  for each row execute function public.mv_set_updated_at();


-- =============================================================================
-- 4. TABELLA PROGETTI (mv_projects)
-- =============================================================================
create table if not exists public.mv_projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  client_id     uuid references public.mv_profiles (id) on delete set null,
  status        mv_project_status not null default 'in_analisi',
  budget_range  text,
  deadline      date,
  note          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.mv_projects is 'Progetti clienti Studio Maurizio Vinci. Namespace isolato (mv_).';

drop trigger if exists mv_projects_set_updated_at on public.mv_projects;
create trigger mv_projects_set_updated_at
  before update on public.mv_projects
  for each row execute function public.mv_set_updated_at();

create index if not exists mv_projects_client_id_idx on public.mv_projects (client_id);


-- =============================================================================
-- 5. TABELLA LEAD (mv_leads) — form "Richiedi un'idea di progetto"
--    Campi allineati al brief pubblico in tre sezioni: dati personali,
--    dati azienda, progetto in breve.
-- =============================================================================
create table if not exists public.mv_leads (
  id                     uuid primary key default gen_random_uuid(),

  -- I tuoi dati
  nome                   text not null,
  cognome                text,
  email                  text not null,
  telefono               text not null,

  -- I dati dell'azienda
  ragione_sociale        text not null,
  posizione_azienda      text,
  descrizione_azienda    text,
  sito_web               text,

  -- Il progetto in breve
  nome_progetto          text,
  obiettivi              text not null,
  budget_preferenza      mv_budget_preference,
  info_generali          text not null,
  deadline               date,
  allegato_path          text, -- percorso file nel bucket mv-storage (es. leads/<id>/brief.pdf)

  -- Gestione interna (Admin)
  status                 mv_lead_status not null default 'nuovo',
  note_interne           text,
  converted_project_id   uuid references public.mv_projects (id) on delete set null,

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

comment on table public.mv_leads is 'Richieste "Idea di progetto" dal sito pubblico Studio Maurizio Vinci. Inserimento anonimo consentito, lettura riservata all''admin.';

drop trigger if exists mv_leads_set_updated_at on public.mv_leads;
create trigger mv_leads_set_updated_at
  before update on public.mv_leads
  for each row execute function public.mv_set_updated_at();

-- Collegamento opzionale progetto -> lead di origine
alter table public.mv_projects
  add column if not exists lead_id uuid references public.mv_leads (id) on delete set null;


-- =============================================================================
-- 6. TABELLA DOCUMENTI (mv_documents)
-- =============================================================================
create table if not exists public.mv_documents (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.mv_projects (id) on delete cascade,
  uploaded_by   uuid references public.mv_profiles (id) on delete set null,
  file_name     text not null,
  file_path     text not null, -- percorso nel bucket mv-storage
  file_size     bigint,
  created_at    timestamptz not null default now()
);

comment on table public.mv_documents is 'Documenti/deliverable collegati ai progetti, file fisico su bucket mv-storage.';

create index if not exists mv_documents_project_id_idx on public.mv_documents (project_id);


-- =============================================================================
-- 7. TABELLA NOTIFICHE (mv_notifications) — solo in-app, nessun servizio email
-- =============================================================================
create table if not exists public.mv_notifications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.mv_profiles (id) on delete cascade,
  title         text not null,
  message       text not null,
  link          text,
  read          boolean not null default false,
  created_at    timestamptz not null default now()
);

comment on table public.mv_notifications is 'Notifiche in-app (nessun servizio email esterno). Popolata da trigger sugli eventi di dominio.';

create index if not exists mv_notifications_user_id_idx on public.mv_notifications (user_id, read);


-- =============================================================================
-- 8. TRIGGER DI REGISTRAZIONE — popola mv_profiles SOLO per app=maurizio_vinci
-- =============================================================================
-- IMPORTANTE: auth.users e' condivisa con altre app. Usiamo un nome di
-- trigger dedicato/namespaced (mv_on_auth_user_created) per non collidere con
-- eventuali trigger "on_auth_user_created" di altre applicazioni sulla stessa
-- istanza. Il filtro su raw_user_meta_data->>'app' garantisce che utenti di
-- altre app non finiscano mai in mv_profiles.
create or replace function public.mv_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.raw_user_meta_data->>'app' = 'maurizio_vinci' then
    insert into public.mv_profiles (id, email, full_name, company_name, phone, role)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'company_name',
      new.raw_user_meta_data->>'phone',
      coalesce((new.raw_user_meta_data->>'role')::mv_user_role, 'client')
    )
    on conflict (id) do nothing;

    -- Notifica a tutti gli admin: nuovo cliente registrato
    insert into public.mv_notifications (user_id, title, message, link)
    select p.id,
           'Nuovo cliente registrato',
           coalesce(new.raw_user_meta_data->>'full_name', new.email) || ' si è appena registrato.',
           '/admin/clienti'
    from public.mv_profiles p
    where p.role = 'admin';
  end if;

  return new;
end;
$$;

drop trigger if exists mv_on_auth_user_created on auth.users;
create trigger mv_on_auth_user_created
  after insert on auth.users
  for each row execute function public.mv_handle_new_user();


-- =============================================================================
-- 9. TRIGGER DI DOMINIO — NOTIFICHE AUTOMATICHE IN-APP
-- =============================================================================

-- 9.1 Nuovo lead -> notifica tutti gli admin
create or replace function public.mv_notify_new_lead()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.mv_notifications (user_id, title, message, link)
  select p.id,
         'Nuova richiesta idea di progetto',
         coalesce(new.ragione_sociale, new.nome) || ' ha inviato una nuova richiesta.',
         '/admin/leads/' || new.id
  from public.mv_profiles p
  where p.role = 'admin';

  return new;
end;
$$;

drop trigger if exists mv_leads_notify_admin on public.mv_leads;
create trigger mv_leads_notify_admin
  after insert on public.mv_leads
  for each row execute function public.mv_notify_new_lead();


-- 9.2 Cambio stato progetto -> notifica il cliente
create or replace function public.mv_notify_project_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status and new.client_id is not null then
    insert into public.mv_notifications (user_id, title, message, link)
    values (
      new.client_id,
      'Aggiornamento progetto',
      'Il progetto "' || new.title || '" e'' passato allo stato: ' || new.status,
      '/portale/progetti/' || new.id
    );
  end if;

  return new;
end;
$$;

drop trigger if exists mv_projects_notify_status_change on public.mv_projects;
create trigger mv_projects_notify_status_change
  after update on public.mv_projects
  for each row execute function public.mv_notify_project_status_change();


-- 9.3 Nuovo documento caricato -> notifica la controparte
--     cliente carica -> notifica admin ; admin carica -> notifica cliente
create or replace function public.mv_notify_new_document()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  uploader_role mv_user_role;
  proj record;
begin
  select role into uploader_role from public.mv_profiles where id = new.uploaded_by;

  select id, title, client_id into proj from public.mv_projects where id = new.project_id;

  if uploader_role = 'client' then
    -- notifica tutti gli admin
    insert into public.mv_notifications (user_id, title, message, link)
    select p.id,
           'Nuovo documento dal cliente',
           'Nuovo file "' || new.file_name || '" caricato sul progetto "' || proj.title || '".',
           '/admin/progetti/' || proj.id
    from public.mv_profiles p
    where p.role = 'admin';
  else
    -- notifica il cliente del progetto
    if proj.client_id is not null then
      insert into public.mv_notifications (user_id, title, message, link)
      values (
        proj.client_id,
        'Nuovo deliverable disponibile',
        'E'' stato caricato un nuovo file "' || new.file_name || '" sul tuo progetto "' || proj.title || '".',
        '/portale/progetti/' || proj.id
      );
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists mv_documents_notify on public.mv_documents;
create trigger mv_documents_notify
  after insert on public.mv_documents
  for each row execute function public.mv_notify_new_document();


-- =============================================================================
-- 10. FUNZIONE HELPER RLS — verifica se l'utente corrente e' admin
-- =============================================================================
create or replace function public.mv_is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.mv_profiles
    where id = auth.uid() and role = 'admin'
  );
$$;


-- =============================================================================
-- 11. ROW LEVEL SECURITY — abilitazione su tutte le tabelle mv_*
-- =============================================================================
alter table public.mv_profiles      enable row level security;
alter table public.mv_leads         enable row level security;
alter table public.mv_projects      enable row level security;
alter table public.mv_documents     enable row level security;
alter table public.mv_notifications enable row level security;


-- ---------- mv_profiles ----------
drop policy if exists mv_profiles_select_own_or_admin on public.mv_profiles;
create policy mv_profiles_select_own_or_admin
  on public.mv_profiles for select
  to authenticated
  using (id = auth.uid() or public.mv_is_admin());

drop policy if exists mv_profiles_update_own_or_admin on public.mv_profiles;
create policy mv_profiles_update_own_or_admin
  on public.mv_profiles for update
  to authenticated
  using (id = auth.uid() or public.mv_is_admin())
  with check (id = auth.uid() or public.mv_is_admin());
-- Nessuna policy INSERT/DELETE diretta: la riga viene creata dal trigger
-- mv_handle_new_user (security definer) alla registrazione.


-- ---------- mv_leads ----------
-- Chiunque (anche anonimo) puo' inviare il form "Richiedi idea di progetto".
drop policy if exists mv_leads_insert_public on public.mv_leads;
create policy mv_leads_insert_public
  on public.mv_leads for insert
  to anon, authenticated
  with check (true);

-- Solo l'admin legge/gestisce i lead.
drop policy if exists mv_leads_select_admin on public.mv_leads;
create policy mv_leads_select_admin
  on public.mv_leads for select
  to authenticated
  using (public.mv_is_admin());

drop policy if exists mv_leads_update_admin on public.mv_leads;
create policy mv_leads_update_admin
  on public.mv_leads for update
  to authenticated
  using (public.mv_is_admin())
  with check (public.mv_is_admin());

drop policy if exists mv_leads_delete_admin on public.mv_leads;
create policy mv_leads_delete_admin
  on public.mv_leads for delete
  to authenticated
  using (public.mv_is_admin());


-- ---------- mv_projects ----------
drop policy if exists mv_projects_select_own_or_admin on public.mv_projects;
create policy mv_projects_select_own_or_admin
  on public.mv_projects for select
  to authenticated
  using (client_id = auth.uid() or public.mv_is_admin());

drop policy if exists mv_projects_insert_admin on public.mv_projects;
create policy mv_projects_insert_admin
  on public.mv_projects for insert
  to authenticated
  with check (public.mv_is_admin());

drop policy if exists mv_projects_update_admin on public.mv_projects;
create policy mv_projects_update_admin
  on public.mv_projects for update
  to authenticated
  using (public.mv_is_admin())
  with check (public.mv_is_admin());

drop policy if exists mv_projects_delete_admin on public.mv_projects;
create policy mv_projects_delete_admin
  on public.mv_projects for delete
  to authenticated
  using (public.mv_is_admin());


-- ---------- mv_documents ----------
drop policy if exists mv_documents_select_own_or_admin on public.mv_documents;
create policy mv_documents_select_own_or_admin
  on public.mv_documents for select
  to authenticated
  using (
    public.mv_is_admin()
    or exists (
      select 1 from public.mv_projects pr
      where pr.id = mv_documents.project_id and pr.client_id = auth.uid()
    )
  );

-- Admin puo' caricare documenti su qualsiasi progetto; il cliente solo sui
-- propri progetti.
drop policy if exists mv_documents_insert_own_or_admin on public.mv_documents;
create policy mv_documents_insert_own_or_admin
  on public.mv_documents for insert
  to authenticated
  with check (
    public.mv_is_admin()
    or exists (
      select 1 from public.mv_projects pr
      where pr.id = mv_documents.project_id and pr.client_id = auth.uid()
    )
  );

drop policy if exists mv_documents_delete_admin on public.mv_documents;
create policy mv_documents_delete_admin
  on public.mv_documents for delete
  to authenticated
  using (public.mv_is_admin());


-- ---------- mv_notifications ----------
-- Ogni utente vede/gestisce solo le proprie notifiche. L'inserimento avviene
-- esclusivamente tramite i trigger SECURITY DEFINER sopra (nessuna policy
-- INSERT per client/admin: evita che un utente possa scrivere notifiche a
-- nome di altri).
drop policy if exists mv_notifications_select_own on public.mv_notifications;
create policy mv_notifications_select_own
  on public.mv_notifications for select
  to authenticated
  using (user_id = auth.uid() or public.mv_is_admin());

drop policy if exists mv_notifications_update_own on public.mv_notifications;
create policy mv_notifications_update_own
  on public.mv_notifications for update
  to authenticated
  using (user_id = auth.uid() or public.mv_is_admin())
  with check (user_id = auth.uid() or public.mv_is_admin());

drop policy if exists mv_notifications_delete_own on public.mv_notifications;
create policy mv_notifications_delete_own
  on public.mv_notifications for delete
  to authenticated
  using (user_id = auth.uid() or public.mv_is_admin());


-- =============================================================================
-- 12. STORAGE — bucket isolato mv-storage + policy RLS
-- =============================================================================
-- Convenzione percorsi file:
--   leads/<lead_id>/<file_name>                 -> allegato brief lead pubblico
--   projects/<project_id>/<file_name>            -> documenti/deliverable progetto
--
-- Il primo segmento del path (storage.foldername(name)) indica il "tipo"
-- (leads|projects) e il secondo l'id di riferimento: le policy verificano
-- l'appartenenza del progetto/lead all'utente corrente o il ruolo admin.

insert into storage.buckets (id, name, public)
values ('mv-storage', 'mv-storage', false)
on conflict (id) do nothing;

-- Upload lead pubblico: chiunque puo' scrivere SOLO dentro leads/ (nessuna
-- lettura pubblica: il bucket resta privato, la lettura passa da URL firmate
-- generate lato server).
drop policy if exists mv_storage_leads_insert_public on storage.objects;
create policy mv_storage_leads_insert_public
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'mv-storage'
    and (storage.foldername(name))[1] = 'leads'
  );

-- Lettura file "leads/*": solo admin.
drop policy if exists mv_storage_leads_select_admin on storage.objects;
create policy mv_storage_leads_select_admin
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'mv-storage'
    and (storage.foldername(name))[1] = 'leads'
    and public.mv_is_admin()
  );

-- Lettura file "projects/<project_id>/*": admin oppure cliente proprietario
-- del progetto.
drop policy if exists mv_storage_projects_select on storage.objects;
create policy mv_storage_projects_select
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'mv-storage'
    and (storage.foldername(name))[1] = 'projects'
    and (
      public.mv_is_admin()
      or exists (
        select 1 from public.mv_projects pr
        where pr.id::text = (storage.foldername(name))[2]
          and pr.client_id = auth.uid()
      )
    )
  );

-- Scrittura file "projects/<project_id>/*": admin oppure cliente proprietario
-- del progetto.
drop policy if exists mv_storage_projects_insert on storage.objects;
create policy mv_storage_projects_insert
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'mv-storage'
    and (storage.foldername(name))[1] = 'projects'
    and (
      public.mv_is_admin()
      or exists (
        select 1 from public.mv_projects pr
        where pr.id::text = (storage.foldername(name))[2]
          and pr.client_id = auth.uid()
      )
    )
  );

-- Eliminazione file: solo admin.
drop policy if exists mv_storage_delete_admin on storage.objects;
create policy mv_storage_delete_admin
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'mv-storage'
    and public.mv_is_admin()
  );

-- =============================================================================
-- FINE SCRIPT — Fase 1 completata.
-- Prossimi passi consigliati (Fase 2): Server Actions per lead form, area
-- autenticazione (login/registrazione con user_metadata.app=maurizio_vinci),
-- dashboard admin e portale cliente.
-- =============================================================================
