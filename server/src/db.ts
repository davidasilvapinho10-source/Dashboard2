import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const dbPromise = open({
  filename: "./server/manserv.db",
  driver: sqlite3.Database
});

export const initDb = async () => {
  const db = await dbPromise;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS chamados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      status TEXT NOT NULL,
      setor TEXT NOT NULL,
      responsavel TEXT NOT NULL,
      prioridade TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);

  const row = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM chamados");
  if ((row?.count ?? 0) === 0) {
    const statuses = ["aberto", "em_andamento", "resolvido", "critico"];
    const setores = ["Operações", "TI", "Logística", "Qualidade", "Financeiro"];
    const prioridades = ["baixa", "media", "alta"];

    for (let i = 1; i <= 80; i++) {
      const d = new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000);
      await db.run(
        `INSERT INTO chamados (titulo, descricao, status, setor, responsavel, prioridade, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          `Chamado #${i}`,
          `Ocorrência registrada para análise ${i}`,
          statuses[Math.floor(Math.random() * statuses.length)],
          setores[Math.floor(Math.random() * setores.length)],
          `Analista ${((i - 1) % 8) + 1}`,
          prioridades[Math.floor(Math.random() * prioridades.length)],
          d.toISOString()
        ]
      );
    }
  }
};
