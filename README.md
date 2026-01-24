# IndieHub - Plataforma de Jogos Indie

**IndieHub** é uma plataforma moderna para **developers publicarem jogos indie** e para **jogadores explorarem, avaliarem e comentarem** os títulos disponíveis.  
O projeto foi desenvolvido com uma **arquitetura de microserviços**, garantindo **escalabilidade**, **modularidade** e **resiliência**.

Projeto desenvolvido em contexto académico (ESMAD – TSIW).

---

## Arquitetura de Microserviços

A aplicação segue o padrão **API Gateway + Microserviços independentes**, com um **single entry point** para toda a aplicação.

### Serviços principais

| Serviço | Tecnologia | Base de Dados | Responsabilidade |
|-------|------------|---------------|------------------|
| 🛡️ API Gateway | Node.js + Express | — | Ponto único de entrada, proxy e autenticação |
| 🔐 Auth Service | Node.js + Express | MongoDB | Registo, login e validação JWT |
| 🎮 Game Service | Node.js + Express | PostgreSQL | CRUD de jogos indie |
| 💬 Review Service | Python + FastAPI | MongoDB | Reviews e classificações |
| 📊 Analytics Service | Node.js + GraphQL | — | Métricas e agregação de dados |
| 🔔 Notification Service | Node.js | RabbitMQ | Processos assíncronos (notificações/eventos) |
| 🐇 RabbitMQ | RabbitMQ | — | Message broker para eventos assíncronos |

---

## Objetivo do Projeto

O objetivo da IndieHub é demonstrar:

- Arquitetura **orientada a microserviços**
- **Autenticação distribuída** com JWT
- Integração de **múltiplas linguagens** (Node.js e Python)
- Uso combinado de **bases de dados SQL e NoSQL**
- Comunicação **síncrona (REST)** e **assíncrona (RabbitMQ)**
- Escalabilidade com **Docker Compose / Swarm**
- Documentação de APIs com **Swagger/OpenAPI**

---

##  Tecnologias Utilizadas

###  ### Backend
- Node.js + Express
- Python + FastAPI
- Apollo GraphQL
- JWT (JSON Web Token)
- RabbitMQ
- Docker & Docker Compose

### Bases de Dados
- MongoDB (Auth, Review)
- PostgreSQL (Games)

### Outras Ferramentas
- Swagger / OpenAPI
- Axios / HTTPX
- bcryptjs
- dotenv
- Postman (testes)

---

##  Estrutura do Projeto

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
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── services/
│ └── middlewares/
│
├── review-service/
│ └── app/
│ ├── main.py
│ ├── routes.py
│ ├── service.py
│ ├── auth.py
│ └── models.py
│
├── analytics-service/
│ └── src/
│ ├── schema.js
│ ├── resolvers.js
│ └── services/
│
├── notification-service/
│ └── src/
│ ├── consumer.js
│ └── rabbitmq.js
│
├── docker-compose.yml
└── README.md
```

---

##  Execução do Projeto

### Via Docker Compose

Pré-requisitos:
- Docker
- Docker Compose

```bash
docker compose up --build
```

Os serviços serão lançados nas seguintes portas:
```
Serviço	            Porta	Endpoint
API Gateway	        8080	http://localhost:8080
Auth Service	    4001	http://localhost:4001
Game Service	    4002	http://localhost:4002
Review Service	    4003	http://localhost:4003
Analytics Service	4004	http://localhost:4004/graphql
RabbitMQ UI         15672   http://localhost:15672
```

Autenticação (JWT)

O sistema utiliza JWT distribuído:

1. O token é gerado no Auth Service

2. O API Gateway valida e reencaminha o token

3. Os restantes serviços confiam no token validado

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
Processos Assíncronos (RabbitMQ)

A plataforma utiliza RabbitMQ para comunicação assíncrona, permitindo:

Processamento de eventos sem bloquear pedidos HTTP

Escalabilidade independente

Maior tolerância a falhas

Exemplo de eventos:

review_created

game_created

user_registered

O Notification Service consome estes eventos e pode:

Enviar notificações

Atualizar métricas

Alimentar o Analytics Service

```
Testes

Os testes foram realizados com Postman, garantindo:

- Envio correto de JSON

- Headers apropriados

- Testes com JWT

Uma coleção Postman acompanha o projeto.
```

Decisões Técnicas

- API Gateway: centraliza autenticação e routing

- Microserviços independentes: escaláveis e isolados

- Node.js + Python: interoperabilidade entre stacks

- SQL + NoSQL: flexibilidade e estrutura

- GraphQL: agregação eficiente de dados

- RabbitMQ: desacoplamento e eventos assíncronos

- Docker: consistência e portabilidade

```

Licença

Este projeto foi desenvolvido para fins académicos.
Podes utilizar o código como base de estudo, desde que mantenhas os devidos créditos.

© 2025 IndieHub Team

👥 Autores

[@Sérgio Alves](https://github.com/FenrirDrage)
[@Beatriz Costa](https://github.com/xbeatriz)
Desenvolvido no âmbito de projeto académico — ESMAD, TSIW 2025

