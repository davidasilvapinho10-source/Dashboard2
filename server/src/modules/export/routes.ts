import { Router } from "express";
import ExcelJS from "exceljs";
import { dbPromise } from "../../db.js";

export const exportRouter = Router();

const getRows = async (query: any) => {
  const db = await dbPromise;
  const { filtered, dateStart, dateEnd } = query;
  const conditions: string[] = ["1=1"];
  const params: any[] = [];

  if (filtered === "true") {
    conditions.push("status != 'resolvido'");
  }
  if (dateStart) {
    conditions.push("date(createdAt) >= date(?)");
    params.push(dateStart);
  }
  if (dateEnd) {
    conditions.push("date(createdAt) <= date(?)");
    params.push(dateEnd);
  }

  return db.all(`SELECT * FROM chamados WHERE ${conditions.join(" AND ")} ORDER BY createdAt DESC`, params);
};

exportRouter.get("/excel", async (req, res) => {
  const rows = await getRows(req.query);

  const wb = new ExcelJS.Workbook();
  wb.creator = "MANSERV Dashboard";

  const resumo = wb.addWorksheet("Resumo Executivo");
  resumo.mergeCells("A1:E1");
  resumo.getCell("A1").value = "Dashboard Executivo de Chamados MANSERV";
  resumo.getCell("A1").font = { size: 18, bold: true, color: { argb: "FFFFFFFF" } };
  resumo.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F2937" } };

  const total = rows.length;
  const criticos = rows.filter((r: any) => r.status === "critico").length;
  const abertos = rows.filter((r: any) => r.status === "aberto").length;
  const resolvidos = rows.filter((r: any) => r.status === "resolvido").length;

  resumo.addRows([
    ["Métrica", "Valor"],
    ["Total de chamados", total],
    ["Abertos", abertos],
    ["Críticos", criticos],
    ["Resolvidos", resolvidos]
  ]);

  const chamados = wb.addWorksheet("Chamados");
  chamados.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Título", key: "titulo", width: 28 },
    { header: "Status", key: "status", width: 20 },
    { header: "Setor", key: "setor", width: 20 },
    { header: "Responsável", key: "responsavel", width: 20 },
    { header: "Prioridade", key: "prioridade", width: 14 },
    { header: "Data", key: "createdAt", width: 24 }
  ];
  chamados.addRows(rows);
  chamados.autoFilter = "A1:G1";
  chamados.views = [{ state: "frozen", ySplit: 1 }];
  chamados.getRow(1).font = { bold: true };

  chamados.eachRow((row, idx) => {
    if (idx === 1) return;
    const status = row.getCell(3).value;
    if (status === "critico") row.getCell(3).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFCA5A5" } };
    if (status === "aberto") row.getCell(3).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFDE68A" } };
    if (status === "resolvido") row.getCell(3).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF86EFAC" } };
  });

  const indicadores = wb.addWorksheet("Indicadores");
  indicadores.addRows([
    ["Indicador", "Valor"],
    ["% críticos", total ? ((criticos / total) * 100).toFixed(2) : 0],
    ["% resolvidos", total ? ((resolvidos / total) * 100).toFixed(2) : 0],
    ["% abertos", total ? ((abertos / total) * 100).toFixed(2) : 0]
  ]);

  const dados = wb.addWorksheet("Dados");
  dados.columns = [
    { header: "Data", key: "date", width: 20 },
    { header: "Quantidade", key: "count", width: 14 }
  ];
  const byDate = rows.reduce((acc: Record<string, number>, r: any) => {
    const date = r.createdAt.slice(0, 10);
    acc[date] = (acc[date] ?? 0) + 1;
    return acc;
  }, {});
  dados.addRows(Object.entries(byDate).map(([date, count]) => ({ date, count })));

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=dashboard-manserv.xlsx");
  await wb.xlsx.write(res);
  res.end();
});
