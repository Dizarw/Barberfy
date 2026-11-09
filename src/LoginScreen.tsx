import { useState } from "react";
import { CircleCheck } from "lucide-react";
import { supabase } from "./supabase";
import "./login.css";

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

// Se o Google/Supabase devolver um erro na volta, mostra na tela.
function erroDaUrl() {
  const params = new URLSearchParams(window.location.search + "&" + window.location.hash.replace("#", ""));
  const desc = params.get("error_description");
  return desc ? "Erro no login: " + desc.replace(/\+/g, " ") : "";
}

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(erroDaUrl);

  async function entrarComGoogle() {
    if (!supabase) {
      setErro("Supabase não conectado. Confira o arquivo .env e reinicie o npm run dev.");
      return;
    }
    setLoading(true);
    setErro("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
    if (error) {
      setErro("Não foi possível entrar. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <main className="login">
      <header className="login-brand">
        <span className="login-logo">JJX</span>
        <span className="login-tag">SEU TEMPO, BEM CUIDADO</span>
      </header>

      <section className="login-hero">
        <span className="login-pill">
          <CircleCheck size={16} />
          Um horário reservado. Um dia mais leve.
        </span>
        <h1>
          Seu dia organizado.
          <br />
          Seu talento em foco.
        </h1>
        <p>
          Gerencie os agendamentos da sua barbearia, seus clientes e serviços em
          um só lugar.
        </p>
      </section>

      <section className="login-actions">
        <button className="login-google" onClick={entrarComGoogle} disabled={loading}>
          <span className="login-google-icon">
            <GoogleIcon />
          </span>
          {loading ? "Abrindo o Google..." : "Continuar com Google"}
        </button>
        <small className="login-hint">Entre ou crie sua conta. Sem precisar de senha.</small>
        {erro && <small className="login-erro">{erro}</small>}
        <small className="login-terms">
          Ao continuar, você concorda com nossos
          <br />
          <a href="#termos">Termos de uso</a> e <a href="#privacidade">Política de privacidade</a>.
        </small>
      </section>
    </main>
  );
}
