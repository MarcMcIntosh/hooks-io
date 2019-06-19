const sdk = require('hook.io-sdk');

const client = sdk.createClient({});


describe('hook.io-sdk', () => {

  test('should return parameters', () => {
    client.hook.exec({
      code: "module.exports = function(service) { return service.res.json(service.params)}",
      language: "javascript",
      data: { foo: "bar" },
    }, (err, res) => {
      expect(err).toBeNull();
      expect(res).toEqual({ foo: "bar" });
    })
  })
})
