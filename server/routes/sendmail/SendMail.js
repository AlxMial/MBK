const express = require("express");
const router = express.Router();
var nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
var ejs = require("ejs");
const { tbMember, tbShop } = require("../../models");

router.post("/", async (req, res) => {
  const frommail = req.body.frommail;
  const password = req.body.password;
  const tomail = req.body.tomail;
  const fullName = req.body.fullName;
  const resetUrl = req.body.resetUrl;
  const filePath = path.join(__dirname, "./index.html");
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(source);
  const replacements = {
    urlPath: resetUrl,
  };
  const htmlToSend = template(replacements);
  var transporter = nodemailer.createTransport({
    // service: 'Outlook365',
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: frommail,
      pass: password,
    },
    secureConnection: true,
    // tls: { ciphers: 'SSLv3' }
  });

  var mailOptions = {
    from: frommail,
    to: tomail,
    text: "แจ้งเปลี่ยนแปลงรหัสผ่าน (ระบบจัดการหลังบ้านข้าวมาบุญครอง)",
    subject: "แจ้งเปลี่ยนแปลงรหัสผ่าน (ระบบจัดการหลังบ้านข้าวมาบุญครอง)",
    html: htmlToSend,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json({
        msg: error,
      });
    } else {
      res.json({
        msg: "success",
      });
    }
  });
});

router.post("/paymentsuccess", async (req, res) => {
  const frommail = req.body.frommail;
  const password = req.body.password;
  const tomail = req.body.tomail;
  const orderNumber = req.body.orderNumber;
  const memberName = req.body.memberName;
  const orderPrice = req.body.orderPrice;
  const orderDate = req.body.orderDate;

  var transporter = nodemailer.createTransport({
    // service: 'Outlook365',
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: frommail,
      pass: password,
    },
    secureConnection: true,
    // tls: { ciphers: 'SSLv3' }
  });

  ejs.renderFile(
    __dirname + "/paymentSuccess.ejs",
    {
      memberName: memberName,
      orderNumber: orderNumber,
      orderPrice: orderPrice,
      orderDate: orderDate,
    },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        var mailOptions = {
          from: frommail,
          to: tomail,
          text: "ใบเสร็จรับเงินสำหรับใบสั่งซื้อ " + orderNumber,
          subject: "ใบเสร็จรับเงินสำหรับใบสั่งซื้อ " + orderNumber,
          html: data,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.json({
              msg: error,
            });
          } else {
            res.json({
              msg: "success",
            });
          }
        });
      }
    }
  );
});


router.post("/paymentsuccessadmin", async (req, res) => {
  const frommail = req.body.frommail;
  const password = req.body.password;
  const tomail = req.body.tomail;
  const orderNumber = req.body.orderNumber;
  const memberName = req.body.memberName;
  const orderPrice = req.body.orderPrice;
  const orderDate = req.body.orderDate;

  var transporter = nodemailer.createTransport({
    // service: 'Outlook365',
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: frommail,
      pass: password,
    },
    secureConnection: true,
    // tls: { ciphers: 'SSLv3' }
  });

  ejs.renderFile(
    __dirname + "/paymentSuccessAdmin.ejs",
    {
      memberName: memberName,
      orderNumber: orderNumber,
      orderPrice: orderPrice,
      orderDate: orderDate,
    },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        var mailOptions = {
          from: frommail,
          to: tomail,
          text: "ใบเสร็จรับเงินสำหรับใบสั่งซื้อ " + orderNumber,
          subject: "ใบเสร็จรับเงินสำหรับใบสั่งซื้อ " + orderNumber,
          html: data,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.json({
              msg: error,
            });
          } else {
            res.json({
              msg: "success",
            });
          }
        });
      }
    }
  );
});


router.post("/paymentwatiting", async (req, res) => {
  const frommail = req.body.frommail;
  const password = req.body.password;
  const tomail = req.body.tomail;
  const orderNumber = req.body.orderNumber;
  const memberName = req.body.memberName;
  var transporter = nodemailer.createTransport({
    // service: 'Outlook365',
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: frommail,
      pass: password,
    },
    secureConnection: true,
    // tls: { ciphers: 'SSLv3' }
  });

  ejs.renderFile(
    __dirname + "/paymentWatiting.ejs",
    {
      memberName: memberName,
      orderNumber: orderNumber,
    },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        var mailOptions = {
          from: frommail,
          to: tomail,
          text: "เราได้รับแจ้งการโอนเงินสำหรับ " + orderNumber + " แล้ว",
          subject: "เราได้รับแจ้งการโอนเงินสำหรับ " + orderNumber + " แล้ว",
          html: data,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.json({
              msg: error,
            });
          } else {
            res.json({
              msg: "success",
            });
          }
        });
      }
    }
  );
});

router.post("/paymentwatitingadmin", async (req, res) => {
  const frommail = req.body.frommail;
  const password = req.body.password;
  let tomail = "";
  const orderNumber = req.body.orderNumber;
  const memberName = req.body.memberName;

  const shop = await tbShop.findAll();
  shop.map((e, i) => {
    if (shop.length - 1 === i)
      tomail =
        e.dataValues["email1"] +
        "," +
        e.dataValues["email2"] +
        "," +
        e.dataValues["email3"] +
        "," +
        e.dataValues["email4"] +
        "," +
        e.dataValues["email5"] +
        "," +
        e.dataValues["email6"];
  });

  var transporter = nodemailer.createTransport({
    // service: 'Outlook365',
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: frommail,
      pass: password,
    },
    secureConnection: true,
    // tls: { ciphers: 'SSLv3' }
  });

  ejs.renderFile(
    __dirname + "/paymentWattingAdmin.ejs",
    {
      memberName: memberName,
      orderNumber: orderNumber
     },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {

        var mailOptions = {
          from: frommail,
          to: tomail,
          text: "เราได้รับแจ้งการโอนเงินสำหรับ " + orderNumber + " แล้ว",
          subject: "เราได้รับแจ้งการโอนเงินสำหรับ " + orderNumber + " แล้ว",
          html: data,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.json({
              msg: error,
            });
          } else {
            res.json({
              msg: "success",
            });
          }
        });
      }
    }
  );
});

router.post("/cancelsuccess", async (req, res) => {
  const frommail = req.body.frommail;
  const password = req.body.password;
  const tomail = req.body.tomail;
  const orderNumber = req.body.orderNumber;
  const orderDate = req.body.orderDate;
  const memberName = req.body.memberName;
  const cancelDetail = req.body.cancelDetail;
  const cancelRemark = req.body.cancelRemark;

  var transporter = nodemailer.createTransport({
    // service: 'Outlook365',
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: frommail,
      pass: password,
    },
    secureConnection: true,
    // tls: { ciphers: 'SSLv3' }
  });
  ejs.renderFile(
    __dirname + "/cancelSuccess.ejs",
    {
      memberName: memberName,
      orderNumber: orderNumber,
      cancelDetail: cancelDetail,
      cancelRemark: cancelRemark,
      orderDate:orderDate
     },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {

        var mailOptions = {
          from: frommail,
          to: tomail,
          text: "ทางเราได้ทำการยกเลิก " + orderNumber + "แล้ว",
          subject: "ทางเราได้ทำการยกเลิก " + orderNumber + " แล้ว",
          html: data,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.json({
              msg: error,
            });
          } else {
            res.json({
              msg: "success",
            });
          }
        });
      }
    }
  );
});


router.post("/returnsuccess", async (req, res) => {
  const frommail = req.body.frommail;
  const password = req.body.password;
  let tomail = "";
  const orderNumber = req.body.orderNumber;
  const memberName = req.body.memberName;



  var transporter = nodemailer.createTransport({
    // service: 'Outlook365',
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: frommail,
      pass: password,
    },
    secureConnection: true,
    // tls: { ciphers: 'SSLv3' }
  });

  ejs.renderFile(
    __dirname + "/paymentWattingAdmin.ejs",
    {
      memberName: memberName,
      orderNumber: orderNumber
     },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {

        var mailOptions = {
          from: frommail,
          to: tomail,
          text: "เราได้รับแจ้งการโอนเงินสำหรับ " + orderNumber + " แล้ว",
          subject: "เราได้รับแจ้งการโอนเงินสำหรับ " + orderNumber + " แล้ว",
          html: data,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.json({
              msg: error,
            });
          } else {
            res.json({
              msg: "success",
            });
          }
        });
      }
    }
  );
});

module.exports = router;
