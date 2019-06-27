const request = require('request');

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
  } = service.params;

  const createdAt = Date.now();

  return request({
    url,
    method: 'POST',
    json: true,
    body: payload,
  }, (error, res, resBody) => {
    if (error) { console.log({ error: error.toString(), url, repoId }); }

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
          // body: Object.entries(resBody).reduce((acc, [key, val]) => acc.concat(`${key} -> ${val}`), []).join('\n'),
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
      console.log(resp);
      return service.res.json({ ok: true });
    });
  });
};
