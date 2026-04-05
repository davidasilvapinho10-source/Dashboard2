export type StatusChamado = "aberto" | "em_andamento" | "resolvido" | "critico";

export interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  status: StatusChamado;
  setor: string;
  responsavel: string;
  prioridade: "baixa" | "media" | "alta";
  createdAt: string;
}

export interface DashboardMetricas {
  total: number;
  abertos: number;
  emAndamento: number;
  resolvidos: number;
  criticos: number;
  tendencia7dias: number;
}
