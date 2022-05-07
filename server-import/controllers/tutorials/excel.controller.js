const db = require("../../models");
const Tutorial = db.tutorials;
const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");
const crypto = require('crypto');
const { encrypt, decrypt } = require('../../services/crypto');
const iv = '283d0ce11c80a9a4da9eebcb40e7c7d9';
const content = '1fda3b405f0edf98ef80';

const upload = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path =
      __basedir +
      "/server-import/resources/static/assets/uploads/" +
      req.file.filename;

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

      let tutorials = [];

      rows.forEach((row) => {
        let tutorial = {
          code: row[0],
          tbPointCodeHDId: req.body.tbPointCodeHDId,
          memberId: null,
          isUse: 0,
          isDeleted: 0,
        };

        tutorials.push(tutorial);
      });

      Tutorial.bulkCreate(tutorials)
        .then(() => {
          res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Fail to import data into database!",
            error: error.message,
          });
        });
    });
  } catch (error) {
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};


const deleteCode = (req, res) => {
  Tutorial.destroy({
    where: {
      tbPointCodeHDId: req.params.id,
    },
  });
  res.json({ status: true, message: "success", tbPointCodeDT: null });
}

const generateCode = (req, res) => {
  var characters = "abcdefghijklmnopqrstuvwxyz";
  var splitCha = characters.split("");
  var splitEncrypt = content.split('');
  let ArrayCoupons = [];

  for (var x = 1; x > 0; x++) {
  
    const n = crypto.randomInt(1000000000, 9999999999);
    const verificationCode = n
      .toString()
      .padStart(req.body.pointCodeLengthSymbol, "0");
    var splitVar = verificationCode.split("");
    var codeCoupon = "";
    for (var i = 0; i < 6; i++) {
      var numCha = Math.floor(Math.random() * splitCha.length);
      var numCode = Math.floor(Math.random() * req.body.pointCodeLengthSymbol);
      splitVar[numCode] = splitCha[numCha];
    }

    for (var i = 0; i < splitVar.length; i++) {
      if(splitVar.length-1 === i || splitVar.length-2 === i || splitVar.length-3 === i || splitVar.length-4 === i)
      {
        var numEncrypt = Math.floor(Math.random() * splitEncrypt.length);
        codeCoupon += splitEncrypt[numEncrypt];
      } else codeCoupon += splitVar[i];
    }
    codeCoupon = req.body.pointCodeSymbol + "-" + codeCoupon;
    let ArrayCoupon = {
      code: codeCoupon,
      tbPointCodeHDId: req.body.tbPointCodeHDId,
      memberId: null,
      isUse: 0,
      isDeleted: 0,
    };
    var Duplicate = ArrayCoupons.some((item) => item.code === codeCoupon);
    //console.log(req.body.tbPointCodeHDId)
    if (ArrayCoupons.length === parseInt(req.body.pointCodeQuantityCode)) break;
    else if (!Duplicate) ArrayCoupons.push(ArrayCoupon);
  }
  //decryptCoupon(ArrayCoupons[0].code, ArrayCoupons[0].code.length)
  Tutorial.bulkCreate(ArrayCoupons)
  .then(() => {
    res.status(200).send({
      message: "Generate successfully: ",
    });
  })
  .catch((error) => {
    res.status(500).send({
      message: "Fail to Generate data into database!",
      error: error.message,
    });
  });
};



const decryptCoupon = (codeCoupon,length) =>{
  var code = codeCoupon.substring(length-4, length).split('');
  var isMatch = 0;
  for(var i = 0 ; i < 4 ; i++){
    isMatch = content.indexOf(code[0]);
    if(isMatch < 0)
      break;
  }
  return (isMatch < 0) ? false : true;
}

const getTutorials = (req, res) => {
  Tutorial.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

const download = (req, res) => {
  const id = req.params.id;
  console.log(id)
  Tutorial.findAll({ where: { tbPointCodeHDId: id } }).then((objs) => {

    let tutorials = [];

    objs.forEach((obj) => {
      tutorials.push({
        code: obj.code,
        memberId: obj.memberId,
        isUse: obj.isUse,
      });
    });
    res.json(tutorials);

    // let workbook = new excel.Workbook();
    // let worksheet = workbook.addWorksheet("Tutorials");

    // worksheet.columns = [
    //   { header: "code", key: "code", width: 25 }
    // ];
    // // Add Array Rows
    // worksheet.addRows(tutorials);

    // res.setHeader(
    //   "Content-Type",
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    // );
    // res.setHeader(
    //   "Content-Disposition",
    //   "attachment; filename=" + "tutorials.xlsx"
    // );

    // return workbook.xlsx.write(res).then(function () {
    //   res.status(200).end();
    // });
  });
};

module.exports = {
  upload,
  getTutorials,
  download,
  generateCode,
  deleteCode,
};
