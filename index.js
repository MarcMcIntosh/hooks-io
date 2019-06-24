const request = require('request');

module.exports = function hook(service) {
  const { URL, PASS, USER } = service.env;

  const saveToLogs = (opts, cb) => request({
    url: URL,
    method: 'POST',
    auth: {
      user: USER,
      pass: PASS,
      // sendImmediately: true,
    },
    json: true,
    ...opts,
  }, cb);

  const {
    payload,
    url,
    repoId,
    configId,
    // createdAt
  } = service.params;

  // const timestamp = Date.now();

  // shpould createdAt be decided here or on before posting data to hook.io?

  return request({
    url,
    method: 'POST',
    body: payload,
    json: true,
  }, (error, response) => {
    if (error) { console.log({ error: error.toString(), url, repoId }); }

    const body = {
      error,
      url,
      repoId,
      configId,
      payload,
      response,
      createdAt: Date.now()
    };

    // console.log({ body });

    return saveToLogs({ body }, (erro) => {
      if (erro) {
        console.log('Error saveing logs: ', erro);
        return service.res.end(erro, 'utf8');
      }
      return service.res.json({ ok: true });
    });
  });
};
