const express = require("express");
const router = express.Router();
const { tbUser } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await tbUser.findOne({ where: { email: email } });
  if (!user) 
  { 
    res.json({ error: "User Doesn't Exist" });
  } else {

    bcrypt.compare(password, user.password).then(async (match) => {

      if (!match)
      { res.json({ error: "Wrong email And Password Combination" }); 
      } else {
        const accessToken = sign(
          { email: user.email, id: user.id , role:user.role },
          "MBKPROJECT"
        );
        res.json({ token: accessToken, 
          email: email , 
          id: user.id , 
          role:user.role,
          firstName:user.firstName,
          lastName:user.lastName });
      }
    });
  }
});

router.get('/auth',validateToken,(req,res) =>{
  res.json(req.user);
});

module.exports = router;