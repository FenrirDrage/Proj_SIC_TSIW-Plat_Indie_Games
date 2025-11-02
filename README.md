# 🎮 IndieHub - Plataforma de Jogos Indie

**IndieHub** é uma plataforma moderna para **developers publicarem jogos indie** e para **jogadores explorarem, avaliarem e comentarem** os títulos disponíveis.  
O projeto foi desenvolvido com uma **arquitetura de microserviços**, garantindo **escalabilidade**, **modularidade** e **resiliência**.

---

## 🧩 Arquitetura de Microserviços

A plataforma é composta por cinco serviços principais:

| Serviço | Tecnologia | Base de Dados | Função |
|----------|-------------|----------------|---------|
| 🛡️ API Gateway | Node.js + Express | — | Roteia todas as requisições entre cliente e serviços |
| 🔐 Auth Service | Node.js + Express | MongoDB | Registo, login, autenticação JWT |
| 🎮 Game Service | Node.js + Express | PostgreSQL | CRUD de jogos indie |
| 💬 Review Service | Python + FastAPI | MongoDB | Sistema de reviews e classificações |
| 📊 Analytics Service | Node.js + Apollo GraphQL | — | Agregação e estatísticas de jogos e utilizadores |

<p align="center">
  <img src="https://raw.githubusercontent.com/user/repo/main/docs/architecture-diagram.png" alt="Diagrama de Arquitetura" width="600">
</p>

---

## 🧠 Objetivo do Projeto

A IndieHub foi desenvolvida como parte de um projeto académico com foco em:
- Aplicar **conceitos de microserviços** e **integração entre múltiplas linguagens**;
- Demonstrar o uso de **autenticação distribuída com JWT**;
- Criar um sistema **escalável e modular**, com diferentes tipos de base de dados;
- Explorar **GraphQL** para agregação de dados e análise de métricas.

---

## ⚙️ Tecnologias Utilizadas

### 🟢 Backend
- Node.js + Express
- Python + FastAPI
- Apollo GraphQL (Analytics)
- JWT (JSON Web Token)
- Docker & Docker Compose

### 🗄️ Bases de Dados
- MongoDB (Auth, Review)
- PostgreSQL (Games)

### 🧰 Outras Ferramentas
- Swagger / OpenAPI (documentação)
- Axios / HTTPX (comunicação entre serviços)
- bcryptjs (hashing de passwords)
- dotenv (variáveis de ambiente)

---

## 📂 Estrutura do Projeto

```
indiehub/
│
├── api-gateway/
│ └── src/
│ ├── routes/
│ ├── middlewares/
│ └── server.js
│
├── auth-service/
│ └── src/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── services/
│ └── swagger/
│
├── game-service/
│ └── src/
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ └── services/
│
├── review-service/
│ └── app/
│ ├── main.py
│ ├── routes.py
│ ├── services.py
│ ├── auth.py
│ └── models.py
│
├── analytics-service/
│ └── src/
│ ├── schema.js
│ ├── resolvers.js
│ └── services/
│
└── docker-compose.yml
```

---

## 🚀 Execução do Projeto

### 🐳 1. Via Docker Compose

Certifica-te que tens **Docker** e **Docker Compose** instalados, e depois:

```bash
docker-compose up --build


Os serviços serão lançados nas seguintes portas:

Serviço	            Porta	Endpoint
API Gateway	        8080	http://localhost:8080
Auth Service	    4001	http://localhost:4001
Game Service	    4002	http://localhost:4002
Review Service	    4003	http://localhost:4003
Analytics Service	4004	http://localhost:4004/graphql

2. Execução Manual (sem Docker)

Cada microserviço pode ser executado individualmente:

cd auth-service
npm install
npm run dev

Para o Review Service (Python):

cd review-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 4003

---

Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação distribuída.
O token é gerado no Auth Service e verificado nos outros microserviços via endpoint /auth/verify.

Exemplo de cabeçalho HTTP:

Authorization: Bearer <token_jwt>

---

Endpoints Principais
```
Auth Service
    Método	    Rota	            Descrição
    POST	    /auth/register	    Registar novo utilizador
    POST	    /auth/login	        Efetuar login e obter token
    POST	    /auth/verify	    Validar token JWT
    GET	        /auth/profile	    Consultar perfil
    PUT	        /auth/profile	    Atualizar dados
    DELETE	    /auth/profile	    Eliminar conta

Game Service
    Método	    Rota	            Descrição
    GET	        /games	            Listar jogos
    GET	        /games/:id	        Obter jogo específico
    POST	    /games	            Criar novo jogo
    PUT	        /games/:id	        Atualizar jogo
    DELETE	    /games/:id	        Remover jogo

Review Service
    Método	    Rota	            Descrição
    POST	    /reviews	        Criar nova review
    GET	        /reviews/game/{id}	Listar reviews de um jogo
    GET	        /reviews/user/{id}	Listar reviews de um utilizador
    PUT	        /reviews/{id}	    Atualizar review
    DELETE	    /reviews/{id}	    Eliminar review

Analytics Service (GraphQL)
    Query	                        Descrição
    topGames(limit)	                Retorna os jogos mais bem avaliados
    gameStats(gameId)	            Estatísticas detalhadas de um jogo
    userActivity(userId)	        Atividade de um utilizador

```   

Decisões Técnicas

Arquitetura de Microserviços: permite escalar e manter cada módulo de forma independente.

Linguagens diferentes (Node.js e Python): demonstra interoperabilidade e integração heterogénea.

Bases de dados híbridas (SQL + NoSQL): combina estrutura relacional e flexibilidade de documentos.

GraphQL: simplifica a agregação de dados complexos, ideal para dashboards e análises.

Docker: facilita a orquestração e isolamento de cada componente.

Licença

Este projeto foi desenvolvido para fins académicos.
Podes utilizar o código como base de estudo, desde que mantenhas os devidos créditos.

© 2025 IndieHub Team

👥 Autores

Sérgio Alves
[@Beatriz Costa](https://github.com/xbeatriz)
Desenvolvido no âmbito de projeto académico — ESMAD, TSIW 2025