const express = require("express");
const router = express.Router();
const { tbPointStoreHD, tbPointStoreDT } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const e = require("express");
const Encrypt = new ValidateEncrypt();

router.post("/", validateToken, async (req, res) => {
  const pointStoreHD = await tbPointStoreHD.findOne({
    where: {
      pointStoreName: req.body.pointStoreName,
      isDeleted: false,
    },
  });

  try {
  } catch (err) {}
  if (!pointStoreHD) {
    const pointStore = await tbPointStoreHD.create(req.body);
    if (req.body.branch.length > 0) {
      let StoreDT = [];
      for (var i = 0; i < req.body.branch.length; i++) {
        if (req.body.branch[i].value !== "") {
          let store = {
            pointBranchName: req.body.branch[i].value,
            tbPointStoreHDId: pointStore.dataValues.id,
            isDeleted: false,
          };
          StoreDT.push(store);
        }
      }
      const pointStoreDT = await tbPointStoreDT.bulkCreate(StoreDT);
    }

    Encrypt.encryptValueId(pointStore);

    res.json({
      status: true,
      isPointStoreName: false,
      message: "success",
      tbPointStoreHD: pointStore,
    });
  } else {
    res.json({
      status: false,
      isPointStoreName: true,
      message: "unsuccess",
      tbPointStoreHD: null,
    });
  }
});

router.get("/", validateToken, async (req, res) => {
  const listPointStore = await tbPointStoreHD.findAll({
    where: { isDeleted: false },
    order: [["createdAt", "DESC"]],
  });

  Encrypt.encryptValueIdArray(listPointStore);

  res.json({
    status: true,
    message: "success",
    tbPointStoreHD: listPointStore,
  });
});

router.get("/byId/:id", validateToken, async (req, res) => {
  const id = Encrypt.DecodeKey(req.params.id);
  const listPointStore = await tbPointStoreHD.findOne({
    where: { id: id, isDeleted: false },
  });

  Encrypt.encryptValueId(listPointStore);
  const listPointStoreDT = await tbPointStoreDT.findAll({
    where: { tbPointStoreHDId: id, isDeleted: false },
  });
  res.json({
    status: true,
    message: "success",
    tbPointStoreHD: listPointStore,
    tbPointStoreDT: listPointStoreDT,
  });
});

router.put("/", validateToken, async (req, res) => {
  req.body.id = Encrypt.DecodeKey(req.body.id);
  const pointStoreHD = await tbPointStoreHD.findOne({
    where: {
      pointStoreName: req.body.pointStoreName,
      isDeleted: false,
      id: {
        [Op.ne]: req.body.id,
      },
    },
  });

  if (!pointStoreHD) {
    const listPointStore = await tbPointStoreHD.update(req.body, {
      where: { id: req.body.id },
    });
    let ValueNot = [];
    let StoreDT = [];
    for (var i = 0; i < req.body.branch.length; i++) {
      ValueNot[i] = req.body.branch[i].id;

      if (req.body.branch[i].value !== "" && req.body.branch[i].id === "") {
        let store = {
          pointBranchName: req.body.branch[i].value,
          tbPointStoreHDId: req.body.id,
          isDeleted: false,
        };
        StoreDT.push(store);
      }

      if (req.body.branch[i].value !== "" && req.body.branch[i].id !== "") {
        let store = {
          pointBranchName: req.body.branch[i].value,
          tbPointStoreHDId: req.body.id,
          isDeleted: false,
        };
        await tbPointStoreDT.update(store, {
          where: { id: req.body.branch[i].id },
        });
      }
    }

    const listPointStoreDelete = await tbPointStoreDT.update(
      { isDeleted: true },
      {
        where: { id: { [Op.notIn]: ValueNot }, tbPointStoreHDId: req.body.id },
      }
    );

    const listPointStoreNew = await tbPointStoreDT.bulkCreate(StoreDT);

    res.json({
      status: true,
      message: "success",
      tbPointStoreHD: listPointStore,
    });
  } else {
    res.json({
      status: false,
      isPointStoreName: true,
      message: "success",
      tbPointStoreHD: null,
    });
  }
});

router.delete("/:pointStoreId", validateToken, async (req, res) => {
  const pointStoreId = Encrypt.DecodeKey(req.params.pointStoreId);
  req.body.isDeleted = true;
  tbPointStoreHD.update(req.body, { where: { id: pointStoreId } });
  tbPointStoreDT.update(
    { isDeleted: true },
    { where: { tbPointStoreHDId: pointStoreId } }
  );
  res.json({ status: true, message: "success", tbPointStoreHD: null });
});

router.get("/listPointStore", validateLineToken, async (req, res) => {
  let listPointStore = await tbPointStoreHD.findAll({
    where: { isDeleted: false },
    order: ["pointStoreName", "ordering"],
  });
  const listPointStoreDT = await tbPointStoreDT.findAll({
    where: { isDeleted: false },
  });
  let list = [];
  listPointStore.filter((e) => {
    let dt = [];
    let even;
    listPointStoreDT.filter((_dt) => {
      if (_dt.tbPointStoreHDId == e.id) {
        dt.push({
          value: Encrypt.EncodeKey(_dt.id),
          label: _dt.pointBranchName,
        });
      }
    });
    even = {
      value: Encrypt.EncodeKey(e.id),
      label: e.pointStoreName,
      DT: dt,
    };
    list.push(even);
  });
  res.json({
    status: true,
    message: "success",
    list: list,
  });
});
module.exports = router;
