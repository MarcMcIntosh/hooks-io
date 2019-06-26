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

  // use time in service
  const createdAt = Date.now();

  return request({
    url,
    method: 'POST',
    json: true,
    body: payload,
  }, (error, res, json) => {
    if (error) { console.log({ error: error.toString(), url, repoId }); }

    const body = {
      error,
      url,
      repoId,
      configId,
      payload,
      lastAttempt: {
        response: {
          statusCode: res.statusCode,
          headers: res.headers,
          body: json,
          date: new Date(res.headers.date),
        },
        request: {
          url: res.request.uri.href,
          date: new Date(createdAt),
          method: res.request.method,
          headers: res.request.headers,
        },
      },
      tries: 1,
      maxTries: 5,
      createdAt,
      status: getStatus(res.statusCode),
    };

    console.log(body);

    return request({
      url: URL,
      method: 'POST',
      json: true,
      auth: { user: USER, pass: PASS },
      body,
    }, (erro, resp, respBody) => {
      if (erro) {
        console.log('Error saveing logs: ', erro);
        return service.res.end(erro, 'utf8');
      }
      console.log({
        resp,
        respBody,
      });
      
      return service.res.json({ ok: true });
    });
  });
};
