const request = require('request');


function getStatus(statusCode) {
  if (statusCode >= 400) { return 'error'; }
  if (statusCode >= 200) { return 'success'; }
  return 'pending';
}

// cuases TypeError: Converting circular structure to JSON

function getLastAttempt(res) {
  const req = { ...res.request };
  const response = { ...res };
  delete response.request;

  const ret = { request: req, response };
  return ret;
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
  }, (error, res) => {
    // console.log('Sent');

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
        request: Object.assign({}, res.request),
        response: Object.assign({}, res.request.response),
      },
      tries: 1,
      maxTries: 5,
      createdAt,
      status: getStatus(res.statusCode),
    };

    delete body.lastAttempt.request.response;
    delete body.lastAttempt.response.request;

    return request({
      url: URL,
      method: 'POST',
      json: true,
      auth: { user: USER, pass: PASS },
      body,
    }, (erro) => {
      if (erro) {
        console.log('Error saveing logs: ', erro);
        return service.res.end(erro, 'utf8');
      }
      return service.res.json({ ok: true });
    });
  });
};
