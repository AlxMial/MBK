const express = require("express");
const router = express.Router();
const { tbMenu, tbPermission } = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

router.get("/", validateToken, async (req, res) => {
  const menu = await tbMenu.findAll();
  const menuShow = [];
  console.log(Encrypt.DecodeKey(req.user.role))
  const listMenu = await tbPermission.findAll({
    where: { role: Encrypt.DecodeKey(req.user.role) },
  });
  try {
    if (menu && listMenu) {
      menu.map((e, i) => {
        let _menu = e.dataValues;
        _menu.chlied = [];
        listMenu.map((l, i) => {
          let _listMenu = l.dataValues;
          if (_menu.id == _listMenu.menuId && _listMenu.isEnable)
          {
            _menu.chlied.push(_listMenu);
            menuShow.push(_menu);
          }
        });
      });
    }
  } catch (err) {
    console.log(err.message);
  }
  res.json({ data: menuShow });
});

module.exports = router;
