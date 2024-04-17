const Fastify = require("fastify");
const { FormatRegistry, Type } = require("@sinclair/typebox");
const { TypeBoxValidatorCompiler } = require("@fastify/type-provider-typebox");
const isURL = require("is-url");

// Utils

FormatRegistry.Set("url", isURL);

const QuerySchema = Type.Object({
  url: Type.String({ format: "url" }),
  waitFor: Type.Optional(Type.Integer({ default: 1000 })),
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fastify plugin

function deferItPlugin(app, opts, done) {
  app.get(
    "/",
    {
      schema: {
        querystring: QuerySchema,
      },
    },
    async (request, reply) => {
      const { url, waitFor } = request.query;

      await sleep(waitFor);

      reply.redirect(url);
    }
  );

  done();
}

// Fastify app

const app = Fastify({
  logger: true,
}).setValidatorCompiler(TypeBoxValidatorCompiler);

app.register(deferItPlugin, {
  prefix: "/api/v1",
});

// Serverless handler

async function handler(req, reply) {
  await app.ready();
  app.server.emit("request", req, reply);
}

module.exports = handler;
