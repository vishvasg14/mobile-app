const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const { swaggerShowAdmin } = require("./env");

const isAdminOperation = (op) => {
  if (!op) return false;
  if (op["x-admin"] === true) return true;
  return Array.isArray(op.tags) && op.tags.includes("Admin");
};

const filterAdminPaths = (doc) => {
  if (swaggerShowAdmin) return doc;

  const filtered = JSON.parse(JSON.stringify(doc));
  const paths = filtered.paths || {};

  const httpMethods = new Set([
    "get",
    "post",
    "put",
    "patch",
    "delete",
    "options",
    "head",
    "trace"
  ]);

  Object.keys(paths).forEach((p) => {
    const pathItem = paths[p];
    if (!pathItem || typeof pathItem !== "object") return;

    Object.keys(pathItem).forEach((method) => {
      const op = pathItem[method];
      if (httpMethods.has(method.toLowerCase()) && isAdminOperation(op)) {
        delete pathItem[method];
      }
    });

    const hasMethod = Object.keys(pathItem).some((k) =>
      httpMethods.has(k.toLowerCase())
    );
    if (!hasMethod) {
      delete paths[p];
    }
  });

  return filtered;
};

const swaggerDocument = filterAdminPaths(
  YAML.load(path.join(__dirname, "../docs/swagger.yaml"))
);

module.exports = {
  swaggerUi,
  swaggerDocument
};
