exports.handler = function (cb) {
  return function (err, response, body) {
    if (err) {
      return cb(err);
    }
    if (response.statusCode !== 200) {
      if (body) {
        return cb(body);
      }
      return cb();
    }
    if (!typeof body === Object) {
      try {
        body = JSON.parse(body);
      } catch (errParse) {
        return cb(new Error('Parsing Error'));
      }
    }
    return cb(null, body);
  };
};
