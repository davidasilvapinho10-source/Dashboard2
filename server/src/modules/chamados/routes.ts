import { Router } from "express";
import { chamadoSchema } from "@manserv/shared";
import { dbPromise } from "../../db.js";

export const chamadosRouter = Router();

chamadosRouter.get("/", async (req, res) => {
  const { search = "", status, dateStart, dateEnd, page = "1", pageSize = "10" } = req.query;
  const db = await dbPromise;

  const conditions: string[] = ["1=1"];
  const params: any[] = [];

  if (search) {
    conditions.push("(titulo LIKE ? OR descricao LIKE ? OR setor LIKE ?)");
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (status && typeof status === "string") {
    conditions.push("status = ?");
    params.push(status);
  }
  if (dateStart && typeof dateStart === "string") {
    conditions.push("date(createdAt) >= date(?)");
    params.push(dateStart);
  }
  if (dateEnd && typeof dateEnd === "string") {
    conditions.push("date(createdAt) <= date(?)");
    params.push(dateEnd);
  }

  const where = conditions.join(" AND ");
  const p = Number(page);
  const ps = Number(pageSize);
  const offset = (p - 1) * ps;

  const items = await db.all(`SELECT * FROM chamados WHERE ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`, [
    ...params,
    ps,
    offset
  ]);
  const total = await db.get<{ count: number }>(`SELECT COUNT(*) as count FROM chamados WHERE ${where}`, params);

  res.json({ items, total: total?.count ?? 0, page: p, pageSize: ps });
});

chamadosRouter.post("/", async (req, res) => {
  const parsed = chamadoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const db = await dbPromise;
  const now = new Date().toISOString();
  const r = await db.run(
    `INSERT INTO chamados (titulo, descricao, status, setor, responsavel, prioridade, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      parsed.data.titulo,
      parsed.data.descricao,
      parsed.data.status,
      parsed.data.setor,
      parsed.data.responsavel,
      parsed.data.prioridade,
      now
    ]
  );

  const created = await db.get("SELECT * FROM chamados WHERE id = ?", r.lastID);
  return res.status(201).json(created);
});
