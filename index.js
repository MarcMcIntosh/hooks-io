const request = require('request');
const convertToUTF8 = require('./src/convertToUTF8');

function getStatus(statusCode) {
  if (statusCode >= 400) { return 'error'; }
  if (statusCode >= 200) { return 'success'; }
  return 'pending';
}

module.exports = function hook(service) {
  const { URL, USER, PASS } = service.env;

  const {
    payload,
    url,
    repoId,
    configId,
    createdAt = Date.now(),
  } = service.params;
  console.log({ payload });

  const bodyOfHook = {
    ...payload,
    name: convertToUTF8(payload.name),
    secret: convertToUTF8(payload.secret),
  };

  console.log({ bodyOfHook });

  return request({
    url,
    method: 'POST',
    json: true,
    body: bodyOfHook,
  }, (error, res, resBody) => {
    if (error) {
      console.log({ error: error.toString(), url, repoId });
    }

    const body = {
      error,
      url,
      repoId,
      configId,
      payload,
      lastAttempt: {
        response: {
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          body: JSON.stringify(resBody),
          date: new Date(res.headers.date).getTime(),
        },
        request: {
          url: res.request.uri.href,
          date: createdAt,
          method: res.request.method,
          headers: res.request.headers,
        },
      },
      tries: 1,
      maxTries: 5,
      createdAt,
      status: getStatus(res.statusCode),
    };

    return request({
      url: URL,
      method: 'POST',
      json: true,
      auth: { user: USER, pass: PASS },
      body,
    }, (erro, resp) => {
      if (erro) {
        console.log('Error saveing logs: ', erro);
        return service.res.end(erro, 'utf8');
      }

      return service.res.json(resp);
    });
  });
};
