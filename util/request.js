exports.handler = cb => (err, response, body) => {
  if (err) {
    return cb(err);
  }
  if (response.statusCode !== 200) {
    if (body) {
      return cb(body);
    }
    return cb();
  }
  let parsedBody;
  if (!typeof body === Object) {
    try {
      parsedBody = JSON.parse(body);
    } catch (errParse) {
      return cb(new Error('Parsing Error'));
    }
  }
  return cb(null, parsedBody || body);
};
