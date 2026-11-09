-- Rode no SQL Editor do Supabase (necessário depois de ativar o login com Google).
-- Quem entra com Google passa a ser o papel "authenticated", não "anon".
create policy "acesso autenticado" on agendamentos
  for all to authenticated using (true) with check (true);
