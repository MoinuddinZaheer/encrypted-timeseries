const crypto = require("crypto")

const decryptRequestData = async function (encryptedData) {
  const keyBuffer = crypto.randomBytes(32);
  const ivBuffer = crypto.randomBytes(16);
  const cipherBuffer = Buffer.from(keyBuffer, 'base64');

  var decipher = crypto.createDecipheriv("aes-256-ctr", cipherBuffer, ivBuffer);
  var dec = decipher.update(encryptedData, 'hex', 'utf8')
  dec += decipher.final('utf8');

  return dec.toString('utf-8');
}
const encryptResponseData = async function (reqData) {
  reqData = JSON.stringify(reqData);
  const keyBuffer = crypto.randomBytes(32);
  const ivBuffer = crypto.randomBytes(16);
  const cipherBuffer = Buffer.from(keyBuffer, 'base64');

  var cipher = crypto.createCipheriv("aes-256-ctr", cipherBuffer, ivBuffer);
  var crypted = cipher.update(reqData, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

module.exports = {
  decryptRequestData,
  encryptResponseData
}