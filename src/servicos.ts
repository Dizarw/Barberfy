export type Servico = { id: string; nome: string; minutos: number };

// Ajuste os nomes e as durações (em minutos) como quiser.
export const SERVICOS: Servico[] = [
  { id: "corte", nome: "Corte", minutos: 30 },
  { id: "escova", nome: "Escova", minutos: 30 },
  { id: "sobrancelha", nome: "Sobrancelha", minutos: 15 },
  { id: "hidratacao", nome: "Hidratação", minutos: 45 },
  { id: "barba", nome: "Barba", minutos: 30 },
  { id: "cabelo-barba", nome: "Cabelo + Barba", minutos: 60 },
  { id: "cabelo-sobrancelha", nome: "Cabelo + Sobrancelha", minutos: 45 },
  { id: "cabelo-barba-sobrancelha", nome: "Cabelo + Barba + Sobrancelha", minutos: 75 }
];

export const nomeServico = (id: string) => SERVICOS.find((s) => s.id === id)?.nome ?? id;
export const duracaoServico = (id: string) => SERVICOS.find((s) => s.id === id)?.minutos ?? 30;

export function minutosParaHora(min: number) {
  const h = String(Math.floor(min / 60)).padStart(2, "0");
  const m = String(min % 60).padStart(2, "0");
  return `${h}:${m}`;
}
