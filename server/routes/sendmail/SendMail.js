const express = require("express");
const router = express.Router();
var nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");
var ejs = require("ejs");
const { tbMember,
  tbMemberPoint,
  tbPointCodeHD, 
  tbPointCodeDT, 
  tbRedemptionConditionsHD,
  tbRedemptionCoupon,
  tbRedemptionProduct,
  tbMemberReward,
  tbCouponCode, } = require("../../models");

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
  const orderDetail = req.body.orderDetail;
  const orderDate = req.body.orderDate;
  const orderPrice = req.body.orderPrice;

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
      orderDetail: orderDetail,
      orderDate:orderDate,
      orderPrice:orderPrice
     },
    function (err, data) {
      if (err) {
        console.log(err);
      } else {

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
  const orderDetail = req.body.orderDetail
  // const orderDetail = await tbRedemptionCoupon.findAll();
  // await orderDetail.map((e,i) =>{
  //   order.push({value:i , label:e.dataValues.couponName})
  // })
  // console.log(order)


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
      orderDetail: orderDetail
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
