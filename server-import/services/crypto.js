const crypto = require('crypto');
var assert = require('assert');

var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = 'password';
var text = 'I love kittens';
const encrypt = (text) => {

    const n = crypto.randomInt(0, 1000000);
    const verificationCode = n.toString().padStart(6, "0");
    const bufferText = Buffer.from('hello world').toString('hex') // or Buffer.from('hello world')
    console.log(bufferText); // <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>

};

const decrypt = (hash) => {


};

module.exports = {
    encrypt,
    decrypt
};