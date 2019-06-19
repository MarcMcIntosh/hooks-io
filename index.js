const request = require('request');

module.exports = function hook(service) {
  const { URL, PASS, USER } = service.env;

  const saveToLogs = (opts, cb) => {
    console.log("sending :", opts, 'to: ', URL);

    return request({
      url: URL,
      method: 'POST',
      auth: {
        user: USER,
        pass: PASS,
        sendImmediately: false,
      },
      json: true,
      ...opts,
    }, cb);
  };

  const { payload, url, repository } = service.params;

  console.log('Posting:', payload, 'to: ', url)

  return request({
    url,
    method: 'POST',
    body: payload,
    json: true,
  }, (err, res) => {
    if (err) {
      console.log({ error: err.toString(), url, repository });
      return saveToLogs({ body: { error: err, response: res } }, () => {
        service.res.end(err, 'utf8');
      });
    }
    console.log('successfully sent hook')
    return saveToLogs({ body: { repository, payload, url } }, (erro) => {
      console.log("saved log");
      if (erro) {
        console.log(erro);
        return service.res.end(erro, 'utf8');
      }
      return service.res.json({ ok: true });
    });
  });
};
