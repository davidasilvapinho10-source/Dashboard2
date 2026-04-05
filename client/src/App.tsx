import { useEffect, useMemo, useState } from "react";
import type { DashboardMetricas, Chamado } from "@manserv/shared";
import { DashboardView } from "./features/dashboard/DashboardView";
import { ChamadosTable } from "./features/chamados/ChamadosTable";
import { ChamadoForm } from "./features/chamados/ChamadoForm";

const API = "http://localhost:3333/api";

export function App() {
  const [metrics, setMetrics] = useState<DashboardMetricas | null>(null);
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const load = async () => {
    const qs = new URLSearchParams({ search, status, dateStart, dateEnd, page: "1", pageSize: "20" });
    const [m, c] = await Promise.all([
      fetch(`${API}/dashboard/metrics`).then((r) => r.json()),
      fetch(`${API}/chamados?${qs.toString()}`).then((r) => r.json())
    ]);
    setMetrics(m);
    setChamados(c.items);
  };

  useEffect(() => {
    void load();
  }, []);

  const heatMap = useMemo(() => {
    const slots = Array.from({ length: 7 * 4 }, (_, i) => ({
      key: i,
      val: Math.floor(Math.random() * 8)
    }));
    return slots;
  }, [chamados.length]);

  return (
    <div className="app">
      <header><h1>Dashboard de Chamados MANSERV</h1></header>
      <section className="filtros">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar chamados..." />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos</option>
          <option value="aberto">Aberto</option>
          <option value="em_andamento">Em andamento</option>
          <option value="resolvido">Resolvido</option>
          <option value="critico">Crítico</option>
        </select>
        <input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
        <input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
        <button onClick={() => void load()}>Aplicar filtros</button>
      </section>

      {metrics && <DashboardView metrics={metrics} heatMap={heatMap} />}

      <section className="exports">
        <a href={`${API}/export/excel`} target="_blank">Exportar Excel</a>
        <a href={`${API}/export/excel?filtered=true`} target="_blank">Exportar Filtrados</a>
        <a href={`${API}/export/excel?dateStart=${dateStart}&dateEnd=${dateEnd}`} target="_blank">Exportar Resumo</a>
      </section>

      <ChamadoForm onSaved={load} />
      <ChamadosTable chamados={chamados} />
    </div>
  );
}
