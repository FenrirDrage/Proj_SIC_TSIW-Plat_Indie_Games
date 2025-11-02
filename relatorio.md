Relatório Técnico - Plataforma IndieHub (Arquitetura de Microserviços)
1. Introdução

O projeto IndieHub foi desenvolvido como uma plataforma de jogos indie, onde developers podem publicar os seus jogos e jogadores podem avaliar, comentar e obter estatísticas sobre o desempenho dos títulos.
O sistema foi construído com base numa arquitetura de microserviços, promovendo modularidade, escalabilidade e facilidade de manutenção.

2. API Gateway

O API Gateway funciona como ponto central de entrada para todas as requisições do sistema.
Desenvolvido em Node.js com Express, é responsável por encaminhar pedidos aos microserviços corretos (Auth, Game, Review, Analytics) e agregar respostas quando necessário.

Este design facilita o controlo de acesso, logging, e políticas de segurança, além de simplificar a comunicação entre cliente e backend.
Também permite a implementação futura de rate limiting, monitorização e balanceamento de carga.

3. Auth Service

O Auth Service foi implementado em Node.js + Express + MongoDB, garantindo uma gestão segura de utilizadores.
Implementa funcionalidades de registo, login, verificação de tokens JWT e gestão de perfis.

Foi utilizada a biblioteca jsonwebtoken para autenticação e bcryptjs para hashing de passwords.
O serviço possui documentação via Swagger (OpenAPI) e comunicação RESTful, podendo ser escalado independentemente.

Este microserviço é crítico para o sistema, pois todos os outros dependem dele para validação de permissões e identificação de utilizadores.

4. Game Service

O Game Service é responsável pela gestão do catálogo de jogos, incluindo operações CRUD (criar, listar, atualizar, eliminar).
Foi desenvolvido em Node.js + Express com base de dados PostgreSQL, refletindo boas práticas de modelação relacional.

A integração com um ORM (como Sequelize ou Knex) permite abstrair queries SQL, mantendo a lógica de negócio organizada.
As rotas incluem endpoints RESTful como /games e /games/:id e suportam autenticação via JWT.

Este serviço comunica com o Auth Service para validar permissões de developers e garantir que apenas os criadores dos jogos podem modificá-los.

5. Review Service

O Review Service foi desenvolvido em Python com FastAPI, utilizando MongoDB como base de dados não relacional.
Este microserviço gere as avaliações (reviews) e classificações dos jogos.

Implementa rotas RESTful para criação, listagem, atualização e eliminação de reviews, garantindo segurança via validação JWT contra o Auth Service.

A escolha de FastAPI justifica-se pela sua performance e pela documentação automática Swagger nativa, enquanto o uso de MongoDB oferece flexibilidade no armazenamento de dados não estruturados.
Além disso, representa uma escolha tecnológica distinta, demonstrando a interoperabilidade da arquitetura.

6. Analytics Service

O Analytics Service foi desenvolvido em Node.js com Apollo Server (GraphQL).
Este serviço não possui base de dados própria — agrega e analisa dados obtidos dos outros microserviços, nomeadamente Game e Review.

Oferece queries GraphQL como:

topGames(limit) — jogos mais populares baseados em média de rating e número de downloads;

gameStats(gameId) — métricas detalhadas de um jogo específico;

userActivity(userId) — estatísticas de atividade de um utilizador.

O GraphQL foi escolhido para permitir consultas flexíveis e centralizadas, otimizando a comunicação entre cliente e múltiplas fontes de dados.
Assim, o cliente pode solicitar apenas os campos que necessita, reduzindo o tráfego e melhorando a eficiência das comunicações.

7. Conclusão

A arquitetura de microserviços do IndieHub demonstra uma aplicação prática de padrões modernos de desenvolvimento distribuído.
Cada componente foi isolado para cumprir uma função específica, promovendo reutilização, escalabilidade e facilidade de manutenção.

A diversidade tecnológica entre serviços (Node.js, Python, GraphQL, MongoDB, PostgreSQL) mostra o potencial de integração em ambientes heterogéneos, refletindo as boas práticas recomendadas em sistemas empresariais contemporâneos.

Este projeto serve como um exemplo claro de como dividir responsabilidades em serviços independentes pode melhorar a qualidade, segurança e robustez de uma plataforma digital moderna.