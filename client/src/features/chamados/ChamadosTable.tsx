import type { Chamado } from "@manserv/shared";

const badgeClass: Record<string, string> = {
  aberto: "badge yellow",
  em_andamento: "badge blue",
  resolvido: "badge green",
  critico: "badge red"
};

export function ChamadosTable({ chamados }: { chamados: Chamado[] }) {
  return (
    <section>
      <h3>Tabela de Chamados</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Título</th><th>Status</th><th>Setor</th><th>Responsável</th><th>Prioridade</th><th>Data</th>
          </tr>
        </thead>
        <tbody>
          {chamados.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.titulo}</td>
              <td><span className={badgeClass[c.status]}>{c.status}</span></td>
              <td>{c.setor}</td>
              <td>{c.responsavel}</td>
              <td>{c.prioridade}</td>
              <td>{new Date(c.createdAt).toLocaleDateString("pt-BR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
