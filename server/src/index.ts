import express from "express";
import cors from "cors";
import { initDb } from "./db.js";
import { chamadosRouter } from "./modules/chamados/routes.js";
import { dashboardRouter } from "./modules/dashboard/routes.js";
import { exportRouter } from "./modules/export/routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/chamados", chamadosRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/export", exportRouter);

const port = 3333;
initDb().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
