const db = require("../../models");
const codeCoupon = db.codeCoupon;
const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");
const crypto = require("crypto");
const ValidateEncrypt = require("../../services/crypto");
const iv = "283d0ce11c80a9a4da9eebcb40e7c7d9";
const content = "1fda3b405f0edf98ef80";
const Encrypt = new ValidateEncrypt();

const generateCoupon = async (req, res) => {
  var characters = "abcdefghijklmnopqrstuvwxyz";
  var splitCha = characters.split("");
  var splitEncrypt = content.split("");
  let ArrayCoupons = [];
  console.log(req.body)
  for (var x = 1; x > 0; x++) {
    const n = crypto.randomInt(1000000000, 9999999999);
    const verificationCode = n
      .toString()
      .padStart(10, 0);
    var splitVar = verificationCode.split("");
    var codeCoupon = "";

    for (var i = 0; i < 6; i++) {
      var numCha = Math.floor(Math.random() * splitCha.length);
      var numCode = Math.floor(Math.random() * 10);
      splitVar[numCode] = splitCha[numCha];
    }

    for (var i = 0; i < splitVar.length; i++) {
      if (
        splitVar.length - 1 === i ||
        splitVar.length - 2 === i ||
        splitVar.length - 3 === i ||
        splitVar.length - 4 === i
      ) {
        var numEncrypt = Math.floor(Math.random() * splitEncrypt.length);
        codeCoupon += splitEncrypt[numEncrypt];
      } else codeCoupon += splitVar[i];
    }
    codeCoupon =  req.body.id + codeCoupon
    let ArrayCoupon = {
      codeCoupon: Encrypt.EncodeKey(codeCoupon.toLocaleLowerCase()),
      isUse: 0,
      isDeleted: 0,
      addBy: req.body.addBy,
      redemptionCouponId: req.body.id,
    };
    var Duplicate = ArrayCoupons.some((item) => item.code === codeCoupon);
    if (ArrayCoupons.length === parseInt(req.body.couponCount)) break;
    else if (!Duplicate) ArrayCoupons.push(ArrayCoupon);
  }
  try {
    var result = chunkArray(ArrayCoupons, 100);
    for (var i = 0; i < result.length; i++) {
      let successCode = await createCoupon(result[i]);
    }
    res.status(200).send({
      status:true,
      message: "Generate successfully: ",
    });
  } catch (err) {
    res.status(500).send({
      status:false,
      message: "Fail to Generate data into database!",
      error: err.message,
    });
  }
};

const createCoupon = async (Code) => {
    let returnCode = await codeCoupon.bulkCreate(Code);
    return returnCode;
  };

function chunkArray(myArray, chunk_size) {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    myChunk = myArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }

  return tempArray;
}


const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path =
      __basedir +
      "/server-import/resources/static/assets/uploads/" +
      req.file.filename;

    readXlsxFile(path).then(async (rows) => {
      // skip header
      rows.shift();
      let tutorials = [];
      var rowx = 0;
      rows.forEach((row) => {
        if(row[0] !== null){
          let tutorial = {
            codeCoupon: Encrypt.EncodeKey(row[0].toString().toLocaleLowerCase()),
            isUse: 0,
            isDeleted: 0,
            addBy: req.body.addBy,
            redemptionCouponId: req.body.id,
          };
          tutorials.push(tutorial);
        }
        rowx++;
      });

      try {
        var result = chunkArray(tutorials, 100);
        for (var i = 0; i < result.length; i++) {
          let successCode = await createCoupon(result[i]);
        }
        res.status(200).send({
          status:true,
          message: "Generate successfully: ",
        });
      } catch (err) {
        res.status(500).send({
          status: false,
          message: "Fail to Generate data into database!",
          error: err.message,
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

module.exports = {
  generateCoupon,
  upload,
};
