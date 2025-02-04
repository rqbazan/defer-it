const tap = require("tap");
const { getFastifyApp } = require("../src/server");

function createApp() {
  const apiKey = "fake-api-key";

  const app = getFastifyApp({
    apiKeyStore: new Set([apiKey]),
  });

  return { app, apiKey };
}

function buildUrl(queryObject) {
  const url = new URL("/api/v1", "http://localhost");

  for (const key in queryObject) {
    url.searchParams.append(key, queryObject[key]);
  }

  return `${url.pathname}${url.search}`;
}

tap.test("should redirect after 1000ms when url param is valid", async (t) => {
  const { app, apiKey } = createApp();

  t.teardown(() => app.close());

  try {
    const res = await app.inject({
      method: "GET",
      url: buildUrl({ url: "https://example.com", apiKey }),
    });

    const responseTime = Number(res.headers["x-response-time"]);

    t.equal(res.statusCode, 302);
    t.equal(res.headers.location, "https://example.com");
    t.ok(responseTime > 1000, "response time should be more than 1000ms");
  } catch (err) {
    t.error(err);
  }
});

tap.test(
  "should redirect after custom time when url param is valid",
  async (t) => {
    const { app, apiKey } = createApp();

    t.teardown(() => app.close());

    const waitFor = 1500;

    try {
      const res = await app.inject({
        method: "GET",
        url: buildUrl({ url: "https://example.com", waitFor, apiKey }),
      });

      const responseTime = Number(res.headers["x-response-time"]);

      t.equal(res.statusCode, 302);
      t.equal(res.headers.location, "https://example.com");
      t.ok(
        responseTime > waitFor,
        `response time should be more than ${waitFor}ms`
      );
    } catch (err) {
      t.error(err);
    }
  }
);

tap.test("should return 400 when url param is not present", async (t) => {
  const { app, apiKey } = createApp();

  t.teardown(() => app.close());

  try {
    const res = await app.inject({
      method: "GET",
      url: buildUrl({ apiKey }),
    });

    t.equal(res.statusCode, 400);
    t.match(res.json(), {
      error: "Bad Request",
      message: "querystring/url Required property",
    });
  } catch (err) {
    t.error(err);
  }
});

tap.test("should return 400 when url param is not valid", async (t) => {
  const { app, apiKey } = createApp();

  t.teardown(() => app.close());

  try {
    const res = await app.inject({
      method: "GET",
      url: buildUrl({ url: "hi", apiKey }),
    });

    t.equal(res.statusCode, 400);
    t.match(res.json(), {
      error: "Bad Request",
      message: "querystring/url Expected string to match 'url' format",
    });
  } catch (err) {
    t.error(err);
  }
});

tap.test("should return 400 when waitFor param more than 5000", async (t) => {
  const { app, apiKey } = createApp();

  t.teardown(() => app.close());

  try {
    const res = await app.inject({
      method: "GET",
      url: buildUrl({ url: "https://example.com", waitFor: 5001, apiKey }),
    });

    t.equal(res.statusCode, 400);
    t.match(res.json(), {
      error: "Bad Request",
      message:
        "querystring/waitFor Expected integer to be less or equal to 5000",
    });
  } catch (err) {
    t.error(err);
  }
});

tap.test('should return 401 when "apiKey" is invalid', async (t) => {
  const { app } = createApp();

  t.teardown(() => app.close());

  try {
    const res = await app.inject({
      method: "GET",
      url: buildUrl({ url: "https://example.com", apiKey: "invalid" }),
    });

    t.equal(res.statusCode, 401);
    t.match(res.json(), {
      message: "Unauthorized API Key",
    });
  } catch (err) {
    t.error(err);
  }
});
