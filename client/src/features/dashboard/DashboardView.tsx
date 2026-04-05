import type { DashboardMetricas } from "@manserv/shared";

export function DashboardView({ metrics, heatMap }: { metrics: DashboardMetricas; heatMap: { key: number; val: number }[] }) {
  const cards = [
    ["Total", metrics.total],
    ["Abertos", metrics.abertos],
    ["Em Andamento", metrics.emAndamento],
    ["Resolvidos", metrics.resolvidos],
    ["Críticos", metrics.criticos],
    ["Tendência 7d", `${metrics.tendencia7dias}%`]
  ];

  return (
    <section>
      <div className="cards">
        {cards.map(([label, value]) => (
          <article key={String(label)} className="card">
            <small>{label}</small>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <div className="grafico-box">
        <h3>Matriz de Calor</h3>
        <div className="heatmap">
          {heatMap.map((cell) => (
            <span key={cell.key} style={{ opacity: 0.2 + cell.val / 10 }} />
          ))}
        </div>
      </div>
    </section>
  );
}
