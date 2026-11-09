create table agendamentos (
  id uuid primary key default gen_random_uuid(),
  service_id text not null,
  data date not null,
  inicio integer not null,
  nome text not null,
  telefone text not null,
  criado_em timestamptz default now()
);

alter table agendamentos enable row level security;

create policy "acesso total anon" on agendamentos
  for all to anon using (true) with check (true);

create view agenda_lista with (security_invoker = true) as
select nome, telefone, data,
       lpad((inicio / 60)::text, 2, '0') || ':' || lpad((inicio % 60)::text, 2, '0') as horario,
       service_id as servico
from agendamentos
order by data, inicio;
