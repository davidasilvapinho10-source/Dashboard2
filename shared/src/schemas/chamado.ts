import { z } from "zod";

export const chamadoSchema = z.object({
  titulo: z.string().min(3),
  descricao: z.string().min(5),
  status: z.enum(["aberto", "em_andamento", "resolvido", "critico"]),
  setor: z.string().min(2),
  responsavel: z.string().min(2),
  prioridade: z.enum(["baixa", "media", "alta"])
});

export type ChamadoInput = z.infer<typeof chamadoSchema>;
