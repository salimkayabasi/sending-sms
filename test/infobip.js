const chai = require('chai');
const dirtyChai = require('dirty-chai');
const SMS = require('../');

chai.use(dirtyChai);
const expect = chai.expect;

const text = process.env.TEXT;
const phone = process.env.PHONE;

// test text with 200 chars
const longText = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ' +
  'Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque ' +
  'penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec qu';

describe('Sms Tests w/o auth', () => {
  it('should give init error', (done) => {
    SMS.send('infobip', phone, text, (err, sms) => {
      expect(err).to.exist();
      expect(err.message).to.equal('Init required');
      expect(sms).not.to.exist();
      done();
    });
  });
  it('should give missing parameters error', (done) => {
    try {
      SMS.setAuth('infobip', process.env.INFOBIP_USERNAME);
    } catch (error) {
      expect(error).to.exist();
      expect(error.message).to.equal('Missing Parameters');
      done();
    }
  });
  it('should give invalid provider error', (done) => {
    try {
      SMS.setAuth('testprovider');
    } catch (error) {
      expect(error).to.exist();
      expect(error.message).to.equal('Not valid provider');
      done();
    }
  });
});

describe('Send sms w/ auth', () => {
  before(() => {
    SMS.setAuth('infobip',
      process.env.INFOBIP_USERNAME,
      process.env.INFOBIP_PASSWORD,
      process.env.INFOBIP_SENDER);
  });
  it('should send sms', (done) => {
    SMS.send('infobip', phone, text, (err, sms) => {
      expect(err).not.to.exist();
      expect(sms).to.exist();
      done();
    });
  });
  it('should send sms', (done) => {
    SMS.send('infobip', phone, longText, (err, results) => {
      expect(err).not.to.exist();
      expect(results).to.exist();
      done();
    });
  });
});
