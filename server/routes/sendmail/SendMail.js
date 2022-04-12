const express = require("express");
const router = express.Router();
var nodemailer = require('nodemailer');

router.post("/",async (req,res)=>{
  const frommail=req.body.frommail
  const password = req.body.password
  const tomail=req.body.tomail
  const fullName = req.body.fullName
  const resetUrl = req.body.resetUrl
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: frommail,
      pass: password
    }
  });
  
  var mailOptions = {
    from: frommail,
    to: tomail,
    subject: 'Forgot password',
    text: `sending mail using Node.js was running successfully. Hope it help you. For more code and project Please Refer my github page`,       
    html: '<div style="width: 100%;margin-top:6px;"><div style="display: flex;"><div style="margin: auto; font-weight: bold; font-size: 18px;">Rice and Mangosteen Learning By MJU</div></div>' +
    '<div style="display: flex; padding-top: 5px;"><div style="margin: auto; font-size: 18px;">Reset your password</div></div><div style="display: flex; padding-top: 25px;">' +
    '<div style="margin: auto; font-size: 16px;">You can use the following button to reset your password.</div></div><div style="display: flex; padding-top: 15px;"><a href="' +
    resetUrl +'" target="_blank" style="margin: auto; cursor: pointer; width: 300px; height: 50px; line-height: 50px; color: #fff; text-align: center; font-size: 16px; ' +
    'background-color:#56941A ;">Reset your password</a></div><div style="display: flex; padding-top: 25px;"><div style="margin: auto; font-size: 16px;' +
    ' width: 450px;">Thanks,</div></div><div style="display: flex;"><div style="margin: auto; font-size: 16px; width: 450px;">Maejo University</div></div></div>'
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