const crypto = require("crypto");

const secret = "secret";
const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b";
const IV = "5183666c72eec9e4";

class ValidateEncrypt {
  encrypt = (val) => {
    let cipher = crypto.createCipheriv(
      "aes-256-cbc",
      ENC_KEY,
      IV
    );
    let encrypted = cipher.update(val, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  };

  decrypt = (encrypted) => {
    let decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      ENC_KEY,
      IV
    );
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    return decrypted + decipher.final("utf8");
  };

  EncodeKey(id) {
    if (this.IsNullOrEmpty(id)) {
      return "";
    }
    id = this.encrypt(id.toString());
    let buf = new Buffer.from(id, "ascii");
    id = buf.toString("base64");
    return id;
  }

  DecodeKey(id) {
    if (this.IsNullOrEmpty(id)) {
      return "";
    }
    let buff = new Buffer.from(id, "base64");
    id = buff.toString("ascii");
    return this.decrypt(id);
  }

  IsNullOrEmpty = (obj) => {
    if ("undefined" === typeof obj || obj == null) {
      return true;
    } else if (
      typeof obj != "undefined" &&
      obj != null &&
      obj.length != null &&
      obj.length == 0
    ) {
      return true; //array
    } else if ("number" === typeof obj) {
      return obj !== obj; //NaN
    } else if ("string" === typeof obj) {
      return obj.length < 1 ? true : false;
    } else {
      return false;
    }
  };
  IsNull(obj, val) {
    return this.IsNullOrEmpty(obj) ? (this.IsNullOrEmpty(val) ? "" : val) : obj;
  }
}

module.exports = ValidateEncrypt;

