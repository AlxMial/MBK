const express = require("express");
const router = express.Router();
const { tbUser } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const ValidateEncrypt = require("../../services/crypto");
const Op = Sequelize.Op;
const Encrypt = new ValidateEncrypt();
const config = require("../../services/config.line");
const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    dialect: config.database.dialect,
  }
);

router.post("/login", async (req, res) => {
  // const [results, data] = await sequelize.query(`update  tbpointcodedts set isExpire = 1 where tbPointCodeHDId in (select id from tbpointcodehds where endDate < now() and isDeleted = 0 )`);

  const { userName, password } = req.body;
  const user = await tbUser.findOne({
    attributes: [
      "id",
      "userName",
      "password",
      "role",
      "firstName",
      "lastName",
      "email",
      "empCode",
      "position",
    ],
    where: {
      userName: Encrypt.EncodeKey(userName.toLowerCase()),
      isDeleted: false,
    },
  });

  if (!user) {
    res.json({ error: "User Doesn't Exist" });
  } else {
    bcrypt.compare(password, user.password).then(async (match) => {
      if (!match) {
        res.json({ error: "Wrong Username And Password Combination" });
      } else {
        const accessToken = sign(
          {
            userName: user.userName,
            id: user.id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          },
          "MBKPROJECT",
          { expiresIn: "1440m" }
        );
        res.json({
          token: accessToken,
          userName: userName,
          id: user.id,
          firstName: Encrypt.DecodeKey(user.firstName),
          lastName: Encrypt.DecodeKey(user.lastName),
          link:
            Encrypt.DecodeKey(user.role) === "3"
              ? "/admin/members"
              : Encrypt.DecodeKey(user.role) === "2"
              ? "/admin/order"
              : "/admin/users",
        });
      }
    });
  }
});

router.get("/auth", (req, res) => {
  res.json(req.user);
});

router.post("/", validateToken, async (req, res) => {
  try {
    const user = await tbUser.findOne({
      attributes: [
        "id",
        "userName",
        "password",
        "firstName",
        "lastName",
        "email",
        "empCode",
        "position",
      ],
      where: {
        [Op.or]: [
          { email: Encrypt.EncodeKey(req.body.email.toLowerCase()) },
          { userName: Encrypt.EncodeKey(req.body.userName.toLowerCase()) },
        ],
        isDeleted: false,
      },
    });

    if (!user) {
      if (
        !Encrypt.IsNullOrEmpty(req.body.role) &&
        !Encrypt.IsNullOrEmpty(req.body.firstName) &&
        !Encrypt.IsNullOrEmpty(req.body.lastName) &&
        !Encrypt.IsNullOrEmpty(req.body.email) &&
        !Encrypt.IsNullOrEmpty(req.body.empCode) &&
        !Encrypt.IsNullOrEmpty(req.body.position) &&
        !Encrypt.IsNullOrEmpty(req.body.userName) &&
        !Encrypt.IsNullOrEmpty(req.body.password)
      ) {
        bcrypt.hash(req.body.password, 10).then(async (hash) => {
          req.body.password = hash;
          req.body.email = req.body.email.toLowerCase();
          req.body.userName = req.body.userName.toLowerCase();
          const ValuesReq = Encrypt.encryptAllData(req.body);
          const listUser = await tbUser.create(ValuesReq);
          const ValuesDecrypt = Encrypt.decryptAllData(listUser);
          Encrypt.encryptValueId(ValuesDecrypt);
          res.json({ status: true, message: "success", tbUser: ValuesDecrypt });
        });
      } else {
        res.json({ status: false, error: "value is empty" });
      }
    } else {
      if (user.email === Encrypt.EncodeKey(req.body.email.toLowerCase()))
        res.json({
          status: false,
          message: "Email ?????????????????????????????????????????????????????????????????????????????????????????????",
          tbUser: null,
        });
      else if (
        user.userName === Encrypt.EncodeKey(req.body.userName.toLowerCase())
      )
        res.json({
          status: false,
          message: "Username ?????????????????????????????????????????????????????????????????????????????????????????????",
          tbUser: null,
        });
    }
  } catch (err) {
    res.json({ status: false, message: err.message, tbUesr: null });
  }
});

router.get("/", validateToken, async (req, res) => {
  const listUser = await tbUser.findAll({
    attributes: [
      "id",
      "userName",
      "password",
      "firstName",
      "lastName",
      "email",
      "empCode",
      "position",
      "role",
    ],
    where: { isDeleted: false },
  });
  if (listUser.length > 0) {
    const valueData = Encrypt.decryptAllDataArray(listUser);
    Encrypt.encryptValueIdArray(valueData);
    for (var i = 0; i < valueData.length; i++) {
      valueData[i].dataValues.role =
        Encrypt.DecodeKey(valueData[i].dataValues.role) === "1"
          ? "?????????????????????????????????"
          : Encrypt.DecodeKey(valueData[i].dataValues.role) === "2"
          ? "???????????????"
          : "?????????????????????";
    }
    res.json({ status: true, message: "success", tbUser: valueData });
  } else res.json({ status: false, message: "not found user", tbUser: null });
});

router.get("/byId/:id", validateToken, async (req, res) => {
  if (req.params.id !== "undefined") {
    const id = Encrypt.DecodeKey(req.params.id);
    const listUser = await tbUser.findOne({
      attributes: [
        "id",
        "userName",
        "password",
        "firstName",
        "lastName",
        "email",
        "empCode",
        "position",
        "role",
      ],
      where: { id: id },
    });
    const valueData = Encrypt.decryptAllData(listUser);
    Encrypt.encryptValueId(valueData);
    valueData.dataValues.role = Encrypt.DecodeKey(valueData.dataValues.role);
    res.json({ status: true, message: "success", tbUser: valueData });
  } else {
    res.json({ status: true, message: "success", tbUser: null });
  }
});

router.get("/permission/:username", validateToken, async (req, res) => {
  if (req.params.username !== "undefined") {
    const username = req.params.username;
    const listUser = await tbUser.findOne({
      attributes: [
        "id",
        "userName",
        "password",
        "role",
        "firstName",
        "lastName",
        "email",
        "empCode",
        "position",
      ],
      where: { userName: Encrypt.EncodeKey(username.toLocaleLowerCase()) },
    });
    const valueData = Encrypt.decryptAllData(listUser);
    Encrypt.encryptValueId(valueData);
    res.json({ status: true, message: "success", tbUser: valueData });
  } else {
    res.json({ status: true, message: "unsuccess", tbUser: null });
  }
});

router.put("/", validateToken, async (req, res) => {
  req.body.id = Encrypt.DecodeKey(req.body.id);
  const user = await tbUser.findOne({
    attributes: [
      "id",
      "userName",
      "password",
      "firstName",
      "lastName",
      "email",
      "empCode",
      "position",
    ],
    where: { id: req.body.id },
  });

  const userCheck = await tbUser.findOne({
    attributes: [
      "id",
      "userName",
      "password",
      "firstName",
      "lastName",
      "email",
      "empCode",
      "position",
    ],
    where: {
      [Op.or]: [
        { userName: Encrypt.EncodeKey(req.body.userName.toLowerCase()) },
        { email: Encrypt.EncodeKey(req.body.email.toLowerCase()) },
      ],
      isDeleted: false,
      id: {
        [Op.ne]: req.body.id,
      },
    },
  });

  if (!userCheck) {
    if (!user) {
      res.json({ status: false, error: "user not found" });
    } else {
      if (
        !Encrypt.IsNullOrEmpty(req.body.role) &&
        !Encrypt.IsNullOrEmpty(req.body.firstName) &&
        !Encrypt.IsNullOrEmpty(req.body.lastName) &&
        !Encrypt.IsNullOrEmpty(req.body.email) &&
        !Encrypt.IsNullOrEmpty(req.body.empCode) &&
        !Encrypt.IsNullOrEmpty(req.body.position) &&
        !Encrypt.IsNullOrEmpty(req.body.userName)
      ) {
        if (req.body.currentPassword !== "" && req.body.password !== "") {
          bcrypt
            .compare(req.body.currentPassword, user.password)
            .then(async (match) => {
              if (!match) {
                res.json({
                  status: false,
                  isMatch: false,
                  error: "Wrong Password Combination",
                });
              } else {
                bcrypt.hash(req.body.password, 10).then(async (hash) => {
                  req.body.password = hash;
                  req.body.email = req.body.email.toLowerCase();
                  req.body.userName = req.body.userName.toLowerCase();
                  const ValuesReq = Encrypt.encryptAllData(req.body);
                  const listUser = await tbUser.update(ValuesReq, {
                    where: { id: req.body.id },
                  });
                  res.json({
                    status: true,
                    message: "success",
                    tbUser: null,
                  });
                });
              }
            });
        } else {
          req.body.password = user.password;
          req.body.email = req.body.email.toLowerCase();
          req.body.userName = req.body.userName.toLowerCase();
          const ValuesReq = Encrypt.encryptAllData(req.body);
          const listUser = await tbUser.update(ValuesReq, {
            where: { id: req.body.id },
          });
          res.json({ status: true, message: "success", tbUser: null });
        }
      } else {
        res.json({ status: false, error: "value is empty" });
      }
    }
  } else {
    if (userCheck.email === Encrypt.EncodeKey(req.body.email.toLowerCase()))
      res.json({
        status: false,
        message: "Email ?????????????????????????????????????????????????????????????????????????????????????????????",
        tbUser: null,
      });
    else if (
      userCheck.userName === Encrypt.EncodeKey(req.body.userName.toLowerCase())
    )
      res.json({
        status: false,
        message: "Username ?????????????????????????????????????????????????????????????????????????????????????????????",
        tbUser: null,
      });
  }
});

router.delete("/multidelete/:userId", validateToken, (req, res) => {
  const userId = Encrypt.DecodeKey(req.params.userId);
  const words = Encrypt.encryptValueIdArray(userId.split(","));
  for (const type of words) {
    req.body.isDeleted = true;
    tbUser.update(req.body, { where: { id: type } });
  }
  res.json({ status: true, message: "success", tbUser: null });
});

router.delete("/:userId", validateToken, async (req, res) => {
  const userId = Encrypt.DecodeKey(req.params.userId);
  req.body.isDeleted = true;
  tbUser.update(req.body, { where: { id: userId } });
  res.json({ status: true, message: "success", tbUser: null });
});

router.get("/getemail/:email", async (req, res) => {
  const email = Encrypt.EncodeKey(req.params.email.toLocaleLowerCase());
  const user = await tbUser.findOne({
    attributes: [
      "id",
      "userName",
      "password",
      "firstName",
      "lastName",
      "email",
      "empCode",
      "position",
    ],
    where: { email: email, IsDeleted: false },
  });

  if (user) {
    Encrypt.decryptAllData(user);
    Encrypt.encryptValueId(user);
    res.json(user);
  } else {
    res.json(null);
  }
});

router.put("/updatePassword", (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    req.body.password = hash;
    req.body.id = Encrypt.DecodeKey(req.body.id);
    tbUser.update(
      { password: req.body.password },
      { where: { id: req.body.id } }
    );
    res.json("SUCCESS");
  });
});

module.exports = router;
