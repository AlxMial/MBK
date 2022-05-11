const crypto = require("crypto");

const secret = "secret";
const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b";
const IV = "5183666c72eec9e4";

class ValidateEncrypt {
  encrypt = (val) => {
    let cipher = crypto.createCipheriv("aes-256-cbc", ENC_KEY, IV);
    let encrypted = cipher.update(val, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  };

  decrypt = (encrypted) => {
    let decipher = crypto.createDecipheriv("aes-256-cbc", ENC_KEY, IV);
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

  encryptValueId(list) {
    list.dataValues.id = this.EncodeKey(list.dataValues.id);
    return list;
  }

  encryptValueIdArray(list) {
    for (var i = 0; i < list.length; i++) {
      list[i].dataValues.id = this.EncodeKey(list[i].dataValues.id);
    }
    return list;
  }

  encryptPhoneArray(list) {
    for (var i = 0; i < list.length; i++) {
      list[i].dataValues.phone =
        "xxxxxx" +
        list[i].dataValues.phone.substring(
          list[i].dataValues.phone.length - 4,
          list[i].dataValues.phone.length
        );
    }
    return list;
  }

  encryptPhone(list) {
    list.dataValues.phone =
      "xxxxxx" +
      list.dataValues.phone.substring(
        list.dataValues.phone.length - 4,
        list.dataValues.phone.length
      );
    return list;
  }

  encryptEmailArray(list) {
    for (var i = 0; i < list.length; i++) {
      const splitEmail = list[i].dataValues.email.split("@");
      if (splitEmail.length > 1) {
        1;
        list[i].dataValues.email = splitEmail[1].substring(0,3) + "xxxx.xxx@" + splitEmail[1];
      }
    }
    return list;
  }

  encryptEmail(list) {
    const splitEmail = list.dataValues.email.split("@");
    if (splitEmail.length > 1) {
      1;
      list.dataValues.email = splitEmail[1].substring(0,3)+"xxxx.xxx@" + splitEmail[1];
    }
    return list;
  }

  // encryptAllDataArray(list) {
  //   for (var columns in list.dataValues) {
  //     if (
  //       (!columns.toLocaleLowerCase().includes("id") &&
  //         !columns.toLocaleLowerCase().includes("delete") &&
  //         !columns.toLocaleLowerCase().includes("created") &&
  //         !columns.toLocaleLowerCase().includes("updated")) ||
  //       columns.toLocaleLowerCase().includes("identity")
  //     ) {
  //       list[0].dataValues[columns] = this.EncodeKey(
  //         list[0].dataValues[columns]
  //       );
  //     }
  //   }
  //   return list;
  // }

  encryptAllData(list) {
    for (var columns in list) {
      if (
        !columns.toLocaleLowerCase().includes("id") &&
        !columns.toLocaleLowerCase().includes("delete") &&
        !columns.toLocaleLowerCase().includes("created") &&
        !columns.toLocaleLowerCase().includes("updated") &&
        !columns.toLocaleLowerCase().includes("identity") &&
        !columns.toLocaleLowerCase().includes("pass") &&
        columns !== "uid" &&
        columns !== "memberType" &&
        columns !== "memberPointExpire" &&
        columns !== "subDistrict" &&
        columns !== "district" &&
        columns !== "province" &&
        columns !== "postcode" &&
        columns !== "registerDate" &&
        columns !== "uid" &&
        columns !== "country" &&
        columns !== "memberPoint" &&
        list[columns] !== ""
      ) {
        list[columns] = this.EncodeKey(list[columns]);
      }
    }
    return list;
  }

  decryptAllData(list) {
    for (var columns in list.dataValues) {
      if (
        !columns.toLocaleLowerCase().includes("id") &&
        !columns.toLocaleLowerCase().includes("delete") &&
        !columns.toLocaleLowerCase().includes("created") &&
        !columns.toLocaleLowerCase().includes("updated") &&
        !columns.toLocaleLowerCase().includes("identity") &&
        !columns.toLocaleLowerCase().includes("pass") &&
        columns !== "uid" &&
        columns !== "memberType" &&
        columns !== "memberPointExpire" &&
        columns !== "subDistrict" &&
        columns !== "district" &&
        columns !== "province" &&
        columns !== "postcode" &&
        columns !== "registerDate" &&
        columns !== "uid" &&
        columns !== "country" &&
        columns !== "memberPoint" &&
        list[columns] !== ""
      ) {
        list.dataValues[columns] = this.DecodeKey(list.dataValues[columns]);
      }
    }
    return list;
  }

  decryptAllDataArray(list) {
    var i = 0;
    for (var columns in list[0].dataValues) {
      if (
        !columns.toLocaleLowerCase().includes("id") &&
        !columns.toLocaleLowerCase().includes("delete") &&
        !columns.toLocaleLowerCase().includes("created") &&
        !columns.toLocaleLowerCase().includes("updated") &&
        !columns.toLocaleLowerCase().includes("identity") &&
        !columns.toLocaleLowerCase().includes("pass") &&
        columns !== "uid" &&
        columns !== "memberType" &&
        columns !== "memberPointExpire" &&
        columns !== "subDistrict" &&
        columns !== "district" &&
        columns !== "province" &&
        columns !== "postcode" &&
        columns !== "registerDate" &&
        columns !== "uid" &&
        columns !== "country" &&
        columns !== "memberPoint" &&
        list[columns] !== ""
      ) {
        for (var i = 0; i < list.length; i++) {
          list[i].dataValues[columns] = this.DecodeKey(
            list[i].dataValues[columns]
          );
        }
      }
    }
    return list;
  }
}

module.exports = ValidateEncrypt;
