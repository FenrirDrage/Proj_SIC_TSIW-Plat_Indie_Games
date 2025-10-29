# Indie Games Platform

## Requisitos
- Docker + Docker Compose (recomendado)
- Node 18+ (se correr local sem Docker)
- npm

## Setup local (docker)
1. Copia `.env.example` para `.env` e ajusta valores.
2. `docker-compose up --build`
3. Executa migrações Prisma:
   - Se estiveres dentro do container ou local: `npx prisma migrate dev --name init`
4. Endpoints:
   - REST: http://localhost:4000
   - GraphQL: http://localhost:4001/graphql

## Scripts
- `npm run dev` — arranca em modo desenvolvimento (ts-node-dev)
- `npm run prisma:generate` — gerar cliente Prisma
- `npm run prisma:migrate` — criar migrações

## Notas
- Autenticação via JWT.
- Painel developers expõe GraphQL (criar/editar jogos, listar jogos do dev).
- Para upload de ficheiros (game builds/cover) usa `multer` e um serviço de object storage (S3) em produção.
