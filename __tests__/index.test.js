const fs = require('fs');
const sdk = require('hook.io-sdk');

const client = sdk.createClient({});
const script = fs.readFileSync('index.js', 'utf8');
const stub = require('./stub.json');

describe('index.js', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules() // this is important - it clears the cache
    process.env = { ...OLD_ENV };
    delete process.env.NODE_ENV;
  });



  test.skip("Should return params", () => {
    client.hook.exec({
      code: script,
      language: "javascript",
      data: { foo: "bar" },
    }, (err, res) => {
      expect(err).toBeNull();
      expect(res).toEqual({ foo: "bar" });
    });
  });

  // problems with process being undefined
  test.skip('attempt to post a webhook to ' + stub.url, () => {
    client.hook.exec({
      code: script,
      language: "javascript",
      data: stub
    }, (err, res) => {
      expect(err).toBeNull();
      expect(res).toBe({ ok: true });
    });
  });

});
