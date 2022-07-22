const express = require("express");
const router = express.Router();
const { tbProductCategory, tbImage } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

router.post("/", validateToken, async (req, res) => {
  const data = await tbProductCategory.create(req.body);
  if (req.body.dataImage != null) {
    await tbImage.create({
      createdAt: new Date(),
      relatedId: data.id,
      image: req.body.dataImage,
      isDeleted: false,
      relatedTable: "tbProductCategory",
    });
  }
  res.json({
    status: true,
    message: "success",
    tbProductCategory: data,
  });
});

router.get("/", validateToken, async (req, res) => {
  const data = await tbProductCategory.findAll({
    where: { isDeleted: false },
  });
  res.json({
    status: true,
    message: "success",
    tbProductCategory: data,
  });
});

router.get("/byId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const data = await tbProductCategory.findOne({ where: { id: id } });
  const img = await tbImage.findOne({
    where: {
      relatedId: id,
      isDeleted: false,
      relatedTable: "tbProductCategory",
    },
  });
  if (img) {
    data.dataValues.dataImage = img.dataValues.image;
  }

  res.json({
    status: true,
    message: "success",
    tbProductCategory: data,
  });
});

router.put("/", validateToken, async (req, res) => {
  const data = await tbProductCategory.findOne({
    where: {
      isDeleted: false,
      id: {
        [Op.ne]: req.body.id,
      },
    },
  });

  const dataUpdate = await tbProductCategory.update(req.body, {
    where: { id: req.body.id },
  });

  const _tbImage = await tbImage.findOne({
    attributes: ["image"],
    where: {
      isDeleted: false,
      relatedId: req.body.id,
      relatedTable: "tbProductCategory",
    },
  });
  if (_tbImage) {
    await tbImage.update(
      { image: req.body.dataImage },
      {
        where: { relatedId: req.body.id, relatedTable: "tbProductCategory" },
      }
    );
  } else {
    if (req.body.dataImage != null) {
      await tbImage.create({
        createdAt: new Date(),
        relatedId: req.body.id,
        image: req.body.dataImage,
        isDeleted: false,
        relatedTable: "tbProductCategory",
      });
    }
  }

  res.json({
    status: true,
    message: "success",
    tbProductCategory: dataUpdate,
  });
});

router.delete("/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  req.body.isDeleted = true;
  tbProductCategory.update(req.body, { where: { id: id } });
  res.json({ status: true, message: "success", tbProductCategory: null });
});

//#region line liff
router.get(
  "/getProductCategory",
  // , validateLineToken
  async (req, res) => {
    let status = true;
    let msg = "";
    let ProductCategory = [];

    try {
      const _tbProductCategory = await tbProductCategory.findAll({
        attributes: ["id", "categoryName"],
        where: { isDeleted: false },
      });

      _tbProductCategory.map((e, i) => {
        ProductCategory.push({
          id: Encrypt.EncodeKey(e.id),
          name: e.categoryName,
        });
      });
    } catch (e) {
      status = false;
      msg = e.message;
    }
    res.json({
      status: status,
      msg: msg,
      tbProductCategory: ProductCategory,
    });
  }
);
//#endregion line liff

module.exports = router;
