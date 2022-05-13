const express = require("express");
const router = express.Router();
var nodemailer = require('nodemailer');
const path = require("path");
const fs = require("fs");
const handlebars = require("handlebars");

router.post("/",async (req,res)=>{
  const frommail=req.body.frommail
  const password = req.body.password
  const tomail=req.body.tomail
  const fullName = req.body.fullName
  const resetUrl = req.body.resetUrl

  const filePath = path.join(__dirname, './index.html');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const replacements = {
    urlPath: resetUrl
  };
  const htmlToSend = template(replacements);
  var transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: frommail,
      pass: password
    }
  });
  
  var mailOptions = {
    from: frommail,
    to: tomail,
    text: "เปลี่ยนแปลงรหัสเข้าสู่ระบบหลังบ้าน ระบบ Line Liff ข้าวมาบุญครอง",
    subject: 'เปลี่ยนแปลงรหัสเข้าสู่ระบบหลังบ้าน ระบบ Line Liff ข้าวมาบุญครอง',
    html : htmlToSend
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      res.json({
        msg: 'fail'
      });
    } 
    else{
      res.json({
        msg: 'success'
      })
    }
  });

})


module.exports = router;