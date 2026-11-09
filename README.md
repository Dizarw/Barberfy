# AgendaFácil (JJX)

1. Instale o Node.js 18+ (https://nodejs.org)
2. Na pasta do projeto: `npm install`
3. `npm run dev` e abra http://localhost:5173

Banco: rode `supabase.sql` e depois `supabase-login.sql` no SQL Editor do Supabase.
Login: ative o provedor Google em Authentication > Providers e adicione
http://localhost:5173 em Authentication > URL Configuration > Redirect URLs.

Supabase > Authentication > URL Configuration:
- Site URL: http://localhost:5173
- Redirect URLs: http://localhost:5173
O app sempre abre na porta 5173 (se ela estiver ocupada, feche o outro `npm run dev`).
