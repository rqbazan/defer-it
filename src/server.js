const Fastify = require("fastify");
const { FormatRegistry, Type } = require("@sinclair/typebox");
const { Value } = require("@sinclair/typebox/value");
const { TypeBoxValidatorCompiler } = require("@fastify/type-provider-typebox");
const isURL = require("is-url");

// Utils

FormatRegistry.Set("url", isURL);

const QuerySchema = Type.Object({
  url: Type.String({ format: "url" }),
  waitFor: Type.Optional(Type.Integer({ default: 1000, maximum: 5000 })),
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fastify plugin

function deferItV1Plugin(app, opts, done) {
  app.get(
    "/",
    {
      schema: {
        querystring: QuerySchema,
      },
    },
    async (request, reply) => {
      const { url, waitFor } = Value.Default(QuerySchema, request.query);

      await sleep(waitFor);

      reply.redirect(url);
    }
  );

  done();
}

// Fastify app

function getFastifyApp() {
  const app = Fastify({
    logger: true,
  }).setValidatorCompiler(TypeBoxValidatorCompiler);

  app.addHook("onSend", async (_, reply, payload) => {
    reply.header("x-response-time", reply.elapsedTime);
    return payload;
  });

  app.register(deferItV1Plugin, {
    prefix: "/api/v1",
  });

  return app;
}

module.exports = { getFastifyApp };
