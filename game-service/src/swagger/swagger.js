import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IndieHub - Game Service API",
      version: "1.0.0",
      description: "API para gerir jogos (CRUD) do projeto IndieHub"
    },
    servers: [{ url: "http://localhost:4002" }]
  },
  apis: ["./src/routes/*.js"]
};

export default swaggerJsdoc(options);
