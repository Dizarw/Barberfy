import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, LogOut, Plus, Scissors, Trash2 } from "lucide-react";
import { supabase } from "./supabase";
import { SERVICOS, duracaoServico, minutosParaHora, nomeServico } from "./servicos";
import "./app.css";

type Agendamento = {
  id: string;
  service_id: string;
  data: string;
  inicio: number;
  nome: string;
  telefone: string;
};
type Aba = "agenda" | "novo" | "servicos";

const ABRE = 9 * 60;
const FECHA = 19 * 60;
const hojeISO = () => new Date().toLocaleDateString("sv-SE");

function formatarData(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long"
  });
}

export default function App() {
  const [aba, setAba] = useState<Aba>("agenda");
  const [lista, setLista] = useState<Agendamento[]>([]);
  const [erro, setErro] = useState("");

  const [servicoId, setServicoId] = useState(SERVICOS[0].id);
  const [data, setData] = useState(hojeISO());
  const [inicio, setInicio] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!supabase) {
      setErro("Supabase não conectado. Confira o arquivo .env.");
      return;
    }
    const { data: linhas, error } = await supabase
      .from("agendamentos")
      .select("id, service_id, data, inicio, nome, telefone")
      .order("data")
      .order("inicio");
    if (error) setErro("Não foi possível carregar a agenda: " + error.message);
    else {
      setErro("");
      setLista(linhas as Agendamento[]);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const horarios = useMemo(() => {
    const dur = duracaoServico(servicoId);
    const doDia = lista.filter((a) => a.data === data);
    const agora = new Date();
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
    const slots: { min: number; livre: boolean }[] = [];
    for (let s = ABRE; s + dur <= FECHA; s += 30) {
      const passou = data === hojeISO() && s <= minutosAgora;
      const ocupado = doDia.some((a) => s < a.inicio + duracaoServico(a.service_id) && a.inicio < s + dur);
      slots.push({ min: s, livre: !passou && !ocupado });
    }
    return slots;
  }, [lista, data, servicoId]);

  async function salvar() {
    if (!supabase) return;
    if (inicio === null || !nome.trim() || !telefone.trim()) {
      setErro("Escolha um horário e preencha nome e telefone.");
      return;
    }
    setSalvando(true);
    const { error } = await supabase.from("agendamentos").insert({
      service_id: servicoId,
      data,
      inicio,
      nome: nome.trim(),
      telefone: telefone.trim()
    });
    setSalvando(false);
    if (error) {
      setErro("Não foi possível salvar: " + error.message);
      return;
    }
    setNome("");
    setTelefone("");
    setInicio(null);
    await carregar();
    setAba("agenda");
  }

  async function remover(id: string) {
    if (!supabase || !confirm("Cancelar este agendamento?")) return;
    const { error } = await supabase.from("agendamentos").delete().eq("id", id);
    if (error) setErro("Não foi possível cancelar: " + error.message);
    else carregar();
  }

  const dias = useMemo(() => {
    const mapa = new Map<string, Agendamento[]>();
    lista
      .filter((a) => a.data >= hojeISO())
      .forEach((a) => mapa.set(a.data, [...(mapa.get(a.data) ?? []), a]));
    return [...mapa.entries()];
  }, [lista]);

  return (
    <div className="app">
      <header className="app-top">
        <div>
          <span className="app-logo">JJX</span>
          <span className="app-tag">SEU TEMPO, BEM CUIDADO</span>
        </div>
        <button className="icone" title="Sair" onClick={() => supabase?.auth.signOut()}>
          <LogOut size={18} />
        </button>
      </header>

      {erro && <p className="app-erro">{erro}</p>}

      <main className="app-main">
        {aba === "agenda" && (
          <section>
            <h2>Agenda</h2>
            {dias.length === 0 && <p className="vazio">Nenhum agendamento por enquanto.</p>}
            {dias.map(([dia, itens]) => (
              <div key={dia} className="dia">
                <h3>{formatarData(dia)}</h3>
                {itens.map((a) => (
                  <article key={a.id} className="cartao">
                    <strong className="hora">{minutosParaHora(a.inicio)}</strong>
                    <div className="info">
                      <span>{a.nome}</span>
                      <small>
                        {nomeServico(a.service_id)} · {a.telefone}
                      </small>
                    </div>
                    <button className="icone" title="Cancelar" onClick={() => remover(a.id)}>
                      <Trash2 size={16} />
                    </button>
                  </article>
                ))}
              </div>
            ))}
          </section>
        )}

        {aba === "novo" && (
          <section>
            <h2>Novo agendamento</h2>
            <label>Serviço</label>
            <select
              value={servicoId}
              onChange={(e) => {
                setServicoId(e.target.value);
                setInicio(null);
              }}
            >
              {SERVICOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome} ({s.minutos} min)
                </option>
              ))}
            </select>

            <label>Data</label>
            <input
              type="date"
              value={data}
              min={hojeISO()}
              onChange={(e) => {
                setData(e.target.value);
                setInicio(null);
              }}
            />

            <label>Horário</label>
            <div className="slots">
              {horarios.map((h) => (
                <button
                  key={h.min}
                  disabled={!h.livre}
                  className={"slot" + (inicio === h.min ? " ativo" : "")}
                  onClick={() => setInicio(h.min)}
                >
                  {minutosParaHora(h.min)}
                </button>
              ))}
            </div>

            <label>Nome do cliente</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" />
            <label>Telefone</label>
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(11) 90000-0000"
              inputMode="tel"
            />

            <button className="primario" onClick={salvar} disabled={salvando}>
              {salvando ? "Salvando..." : "Agendar"}
            </button>
          </section>
        )}

        {aba === "servicos" && (
          <section>
            <h2>Serviços</h2>
            {SERVICOS.map((s) => (
              <article key={s.id} className="cartao">
                <div className="info">
                  <span>{s.nome}</span>
                  <small>{s.minutos} min</small>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <nav className="app-nav">
        <button className={aba === "agenda" ? "ativo" : ""} onClick={() => setAba("agenda")}>
          <CalendarDays size={20} />
          Agenda
        </button>
        <button className={aba === "novo" ? "ativo" : ""} onClick={() => setAba("novo")}>
          <Plus size={20} />
          Novo
        </button>
        <button className={aba === "servicos" ? "ativo" : ""} onClick={() => setAba("servicos")}>
          <Scissors size={20} />
          Serviços
        </button>
      </nav>
    </div>
  );
}
