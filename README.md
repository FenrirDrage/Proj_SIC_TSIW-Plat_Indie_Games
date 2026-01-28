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

Endpoints Principais - acedido atraves de browser se: URL ou postman se: endpoint 
# IndieHub – Microservices Platform

Este README descreve **todas as chamadas atualizadas** da plataforma IndieHub, considerando o **API Gateway**, os **microserviços**, **GraphQL Analytics** e **eventos RabbitMQ**.

---

## 🌐 API Gateway

Base URL:

```
http://localhost:8080
```

O Gateway é o **single entry point**. Os prefixos são tratados conforme cada serviço.

---

## 🔐 Auth Service

<<<<<<< HEAD
### Registar utilizador

```
POST /auth/register
```

Body:

```json
{
  "username": "dev1",
  "email": "dev1@email.com",
  "password": "123456"
}
```

---

### Login

```
POST /auth/login
```

Body:

```json
{
  "email": "dev1@email.com",
  "password": "123456"
}
```

Resposta:

```json
{
  "token": "JWT_TOKEN"
}
```

---

## 🎮 Game Service (via Gateway)

> O Gateway remove o prefixo `/games` antes de encaminhar para o serviço.

### Listar jogos

```
GET /games
```

---

### Obter jogo por ID

```
GET /games/:id
```

---

### Criar jogo (🔒 developer)

```
POST /games
```

Headers:

```
Authorization: Bearer <TOKEN>
```

Body:

```json
{
  "title": "Indie Quest",
  "description": "RPG indie",
  "genre": "RPG",
  "price": 9.99
}
```

---

### Atualizar jogo (🔒 developer)

```
PUT /games/:id
```

---

### Apagar jogo (🔒 developer)

```
DELETE /games/:id
```

---

## ⭐ Review Service (via Gateway)

> O Gateway **mantém o prefixo `/reviews`** para FastAPI.

### Criar review (🔒 login obrigatório)

```
POST /reviews
```

Headers:

```
Authorization: Bearer <TOKEN>
```

Body:

```json
{
  "game_id": "UUID_DO_JOGO",
  "rating": 5,
  "comment": "Jogo incrível, muito bem feito!"
}
```

---

### Listar reviews por jogo

```
GET /reviews/game/:gameId
```

---

### Listar reviews por utilizador

```
GET /reviews/user/:userId
```

---

## 📊 Analytics Service (GraphQL)

Endpoint:

```
POST /analytics
```

Headers:

```
Content-Type: application/json
```

---

### Query: Top Games

```json
{
  "query": "query { topGames(limit: 5) { game { id title genre price downloads } averageRating reviewsCount downloads } }"
}
```

---

### Query: Estatísticas de um jogo

```json
{
  "query": "query ($id: ID!) { gameStats(gameId: $id) { game { title } averageRating reviewsCount downloads } }",
  "variables": {
    "id": "UUID_DO_JOGO"
  }
}
```

---

### Query: Atividade de utilizador

```json
{
  "query": "query ($uid: ID!) { userActivity(userId: $uid) { userId reviewsCount publishedGamesCount reviewedGames { id title } } }",
  "variables": {
    "uid": "USER_ID"
  }
}
```

---

## 🔔 Notification Service (RabbitMQ)

O Notification Service **não expõe endpoints HTTP**.

### Queue utilizada

```
review_events
```

### Evento publicado (exemplo)

```json
{
  "type": "review_created",
  "gameId": "UUID_DO_JOGO",
  "rating": 5,
  "comment": "Excelente jogo!"
}
```

Quando uma review é criada, este evento é publicado pelo Review Service e consumido pelo Notification Service.

---

=======
```   
>>>>>>> 545f8a10f53687c6fad41e8cd4a05e6b52f03789
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
