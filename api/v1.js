const { getFastifyApp } = require("../src/server");

const app = getFastifyApp();

async function handler(req, reply) {
  await app.ready();
  app.server.emit("request", req, reply);
}

module.exports = handler;
