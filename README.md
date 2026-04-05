# Dashboard de Chamados MANSERV

Monorepo com `client/`, `server/` e `shared/` usando npm workspaces.

## Requisitos

- Node.js >= 20
- npm >= 10

## Rodar localmente

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3333

## Endpoints principais

- `GET /api/dashboard/metrics`
- `GET /api/chamados`
- `POST /api/chamados`
- `GET /api/export/excel`
- `GET /api/export/excel?filtered=true`
- `GET /api/export/excel?dateStart=YYYY-MM-DD&dateEnd=YYYY-MM-DD`

## Instalação limpa (se necessário)

```bash
rm -rf node_modules package-lock.json
npm install
```
