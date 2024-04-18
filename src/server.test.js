const tap = require("tap");
const { getFastifyApp } = require("../src/server");

tap.test("should redirect when url param is valid", async (t) => {
  const app = getFastifyApp();

  t.teardown(() => app.close());

  try {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1?url=https://example.com",
    });

    t.equal(res.statusCode, 302);
  } catch (err) {
    t.error(err);
  }
});

tap.test("should return 400 when url param is not present", async (t) => {
  const app = getFastifyApp();

  t.teardown(() => app.close());

  try {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1",
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
  const app = getFastifyApp();

  t.teardown(() => app.close());

  try {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1?url=hi",
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
  const app = getFastifyApp();

  t.teardown(() => app.close());

  try {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1?url=https://example.com&waitFor=5001",
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
