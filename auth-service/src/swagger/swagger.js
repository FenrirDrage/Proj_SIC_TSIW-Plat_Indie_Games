import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IndieHub - Auth Service API",
      version: "1.0.0",
      description: "Documentação da API de autenticação do projeto IndieHub"
    },
    servers: [{ url: "http://localhost:4001" }]
  },
  apis: ["./src/routes/*.js"]
};

export default swaggerJsdoc(options);
