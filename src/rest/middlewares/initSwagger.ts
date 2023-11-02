import { Express } from "express";
import swaggerSpec from "./swagger.json";
import swaggerUi, { SwaggerUiOptions } from "swagger-ui-express";

const SwaggerUIOptions: SwaggerUiOptions = {};

export function initSwagger(app: Express) {
  app.use(
    "/swagger",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, SwaggerUIOptions),
  );
}
