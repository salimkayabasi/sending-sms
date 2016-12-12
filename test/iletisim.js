var chai = require('chai');
var dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
var expect = chai.expect;
var SMS = require('../');
var text = process.env.TEXT;
var phone = process.env.PHONE;
var provider = 'iletisimmakinesi';

// test text with 200 chars
var longText = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ' +
  'Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque ' +
  'penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu';

describe('Send sms w/ auth', function () {
  before(function () {
    SMS.setAuth(provider,
      process.env.ILETISIM_USERNAME,
      process.env.ILETISIM_PASSWORD,
      process.env.ILETISIM_CUSTOMER_CODE,
      process.env.ILETISIM_API_KEY,
      process.env.ILETISIM_VENDOR_CODE,
      process.env.ILETISIM_ORIGINATOR);
  });

  it('should send sms', function (done) {
    this.timeout(5000);
    SMS.send(provider, phone, text, function (err, sms) {
      expect(err).not.to.exist();
      expect(sms).to.exist();
      done();
    });
  });
  it('should send sms', function (done) {
    this.timeout(5000);
    SMS.send(provider, phone, longText, function (err, results) {
      expect(err).not.to.exist();
      expect(results).to.exist();
      expect(results).have.length(2);
      done();
    });
  });
});
