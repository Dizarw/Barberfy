import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import LoginScreen from "./LoginScreen";

// Mostra o login primeiro; só abre o app depois que a pessoa entrar.
export default function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setPronto(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setPronto(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_evento, nova) => setSession(nova));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!pronto) return null;
  return session ? <>{children}</> : <LoginScreen />;
}
