const request = require('request');

module.exports = function hook(service) {
  const { URL, PASS, USER } = service.env;

  const logs = (opts, cb) => request({
    url: URL,
    method: 'POST',
    auth: {
      user: USER,
      password: PASS,
    },
    json: true,
    ...opts,
  }, cb);

  const { payload, url, repository } = service.params;

  return request({
    url,
    method: 'POST',
    body: payload,
    json: true,
  }, (err, res) => {
    if (err) {
      console.log({ error: err, url, repository });
      return logs({ body: { error: err, response: res } }, () => {
        service.res.end(err, 'utf8');
      });
    }

    return logs({ body: { repository, payload, url } }, (erro) => {
      if (erro) {
        console.log(erro);
        return service.res.end(erro, 'utf8');
      }
      return service.res.json({ ok: true });
    });
  });
};
