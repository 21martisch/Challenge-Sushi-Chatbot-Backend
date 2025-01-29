import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const swaggerDocument = YAML.load(path.resolve("swagger.yaml"));

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("📜 Swagger Docs disponible en: http://localhost:5000/api-docs");
};

export default setupSwagger;