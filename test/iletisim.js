const chai = require('chai');
const dirtyChai = require('dirty-chai');
const SMS = require('../');

chai.use(dirtyChai);
const expect = chai.expect;

const text = process.env.TEXT;
const phone = process.env.PHONE;
const provider = 'iletisimmakinesi';

// test text with 200 chars
const longText = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ' +
  'Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque ' +
  'penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu';

describe('Send sms w/ auth', () => {
  before(() => {
    SMS.setAuth(provider,
      process.env.ILETISIM_USERNAME,
      process.env.ILETISIM_PASSWORD,
      process.env.ILETISIM_CUSTOMER_CODE,
      process.env.ILETISIM_API_KEY,
      process.env.ILETISIM_VENDOR_CODE,
      process.env.ILETISIM_ORIGINATOR);
  });

  it('should send sms', (done) => {
    SMS.send(provider, phone, text, (err, sms) => {
      expect(err).not.to.exist();
      expect(sms).to.exist();
      done();
    });
  });
  it('should send sms', (done) => {
    SMS.send(provider, phone, longText, (err, result) => {
      expect(err).not.to.exist();
      expect(result).to.exist();
      done();
    });
  });
});
