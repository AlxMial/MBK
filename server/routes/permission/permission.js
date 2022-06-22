const express = require("express");
const router = express.Router();
const { tbMenu, tbPermission, tbPermissionControl } = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

router.post("/", validateToken, async (req, res) => {
  const listMenu = await tbPermission.findOne({
    where: { role: Encrypt.DecodeKey(req.user.role) , menuId : req.body.menuId },
  });
  if(listMenu){
    const permissionShow = await tbPermissionControl.findAll({
      where: { permissionId : listMenu.dataValues.id },
    })
    res.json({ data: permissionShow });
  }else {
    res.json({ data: null });
  }

});

module.exports = router;
