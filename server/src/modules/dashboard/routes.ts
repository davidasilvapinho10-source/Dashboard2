import { Router } from "express";
import { dbPromise } from "../../db.js";

export const dashboardRouter = Router();

dashboardRouter.get("/metrics", async (_req, res) => {
  const db = await dbPromise;
  const [total, abertos, emAndamento, resolvidos, criticos] = await Promise.all([
    db.get<{ count: number }>("SELECT COUNT(*) as count FROM chamados"),
    db.get<{ count: number }>("SELECT COUNT(*) as count FROM chamados WHERE status='aberto'"),
    db.get<{ count: number }>("SELECT COUNT(*) as count FROM chamados WHERE status='em_andamento'"),
    db.get<{ count: number }>("SELECT COUNT(*) as count FROM chamados WHERE status='resolvido'"),
    db.get<{ count: number }>("SELECT COUNT(*) as count FROM chamados WHERE status='critico'")
  ]);

  const weekNow = await db.get<{ count: number }>(
    "SELECT COUNT(*) as count FROM chamados WHERE date(createdAt) >= date('now','-7 day')"
  );
  const weekPrev = await db.get<{ count: number }>(
    "SELECT COUNT(*) as count FROM chamados WHERE date(createdAt) BETWEEN date('now','-14 day') AND date('now','-8 day')"
  );

  const trend = ((weekNow?.count ?? 0) - (weekPrev?.count ?? 0)) / Math.max(weekPrev?.count ?? 1, 1);

  res.json({
    total: total?.count ?? 0,
    abertos: abertos?.count ?? 0,
    emAndamento: emAndamento?.count ?? 0,
    resolvidos: resolvidos?.count ?? 0,
    criticos: criticos?.count ?? 0,
    tendencia7dias: Number((trend * 100).toFixed(2))
  });
});

dashboardRouter.get("/heatmap", async (_req, res) => {
  const db = await dbPromise;
  const rows = await db.all(
    `SELECT strftime('%w', createdAt) as weekDay, strftime('%H', createdAt) as hour, COUNT(*) as total
     FROM chamados
     GROUP BY weekDay, hour`
  );
  res.json(rows);
});
