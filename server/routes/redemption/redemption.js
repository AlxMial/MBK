const express = require("express");
const router = express.Router();
const {
  tbRedemptionConditionsHD,
  tbRedemptionCoupon,
  tbRedemptionProduct,
  tbImage,
  tbCouponCode,
} = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const ValidateEncrypt = require("../../services/crypto");
const axiosInstance = require("../../services/axiosUpload");
const Op = Sequelize.Op;
const Encrypt = new ValidateEncrypt();
const db = require("../../models");

router.get("/", validateToken, async (req, res) => {
  const listRedemption = await tbRedemptionConditionsHD.findAll({
    where: { isDeleted: false },
  });
  if (listRedemption.length > 0) {
    Encrypt.encryptValueIdArray(listRedemption);
    res.json({
      status: true,
      message: "success",
      tbRedemptionConditionsHD: listRedemption,
    });
  } else
    res.json({
      status: false,
      message: "not found user",
      tbRedemptionConditionsHD: null,
    });
});

router.get("/byId/:id", validateToken, async (req, res) => {
  if (req.params.id !== "undefined") {
    const id = Encrypt.DecodeKey(req.params.id);
    const listRedemption = await tbRedemptionConditionsHD.findOne({
      where: { id: id },
    });
    let Image = {};
    let listCoupon = [];
    let listProduct = [];
    let listGame = [];
    if (listRedemption) {
      if (listRedemption.dataValues.redemptionType == "2") {
        Coupon = await tbRedemptionCoupon.findAll({
          where: {
            isDeleted: false,
            redemptionConditionsHdId: listRedemption.dataValues.id,
          },
          attributes: {
            include: [
              [
                Sequelize.literal(`(
                  SELECT image
                  FROM tbimages
                  WHERE relatedId = tbRedemptionCoupon.id and relatedTable = 'tbRedemptionCoupon'
              )`),
                "pictureCoupon",
              ],
            ],
          },
        });

        Product = await tbRedemptionProduct.findAll({
          where: {
            isDeleted: false,
            redemptionConditionsHdId: listRedemption.dataValues.id,
          },
          attributes: {
            include: [
              [
                Sequelize.literal(`(
                  SELECT image
                  FROM tbimages
                  WHERE relatedId = tbRedemptionProduct.id and relatedTable = 'tbRedemptionProduct'
              )`),
                "pictureProduct",
              ],
            ],
          },
        });

        for (var i = 0; i < Coupon.length; i++) {
          Coupon[i].dataValues["rewardType"] = "1";
          listGame.push(Coupon[i].dataValues);
        }

        for (var i = 0; i < Product.length; i++) {
          Product[i].dataValues["rewardType"] = "2";
          listGame.push(Product[i].dataValues);
        }
      } else {
        listCoupon = await tbRedemptionCoupon.findOne({
          where: { redemptionConditionsHdId: id },
        });
        listProduct = await tbRedemptionProduct.findOne({
          where: { redemptionConditionsHdId: id },
        });

        if (listCoupon) {
          Image = await tbImage.findOne({
            where: {
              relatedId: listCoupon.dataValues.id,
              relatedTable: "tbRedemptionCoupon",
            },
          });
        } else if (listProduct) {
          Image = await tbImage.findOne({
            where: {
              relatedId: listProduct.dataValues.id,
              relatedTable: "tbRedemptionProduct",
            },
          });
        }
      }
    }

    if (listRedemption) {
      Encrypt.encryptValueId(listRedemption);
      res.json({
        status: true,
        message: "success",
        tbRedemptionConditionsHD: listRedemption,
        tbRedemptionCoupon: listCoupon,
        tbRedemptionProduct: listProduct,
        listGame: listGame,
        tbImage: Image,
      });
    } else {
      res.json({
        status: false,
        message: "not found",
        tbRedemptionConditionsHD: null,
        tbRedemptionCoupon: null,
        tbRedemptionProduct: null,
        listGame: null,
        tbImage: null,
      });
    }
  } else {
    res.json({
      status: true,
      message: "success",
      tbRedemptionConditionsHD: null,
      tbRedemptionCoupon: null,
      tbRedemptionProduct: null,
      listGame: null,
      tbImage: null,
    });
  }
});

router.post("/", validateToken, async (req, res) => {
  let RedemptionConditionsHD;
  RedemptionConditionsHD = await tbRedemptionConditionsHD.findOne({
    where: {
      redemptionName: req.body.redemptionName,
      isDeleted: false,
    },
  });

  if (!RedemptionConditionsHD) {
    const redemption = await tbRedemptionConditionsHD.create(req.body);
    if (redemption) {
      let coupon = null;
      let product = null;
      if (redemption.rewardType === "1") {
        req.body.coupon.expiredDate = req.body.coupon.isNotExpired
          ? null
          : req.body.coupon.expiredDate;
        req.body.coupon["redemptionConditionsHDId"] = redemption.dataValues.id;
        coupon = await tbRedemptionCoupon.create(req.body.coupon);

        if (coupon && req.body.coupon.couponCount !== "") {
          const generateCode = await axiosInstance
            .post("api/coupon/generateCoupon", coupon)
            .then(async (resGenerate) => {
              if (resGenerate.data.status) {
                const qry = `INSERT INTO mbk_database.tbcouponcodes SELECT * FROM mbk_temp.tbcouponcodes where mbk_temp.tbcouponcodes.id not in (select id from mbk_database.tbcouponcodes) and mbk_temp.tbcouponcodes.redemptionCouponId in (select id from mbk_database.tbredemptioncoupons t) `;
                db.sequelize
                  .query(qry, null, { raw: true })
                  .then((result) => {
                    const deleteqry = `DELETE FROM mbk_temp.tbcouponcodes WHERE mbk_temp.tbcouponcodes.redemptionCouponId IN (select redemptionCouponId from mbk_database.tbcouponcodes)`;
                    db.sequelize
                      .query(deleteqry, null, { raw: true })
                      .then((result) => {
                        Encrypt.encryptValueId(redemption);
                        res.json({
                          status: true,
                          isError: false,
                          isRedemptionName: false,
                          message: "success",
                          tbRedemptionConditionsHD: redemption,
                          tbRedemptionCoupon: coupon,
                          tbRedemptionProduct: product,
                        });
                      })
                      .catch((error) => {
                        res.json({
                          status: false,
                          isError: true,
                          isRedemptionName: false,
                          message: "unsuccess",
                          tbRedemptionConditionsHD: null,
                          tbRedemptionCoupon: null,
                          tbRedemptionProduct: null,
                        });
                      });
                  })
                  .catch((error) => {
                    res.json({
                      status: false,
                      isError: true,
                      isRedemptionName: false,
                      message: "unsuccess",
                      tbRedemptionConditionsHD: null,
                      tbRedemptionCoupon: null,
                      tbRedemptionProduct: null,
                    });
                  });
              }
            });
        } else {
          Encrypt.encryptValueId(redemption);
          res.json({
            status: true,
            isError: false,
            isRedemptionName: false,
            message: "success",
            tbRedemptionConditionsHD: redemption,
            tbRedemptionCoupon: coupon,
            tbRedemptionProduct: product,
          });
        }
      } else if (redemption.rewardType === "2") {
        req.body.product.rewardCount = req.body.product.isNoLimitReward
          ? null
          : req.body.product.rewardCount;
        req.body.product["redemptionConditionsHDId"] = redemption.dataValues.id;
        product = await tbRedemptionProduct.create(req.body.product);
        Encrypt.encryptValueId(redemption);
        res.json({
          status: true,
          isError: false,
          isRedemptionName: false,
          message: "success",
          tbRedemptionConditionsHD: redemption,
          tbRedemptionCoupon: coupon,
          tbRedemptionProduct: product,
        });
      }
    } else {
      res.json({
        status: false,
        isError: true,
        isRedemptionName: false,
        message: "unsuccess",
        tbRedemptionConditionsHD: null,
        tbRedemptionCoupon: null,
        tbRedemptionProduct: null,
      });
    }
  } else {
    if (RedemptionConditionsHD.redemptionName === req.body.redemptionName) {
      res.json({
        status: false,
        isError: false,
        isRedemptionName: true,
        message: "unsuccess",
        tbRedemptionConditionsHD: null,
        tbRedemptionCoupon: null,
        tbRedemptionProduct: null,
      });
    }
  }
});

const UpdateImage = async (listGame) => {
  const Image = await tbImage.findOne({
    where: {
      relatedId: listGame.id,
      relatedTable:
        listGame.rewardType === "1"
          ? "tbRedemptionCoupon"
          : "tbRedemptionProduct",
    },
  });

  if (Image) {
    Image.image =
      listGame.rewardType === "1"
        ? listGame.pictureCoupon
        : listGame.pictureProduct;
    const Update = await tbImage.update(Image.dataValues, {
      where: {
        relatedId: listGame.id,
        relatedTable:
          listGame.rewardType === "1"
            ? "tbRedemptionCoupon"
            : "tbRedemptionProduct",
      },
    });
  } else {
    let Value = {
      image:
        listGame.rewardType === "1"
          ? listGame.pictureCoupon
          : listGame.pictureProduct,
      relatedId: listGame.id,
      relatedTable:
        listGame.rewardType === "1"
          ? "tbRedemptionCoupon"
          : "tbRedemptionProduct",
      isDeleted: 0,
      addBy: req.body.addBy,
    };
    const Insert = await tbImage.create(Value);
  }
};

router.post("/game", validateToken, async (req, res) => {
  let RedemptionConditionsHD;
  RedemptionConditionsHD = await tbRedemptionConditionsHD.findOne({
    where: {
      redemptionName: req.body.redemptionName,
      isDeleted: false,
    },
  });

  if (!RedemptionConditionsHD) {
    const redemption = await tbRedemptionConditionsHD.create(req.body);
    if (redemption) {
      let coupon = null;
      let product = null;

      for (var i = 0; i < req.body.listGame.length; i++) {
        req.body.listGame[i]["redemptionConditionsHDId"] =
          redemption.dataValues.id;
        if (req.body.listGame[i].rewardType === "1") {
          coupon = await tbRedemptionCoupon.create(req.body.listGame[i]);
        } else if (req.body.listGame[i].rewardType === "2") {
          product = await tbRedemptionProduct.create(req.body.listGame[i]);
        }
        UpdateImage(req.body.listGame[i]);
      }

      Encrypt.encryptValueId(redemption);
      res.json({
        status: true,
        isError: false,
        isRedemptionName: false,
        message: "success",
        tbRedemptionConditionsHD: redemption,
        tbRedemptionCoupon: coupon,
        tbRedemptionProduct: product,
      });
    } else {
      res.json({
        status: false,
        isError: true,
        isRedemptionName: false,
        message: "unsuccess",
        tbRedemptionConditionsHD: null,
        tbRedemptionCoupon: null,
        tbRedemptionProduct: null,
      });
    }
  } else {
    if (RedemptionConditionsHD.redemptionName === req.body.redemptionName) {
      res.json({
        status: false,
        isError: false,
        isRedemptionName: true,
        message: "unsuccess",
        tbRedemptionConditionsHD: null,
        tbRedemptionCoupon: null,
        tbRedemptionProduct: null,
      });
    }
  }
});

router.put("/game", validateToken, async (req, res) => {
  req.body.id = Encrypt.DecodeKey(req.body.id);
  let RedemptionConditionsHD;
  RedemptionConditionsHD = await tbRedemptionConditionsHD.findOne({
    where: {
      redemptionName: req.body.redemptionName,
      isDeleted: false,
      id: {
        [Op.ne]: req.body.id,
      },
    },
  });

  if (!RedemptionConditionsHD) {
    const redemption = await tbRedemptionConditionsHD.update(req.body, {
      where: { id: req.body.id },
    });
    if (redemption) {
      let coupon = null;
      let product = null;

      for (var i = 0; i < req.body.listGame.length; i++) {
        req.body.listGame[i]["redemptionConditionsHDId"] = req.body.id;
        if (req.body.listGame[i].rewardType === "1") {
          if (req.body.listGame[i].id) {
            coupon = await tbRedemptionCoupon.update(req.body.listGame[i], {
              where: { id: req.body.listGame[i].id },
            });
          } else {
            coupon = await tbRedemptionCoupon.create(req.body.listGame[i]);
          }
        } else if (req.body.listGame[i].rewardType === "2") {
          if (req.body.listGame[i].id) {
            product = await tbRedemptionProduct.update(req.body.listGame[i], {
              where: { id: req.body.listGame[i].id },
            });
          } else {
            product = await tbRedemptionProduct.create(req.body.listGame[i]);
          }
        }
        UpdateImage(req.body.listGame[i]);
        // const Image = await tbImage.findOne({
        //   where: {
        //     relatedId: req.body.listGame[i].id,
        //     relatedTable:
        //       req.body.listGame[i].rewardType === "1"
        //         ? "tbRedemptionCoupon"
        //         : "tbRedemptionProduct",
        //   },
        // });

        // if (Image) {
        //   Image.image =
        //     req.body.listGame[i].rewardType === "1"
        //       ? req.body.listGame[i].pictureCoupon
        //       : req.body.listGame[i].pictureProduct;
        //   const Update = await tbImage.update(Image.dataValues, {
        //     where: {
        //       relatedId: req.body.listGame[i].id,
        //       relatedTable:
        //         req.body.listGame[i].rewardType === "1"
        //           ? "tbRedemptionCoupon"
        //           : "tbRedemptionProduct",
        //     },
        //   });
        // } else {
        //   let Value = {
        //     image:
        //       req.body.listGame[i].rewardType === "1"
        //         ? req.body.listGame[i].pictureCoupon
        //         : req.body.listGame[i].pictureProduct,
        //     relatedId: req.body.listGame[i].id,
        //     relatedTable:
        //       req.body.listGame[i].rewardType === "1"
        //         ? "tbRedemptionCoupon"
        //         : "tbRedemptionProduct",
        //     isDeleted: 0,
        //     addBy: req.body.addBy,
        //   };
        //   const Insert = await tbImage.create(Value);
        // }
      }

      res.json({
        status: true,
        isError: false,
        isRedemptionName: false,
        message: "success",
        tbRedemptionConditionsHD: redemption,
        tbRedemptionCoupon: coupon,
        tbRedemptionProduct: product,
      });
    } else {
      res.json({
        status: false,
        isError: true,
        isRedemptionName: false,
        message: "unsuccess",
        tbRedemptionConditionsHD: null,
        tbRedemptionCoupon: null,
        tbRedemptionProduct: null,
      });
    }
  } else {
    if (RedemptionConditionsHD.redemptionName === req.body.redemptionName) {
      res.json({
        status: false,
        isError: false,
        isRedemptionName: true,
        message: "unsuccess",
        tbRedemptionConditionsHD: null,
        tbRedemptionCoupon: null,
        tbRedemptionProduct: null,
      });
    }
  }
});

router.put("/", validateToken, async (req, res) => {
  req.body.id = Encrypt.DecodeKey(req.body.id);
  let RedemptionConditionsHD;
  RedemptionConditionsHD = await tbRedemptionConditionsHD.findOne({
    where: {
      redemptionName: req.body.redemptionName,
      isDeleted: false,
      id: {
        [Op.ne]: req.body.id,
      },
    },
  });

  if (!RedemptionConditionsHD) {
    const redemption = await tbRedemptionConditionsHD.update(req.body, {
      where: { id: req.body.id },
    });
    if (redemption) {
      let coupon = null;
      let product = null;
      if (req.body.rewardType === "1") {
        req.body.coupon.expiredDate = req.body.coupon.isNotExpired
          ? null
          : req.body.coupon.expiredDate;
        coupon = await tbRedemptionCoupon.update(req.body.coupon, {
          where: { id: req.body.coupon.id },
        });
      } else if (req.body.rewardType === "2") {
        req.body.product.rewardCount = req.body.product.isNoLimitReward
          ? null
          : req.body.product.rewardCount;
        product = await tbRedemptionProduct.update(req.body.product, {
          where: { id: req.body.product.id },
        });
      }
      res.json({
        status: true,
        isError: false,
        isRedemptionName: false,
        message: "success",
        tbRedemptionConditionsHD: redemption,
        tbRedemptionCoupon: coupon,
        tbRedemptionProduct: product,
      });
    } else {
      res.json({
        status: false,
        isError: true,
        isRedemptionName: false,
        message: "unsuccess",
        tbRedemptionConditionsHD: null,
        tbRedemptionCoupon: null,
        tbRedemptionProduct: null,
      });
    }
  } else {
    if (RedemptionConditionsHD.redemptionName === req.body.redemptionName) {
      res.json({
        status: false,
        isError: false,
        isRedemptionName: true,
        message: "unsuccess",
        tbRedemptionConditionsHD: null,
        tbRedemptionCoupon: null,
        tbRedemptionProduct: null,
      });
    }
  }
});

router.delete("/:redemptionId", validateToken, async (req, res) => {
  const redemptionId = Encrypt.DecodeKey(req.params.redemptionId);
  tbRedemptionProduct.update(
    { isDeleted: true },
    { where: { redemptionConditionsHDId: redemptionId } }
  );
  tbRedemptionCoupon.update(
    { isDeleted: true },
    { where: { redemptionConditionsHDId: redemptionId } }
  );
  tbRedemptionConditionsHD.update(
    { isDeleted: true },
    { where: { id: redemptionId } }
  );
  res.json({
    status: true,
    message: "success",
    tbRedemptionConditionsHD: null,
  });
});

router.post("/redemptionsGame", validateToken, async (req, res) => {
  if (req.body.rewardType === "1")
    tbRedemptionCoupon.update(
      { isDeleted: true },
      { where: { id: req.body.rewardId } }
    );
  else
    tbRedemptionProduct.update(
      { isDeleted: true },
      { where: { id: req.body.rewardId } }
    );
  res.json({
    status: true,
    message: "success",
  });
});

router.post("/CloneCoupon", async (req, res) => {
  const qry = `INSERT INTO mbk_database.tbcouponcodes SELECT * FROM mbk_temp.tbcouponcodes where mbk_temp.tbcouponcodes.id not in (select id from mbk_database.tbcouponcodes) and mbk_temp.tbcouponcodes.redemptionCouponId in (select id from mbk_database.tbredemptioncoupons t) `;
  db.sequelize
    .query(qry, null, { raw: true })
    .then((result) => {
      const deleteqry = `DELETE FROM mbk_temp.tbcouponcodes WHERE mbk_temp.tbcouponcodes.redemptionCouponId IN (select redemptionCouponId from mbk_database.tbcouponcodes)`;
      db.sequelize
        .query(deleteqry, null, { raw: true })
        .then((result) => {
          res.json({ message: "success" });
        })
        .catch((error) => {
          res.json({ error: "error insert" });
        });
    })
    .catch((error) => {
      res.json({ error: "error insert" });
    });
});

//#region line liff

router.get("/gettbcouponcodes", validateLineToken, async (req, res) => {

  tbRedemptionCoupon.hasMany(tbCouponCode, { foreignKey: "id" });
  tbCouponCode.belongsTo(tbRedemptionCoupon, { foreignKey: "redemptionCouponId" });

  try {
    let item = []
    let item2 = []
    const _tbRedemptionCoupon = await tbCouponCode.findAll({
      where: { isDeleted: !1, isUse: !1 },
      attributes: ['redemptionCouponId'],
      include: [
        {
          model: tbRedemptionCoupon,
          attributes: ['id', 'discount', "isNotExpired", "startDate", "expiredDate", "couponName"],
          where: {
            isDeleted: !1,
            id: { [Op.col]: "tbCouponCode.redemptionCouponId" },
          },
        },
      ],
    });

    if (_tbRedemptionCoupon.length > 0) {
      // let RedemptionCoupon = []
      _tbRedemptionCoupon.map((e, i) => {
        let dup = []
        item.filter(f => {
          if (f.id == Encrypt.EncodeKey(e.tbRedemptionCoupon.id)) { dup.push(e) }
        })
        if (dup.length == 0) {

          item.push({
            id: Encrypt.EncodeKey(e.tbRedemptionCoupon.id),
            discount: e.tbRedemptionCoupon.discount,
            isNotExpired: e.tbRedemptionCoupon.isNotExpired,
            startDate: e.tbRedemptionCoupon.startDate,
            expiredDate: e.tbRedemptionCoupon.expiredDate,
            couponName: e.tbRedemptionCoupon.couponName
          })
        }
      })

      for (var i = 0; i < item.length; i++) {
        let sdate = new Date(new Date(item[i].startDate).toISOString().split("T")[0])
        let edate = new Date(new Date(item[i].expiredDate).toISOString().split("T")[0])
        let today = new Date(new Date().toISOString().split("T")[0])
        if ((today >= sdate && today <= edate) || (today >= sdate && item[i].isNotExpired)) {

          const _tbImage = await tbImage.findAll({
            attributes: ['image'],
            where: {
              isDeleted: false,
              relatedId: Encrypt.DecodeKey(item[i].id),
              relatedTable: "tbRedemptionCoupon",
            },
          });
          let data = item[i]
          if (_tbImage.length > 0) {
            data.image = _tbImage[0].image
          }

          item2.push(item[i])
        }
      }

      res.json({
        status: true,
        message: "success",
        tbRedemptionCoupon: item2,
      });
    } else
      res.json({
        status: false,
        message: "not found user",
        tbredemptioncoupons: null,
      });
  } catch (e) {
    res.json({
      status: false,
      message: e.message,
      tbredemptioncoupons: null,
    });
  }
});
//#endregion line liff

module.exports = router;
