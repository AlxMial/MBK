const express = require("express");
const router = express.Router();
const { tbStock, tbBanner, tbImage } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();
const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
  let status = true;
  let msg = "";
  let data;
  const _tbStock = await tbStock.findOne({
    where: { productName: req.body.productName },
  });
  if (!_tbStock) {
    data = await tbStock.create(req.body);
  } else {
    status = false;
    msg = "ซื่อสินค้าซ้ำ";
  }

  res.json({
    status: status,
    message: msg,
    tbStock: data,
  });
});

router.get("/", validateToken, async (req, res) => {
  const data = await tbStock.findAll({
    where: { isDeleted: false },
    attributes: {
      include: [
        [
          Sequelize.literal(`(
                        select count(dt.id) buy from tborderdts dt
                        where isDeleted = 0 
                        and orderId 
                            in (select hd.id from tborderhds hd 
                            where hd.isDeleted = 0 
                            and hd.paymentStatus = 'Done'
                            and not exists(select 1 from tbcancelorders where isDeleted = 0
                                            and cancelStatus = 'wait'))
                )`),
          "buy",
        ],
        [
          Sequelize.literal(`(
                        select categoryName from tbproductcategories t
                        where isDeleted = 0 and id = tbStock.productCategoryId
                )`),
          "categoryName",
        ],
      ],
    },
    order: [["createdAt", "DESC"]],
  });
  res.json({
    status: true,
    message: "success",
    tbStock: data,
  });
});

router.get("/byId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const data = await tbStock.findOne({ where: { id: id } });
  res.json({
    status: true,
    message: "success",
    tbStock: data,
  });
});

router.put("/", validateToken, async (req, res) => {
  let status = true;
  let msg = "";
  let dataUpdate;
  const _tbStock = await tbStock.findOne({
    where: { productName: req.body.productName, id: { [Op.not]: req.body.id } },
  });
  if (!_tbStock) {
    const data = await tbStock.findOne({
      where: {
        isDeleted: false,
        id: {
          [Op.ne]: req.body.id,
        },
      },
    });

    dataUpdate = await tbStock.update(req.body, {
      where: { id: req.body.id },
    });
  } else {
    status = false;
    msg = "ซื่อสินค้าซ้ำ";
  }
  res.json({
    status: status,
    message: msg,
    tbStock: dataUpdate,
  });
});

router.delete("/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  req.body.isDeleted = true;
  tbStock.update(req.body, { where: { id: id } });
  res.json({ status: true, message: "success", tbStock: null });
});

//#region line liff

router.post(
  "/getStock",
  // , validateLineToken // ดูได้โดยไม่ต้อง login
  async (req, res) => {
    let id = req.body.id;
    let status = true;
    let _tbStock = [];
    let msg = null;
    let data;
    try {
      tbStock.hasMany(tbImage, { foreignKey: "id" });
      tbImage.belongsTo(tbStock, { foreignKey: "relatedId" });

      if (Encrypt.IsNullOrEmpty(id)) {
        data = await tbStock.findAll({
          where: { isDeleted: false, isInactive: true },
        });
      } else {
        let Id = [];
        id.filter((e) => {
          Id.push(Encrypt.DecodeKey(e));
        });
        data = await tbStock.findAll({
          where: { isDeleted: false, isInactive: true, id: Id },
        });
      }
      if (data != null) {
        data.filter((e) => {
          _tbStock.push({
            id: Encrypt.EncodeKey(e.id),
            productName: e.productName,
            price: e.price,
            discount: e.discount,
            discountType: e.discountType,
            productCount: e.productCount,
            weight: e.weight,
            description: e.description,
            descriptionPromotion: e.descriptionPromotion,
            isFlashSale: e.isFlashSale,
            startDateCampaign: e.startDateCampaign,
            endDateCampaign: e.endDateCampaign,
            startTimeCampaign: e.startTimeCampaign,
            endTimeCampaign: e.endTimeCampaign,
            isBestSeller: e.isBestSeller,
            productCategoryId: Encrypt.EncodeKey(e.productCategoryId),
            percent: e.percent,
            priceDiscount: e.price - e.discount,
            salePercent: e.salePercent,
            saleDiscount: e.saleDiscount,
          });
        });
      }
    } catch (e) {
      status = false;
      msg = e.message;
    }

    res.json({
      status: status,
      message: "success",
      msg: msg,
      tbStock: _tbStock,
    });
  }
);
// รูป Banner
router.get(
  "/getImgBanner",
  // , validateLineToken
  async (req, res) => {
    let status = !0,
      msg,
      data = [],
      func = Encrypt;

    try {
      tbBanner.hasMany(tbImage, { foreignKey: "id" });
      tbImage.belongsTo(tbBanner, { foreignKey: "relatedId" });
      const _tbBanner = await tbImage.findAll({
        where: { isDeleted: !1, relatedTable: { [Op.like]: "%banner%" } },
        include: [
          {
            model: tbBanner,
            attributes: ["id", "typeLink", "productCategoryId", "stockId"],
            where: {
              isDeleted: !1,
              // level: { [Op.col]: "tbImage.relatedTable" },
            },
          },
        ],
      });

      for await (const i of _tbBanner.map((j) => {
        return j;
      })) {
        let e = i;
        data.push({
          id: func.EncodeKey(e.id),
          imageName: e.imageName,
          relatedId: func.EncodeKey(e.relatedId),
          relatedTable: e.relatedTable,
          typeLink: e.tbBanner.dataValues.typeLink,
          productCategoryId: func.EncodeKey(e.tbBanner.dataValues.productCategoryId),
          stockId: func.EncodeKey(e.tbBanner.dataValues.stockId),
          image: e.image,
        });
      }
    } catch (e) {
      status = !1;
      msg = e.message;
    }
    res.json({
      status: status,
      msg: msg,
      ImgBanner: data,
    });
  }
);
router.post(
  "/getImg",
  // , validateLineToken
  async (req, res) => {
    let status = true;
    let msg = null;
    let data = [];
    let id = req.body.id;
    let relatedTable = req.body.relatedTable;
    try {
      const _tbImage = await tbImage.findAll({
        where: {
          isDeleted: false,
          relatedId: Encrypt.DecodeKey(id),
          relatedTable: relatedTable,
        },
        order: [["relatedTable", "ASC"]],
      });
      _tbImage.filter((e) => {
        data.push({
          id: Encrypt.EncodeKey(e.id),
          imageName: e.imageName,
          image: e.image,
        });
      });
    } catch (e) {
      status = false;
      msg = e.message;
    }
    res.json({
      status: status,
      msg: msg,
      data: data,
    });
  }
);

router.get("/getImg/:relatedTable/:id", async (req, res) => {
  const id = req.params.id;
  const relatedTable = req.params.relatedTable;
  const _tbImage = await tbImage.findOne({
    where: {
      isDeleted: !1,
      relatedId: Encrypt.DecodeKey(id),
      relatedTable: relatedTable,
    },
  });
  const imgBuffer = Buffer.from(_tbImage.dataValues.image, "base64").toString(
    "utf8"
  );
  var im = Buffer(_tbImage.dataValues.image.toString("binary"), "base64");
  var base64Data = imgBuffer.replace(/^data:image\/png;base64,/, "");

  var img = Buffer.from(base64Data, "base64");
  res.writeHead(200, {
    "Content-Type": imgBuffer.split(";")[0].split(":")[1],
    "Content-Length": img.length,
  });
  res.end(img);
});

//#endregion line liff
module.exports = router;
