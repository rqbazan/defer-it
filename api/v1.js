const { createApiKeyStore } = require("../src/api-key/store");
const { getFastifyApp } = require("../src/server");

const encodedKeys = process.env.API_KEYS ?? "";
const apiKeyStore = createApiKeyStore(encodedKeys);

const app = getFastifyApp({
  apiKeyStore,
});

async function handler(req, reply) {
  await app.ready();
  app.server.emit("request", req, reply);
}

module.exports = handler;
