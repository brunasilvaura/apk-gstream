-- =====================================================================
-- CORREÇÃO: chave do aparelho não chegava na tabela "devices"
-- Rode no Supabase > SQL Editor (pode rodar tudo de uma vez, é repetível)
-- Não mexe em check_access, get_video, grants, lessons etc.
-- =====================================================================

-- 1) Tabela que o painel lê em "Aparelhos aguardando liberação"
create table if not exists public.devices (
  key text,
  last_seen timestamptz default now()
);
alter table public.devices add column if not exists last_seen timestamptz default now();
create unique index if not exists devices_key_uq on public.devices(key);

-- 2) Função chamada pelo app (continua com 1 parâmetro; p_dev é opcional)
drop function if exists public.register_device(text);
drop function if exists public.register_device(text, text);

create function public.register_device(p_key text, p_dev text default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare k text := upper(trim(coalesce(p_key,'')));
begin
  if k !~ '^[A-Z0-9]{4}-[A-Z0-9]{4}$' then return; end if;  -- ignora lixo
  insert into public.devices(key, last_seen)
  values (k, now())
  on conflict (key) do update set last_seen = now();
end;
$$;

revoke all on function public.register_device(text, text) from public;
grant execute on function public.register_device(text, text) to anon, authenticated;

-- 3) Permissões: só o painel (usuário logado) lê/apaga a tabela;
--    o app (anônimo) só consegue gravar pela função acima.
alter table public.devices enable row level security;
drop policy if exists devices_admin on public.devices;
create policy devices_admin on public.devices
  for all to authenticated using (true) with check (true);

-- 4) Teste: deve aparecer a linha TEST-0001 (depois pode apagar)
set role anon;
select public.register_device('TEST-0001');
reset role;
select * from public.devices order by last_seen desc limit 5;
-- delete from public.devices where key = 'TEST-0001';
