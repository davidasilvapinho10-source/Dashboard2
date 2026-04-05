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

## Solução de erro: `vite` / `tsx` não reconhecido

Se o ambiente instalar apenas dependências de produção, rode a instalação sem omitir dependências:

```bash
npm install --include=dev
npm run dev
```
