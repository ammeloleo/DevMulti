begin;

-- Os cadastros existentes são preservados. O navegador usa apenas as funções abaixo.
alter table public.usuario enable row level security;
alter table public.postagens enable row level security;
revoke all on public.usuario, public.postagens from public, anon, authenticated;
revoke all ("HashSenha", email_user) on public.usuario from public, anon, authenticated;

create schema if not exists devmulti_privado;
revoke all on schema devmulti_privado from public, anon, authenticated;

create table if not exists devmulti_privado.tentativas_login (
  usuario_id bigint primary key references public.usuario(id) on delete cascade,
  total integer not null,
  reinicia_em timestamptz not null
);

create table if not exists devmulti_privado.sessoes (
  token_hash bytea primary key,
  usuario_id bigint not null references public.usuario(id) on delete cascade,
  expira_em timestamptz not null
);

create index if not exists devmulti_sessoes_usuario_idx
  on devmulti_privado.sessoes (usuario_id, expira_em);

create or replace function public.login_academico(email text, senha text, lembrar boolean)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  perfil_id bigint;
  senha_cadastrada text;
  token text;
begin
  if nullif(btrim(email), '') is null or length(email) > 320
    or nullif(senha, '') is null or octet_length(senha) > 4096 then
    return null;
  end if;

  begin
    select u.id, u."HashSenha" into strict perfil_id, senha_cadastrada
    from public.usuario u
    where lower(btrim(u.email_user)) = lower(btrim(email));
  exception
    when no_data_found or too_many_rows then return null;
  end;

  -- Registra a tentativa antes de validar a senha, inclusive em requisições simultâneas.
  insert into devmulti_privado.tentativas_login as t (usuario_id, total, reinicia_em)
  values (perfil_id, 1, now() + interval '15 minutes')
  on conflict (usuario_id) do update
  set total = case when t.reinicia_em <= now() then 1 else t.total + 1 end,
      reinicia_em = case when t.reinicia_em <= now() then excluded.reinicia_em else t.reinicia_em end
  where t.reinicia_em <= now() or t.total < 5;

  if not found or senha_cadastrada is null
    or sha256(convert_to(senha, 'UTF8')) <> sha256(convert_to(senha_cadastrada, 'UTF8')) then
    return null;
  end if;

  delete from devmulti_privado.tentativas_login where usuario_id = perfil_id;
  delete from devmulti_privado.sessoes where usuario_id = perfil_id and expira_em <= now();

  token := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
  insert into devmulti_privado.sessoes (token_hash, usuario_id, expira_em)
  values (
    sha256(convert_to(token, 'UTF8')),
    perfil_id,
    now() + case when lembrar then interval '7 days' else interval '8 hours' end
  );

  return token;
end;
$$;

create or replace function devmulti_privado.usuario_da_sessao(token text)
returns bigint
language plpgsql
stable
set search_path = ''
as $$
declare
  perfil_id bigint;
begin
  if token ~ '^[0-9a-f]{64}$' then
    select s.usuario_id into perfil_id
    from devmulti_privado.sessoes s
    where s.token_hash = sha256(convert_to(token, 'UTF8')) and s.expira_em > now();
  end if;

  if perfil_id is null then
    raise exception 'Sessão inválida ou expirada' using errcode = 'PT401';
  end if;

  return perfil_id;
end;
$$;

create or replace function public.inicio_academico(token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  perfil_id bigint := devmulti_privado.usuario_da_sessao(token);
  perfil jsonb;
  publicacoes jsonb;
begin
  select jsonb_build_object(
    'id', u.id::text, 'nome', u.nome, 'curso', u.curso, 'termo', u.termo, 'events', u.events
  ) into perfil
  from public.usuario u
  where u.id = perfil_id;

  select coalesce(jsonb_agg(to_jsonb(p) order by p.data desc nulls last, p.id desc), '[]'::jsonb)
  into publicacoes
  from (
    select p.id, p.titulo, p.text, p.data, p.curtidas, u.nome as autor, u.termo
    from public.postagens p
    left join public.usuario u on u.id = p.id_usuario
    order by p.data desc nulls last, p.id desc
    limit 3
  ) p;

  return jsonb_build_object('perfil', perfil, 'publicacoes', publicacoes);
end;
$$;

create or replace function public.adicionar_evento_academico(token text, novo_evento jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  perfil_id bigint := devmulti_privado.usuario_da_sessao(token);
  eventos_atualizados jsonb;
begin
  if coalesce(btrim(novo_evento ->> 'title'), '') = ''
    or coalesce(novo_evento ->> 'type', '') not in ('prova', 'trabalho', 'evento')
    or coalesce(novo_evento ->> 'date', '') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    or (novo_evento ->> 'date')::date is null then
    raise exception 'Evento inválido' using errcode = '22023';
  end if;

  update public.usuario
  set events = array_append(coalesce(events, array[]::jsonb[]), novo_evento)
  where id = perfil_id
  returning to_jsonb(events) into eventos_atualizados;

  return eventos_atualizados;
end;
$$;

create or replace function public.publicar_academico(token text, titulo text, conteudo text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  perfil_id bigint := devmulti_privado.usuario_da_sessao(token);
begin
  insert into public.postagens (titulo, text, data, id_usuario, curtidas)
  values (titulo, conteudo, now(), perfil_id, 0);
end;
$$;

create or replace function public.sair_academico(token text)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from devmulti_privado.sessoes
  where token ~ '^[0-9a-f]{64}$' and token_hash = sha256(convert_to(token, 'UTF8'));
$$;

revoke all on function devmulti_privado.usuario_da_sessao(text) from public, anon, authenticated;
revoke all on function public.login_academico(text, text, boolean),
  public.inicio_academico(text), public.adicionar_evento_academico(text, jsonb),
  public.publicar_academico(text, text, text), public.sair_academico(text)
  from public, anon, authenticated;
grant execute on function public.login_academico(text, text, boolean),
  public.inicio_academico(text), public.adicionar_evento_academico(text, jsonb),
  public.publicar_academico(text, text, text), public.sair_academico(text)
  to anon;

notify pgrst, 'reload schema';

commit;
