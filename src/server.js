const Fastify = require("fastify");
const { FormatRegistry, Type } = require("@sinclair/typebox");
const { Value } = require("@sinclair/typebox/value");
const { TypeBoxValidatorCompiler } = require("@fastify/type-provider-typebox");
const fp = require("fastify-plugin");
const isURL = require("is-url");
const { ApiKeyService } = require("./api-key/service");

// Utils

FormatRegistry.Set("url", isURL);

const QuerySchema = Type.Object({
  url: Type.String({ format: "url" }),
  waitFor: Type.Optional(Type.Integer({ default: 1000, maximum: 5000 })),
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fastify plugins

function deferItV1Plugin(app, opts, done) {
  app.route({
    method: "GET",
    url: "/",
    schema: {
      querystring: QuerySchema,
    },
    preHandler: async (request, reply) => {
      const apiKey = request.query.apiKey;
      const isValid = await app.apiKeyService.verifyApiKey(apiKey);

      if (!isValid) {
        reply.code(401).send({ message: "Unauthorized API Key" });
      }
    },
    handler: async (request, reply) => {
      const { url, waitFor } = Value.Default(QuerySchema, request.query);

      await sleep(waitFor);

      reply.redirect(url);
    },
  });

  done();
}

const apiKeysPlugin = fp(function apiKeysPlugin(app, opts, done) {
  if (!app.apiKeyService) {
    const apiKeyService = new ApiKeyService(opts.apiKeyStore);
    app.decorate("apiKeyService", apiKeyService);
  }

  done();
});

// Fastify app

function getFastifyApp(options) {
  const { apiKeyStore } = options;

  const app = Fastify({
    logger: {
      serializers: {
        req: (request) => {
          const url = new URL(request.url, `http://localhost`);

          const sensitiveParams = ["apiKey"];

          sensitiveParams.forEach((param) => {
            if (url.searchParams.has(param)) {
              url.searchParams.set(param, "[REDACTED]");
            }
          });

          return {
            method: request.method,
            url: `${url.pathname}${url.search}`,
            hostname: request.hostname,
            remoteAddress: request.ip,
            remotePort: request.socket.remotePort,
          };
        },
      },
    },
  }).setValidatorCompiler(TypeBoxValidatorCompiler);

  // useful for test cases, to check response time
  app.addHook("onSend", async (_, reply, payload) => {
    reply.header("x-response-time", reply.elapsedTime);
    return payload;
  });

  app.register(apiKeysPlugin, {
    apiKeyStore,
  });

  app.register(deferItV1Plugin, {
    prefix: "/api/v1",
  });

  return app;
}

module.exports = { getFastifyApp };
