const send = require('request');

module.exports = function hook(service) {

  function getStatus(statusCode) {
    if (statusCode >= 400) { return 'error'; }
    if (statusCode >= 200) { return 'success'; }
    return 'pending';
  }

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


  return send({
    url,
    method: 'POST',
    json: true,
    body: payload,
  }, (error, res) => {
    console.log('Sent');

    if (error) {
      return console.log({ error: error.toString(), url, repoId });
    }

    const { request, ...response } = res;

    const body = {
      error,
      url,
      repoId,
      configId,
      payload,
      lastAttempt: { request, response },
      tries: 1,
      maxTries: 5,
      createdAt,
      status: getStatus(response.statusCode),
    };

    console.log("Loggin: ",  body);
    console.log(service.env)

    return send({
      url: service.env.URL,
      method: 'POST',
      json: true,
      auth: {
        user: service.env.USER,
        pass: service.env.PASS,
      },
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
