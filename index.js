const request = require('request');


function getStatus(statusCode) {
  if (statusCode >= 400) { return 'error'; }
  if (statusCode >= 200) { return 'success'; }
  return 'pending';
}

function getLastAttempt(res) {
  console.log(res);
  const req = res.request;
  const response = { ...res };
  delete response.request;
  return {
    request: req,
    response,
  };
}

module.exports = function hook(service) {

  const { URL, USER, PASS } = service.env;

  const {
    payload,
    url,
    repoId,
    configId,
  } = service.params;

  // const timestamp = Date.now();
  const createdAt = Date.now();

  // shpould createdAt be decided here or on before posting data to hook.io?
  console.log("Sending: ", payload, "\nTo: ", url);

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

    console.log({ res });

    const body = {
      error,
      url,
      repoId,
      configId,
      payload,
      lastAttempt: getLastAttempt(res),
      tries: 1,
      maxTries: 5,
      createdAt,
      status: getStatus(res.statusCode),
    };

    console.log("Loggin: ",  body);

    return request({
      url: URL,
      method: 'POST',
      json: true,
      auth: { user: USER, pass: PASS },
      body,
    }, (erro, resp) => {
      console.log("Saved to logs: ", { resp, erro });

      if (erro) {
        console.log('Error saveing logs: ', erro);
        return service.res.end(erro, 'utf8');
      }
      return service.res.json({ ok: true });
    });
  });
};
