const express = require("express");
const router = express.Router();
const {
  tbRedemptionConditionsHD,
  tbRedemptionCoupon,
  tbRedemptionProduct,
  tbImage,
  tbCouponCode,
  tbMember,
  tbMemberReward,
  tbOrderHD,
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
    order: [["createdAt", "DESC"]],
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
          const [results, data] = await db.sequelize
            .query(`select count(tbmemberrewards.id) as countValue from tbmemberrewards 
              inner join tbcouponcodes on  tbcouponcodes.id = tbmemberrewards.TableHDId 
              inner join tbredemptioncoupons on tbredemptioncoupons.id = tbcouponcodes.redemptionCouponId 
              where tbmemberrewards.rewardType='Coupon' and tbredemptioncoupons.id = ${Coupon[i].dataValues.id}`);
          Coupon[i].dataValues["rewardType"] = "1";
          if (data.length > 0)
            Coupon[i].dataValues["couponUse"] = data[0].countValue;
          listGame.push(Coupon[i].dataValues);
        }

        for (var i = 0; i < Product.length; i++) {
          const [results, data] = await db.sequelize
            .query(`  select count(tbmemberrewards.id) as countValue from tbmemberrewards 
          inner join tbredemptionproducts on tbredemptionproducts.id = tbmemberrewards.TableHDId 
          where rewardType = 'Product' and tbredemptionproducts.id = ${Product[i].dataValues.id}`);

          Product[i].dataValues["rewardType"] = "2";
          if (data.length > 0)
            Product[i].dataValues["productUse"] = data[0].countValue;
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
          try {
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
          } catch (e) {
            console.log(e);
          }
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
      // addBy: req.body.addBy,
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
          req.body.listGame[i].id = coupon.dataValues.id;
          // console.log(coupon.dataValues.couponCount);
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
                        console.log(result);
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            });
        } else if (req.body.listGame[i].rewardType === "2") {
          product = await tbRedemptionProduct.create(req.body.listGame[i]);
          req.body.listGame[i].id = product.dataValues.id;
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
            req.body.listGame[i].id = coupon.dataValues.id;
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
                          console.log(result);
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }
              });
          }
        } else if (req.body.listGame[i].rewardType === "2") {
          if (req.body.listGame[i].id) {
            product = await tbRedemptionProduct.update(req.body.listGame[i], {
              where: { id: req.body.listGame[i].id },
            });
          } else {
            product = await tbRedemptionProduct.create(req.body.listGame[i]);
            // coupon = await tbRedemptionCoupon.create(req.body.listGame[i]);
            req.body.listGame[i].id = product.dataValues.id;
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
        // console.log(req.body.coupon.expiredDate);
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
  let status = true;
  let isDelete = true;
  let msg = "success";
  try {
    const _tbRedemptionProduct = await tbRedemptionProduct.findOne({
      attributes: ["id"],
      where: { redemptionConditionsHDId: redemptionId, isDeleted: false },
    });

    if (_tbRedemptionProduct != null) {
      const _tbMemberReward = await tbMemberReward.findOne({
        attributes: ["id"],
        where: { TableHDID: _tbRedemptionProduct.id },
      });
      if (_tbMemberReward != null) {
        isDelete = false;
        status = false;
        msg = "isUse";
      }
    }
    if (isDelete) {
      const _tbRedemptionCoupon = await tbRedemptionCoupon.findOne({
        attributes: ["id"],
        where: { redemptionConditionsHDId: redemptionId, isDeleted: false },
      });
      if (_tbRedemptionCoupon != null) {
        const _tbCouponCode = await tbCouponCode.findOne({
          attributes: ["id"],
          where: { redemptionCouponId: _tbRedemptionCoupon.id, isUse: true },
        });
        if (_tbCouponCode != null) {
          isDelete = false;
          status = false;
          msg = "isUse";
        }
      }
    }
    if (isDelete) {
      // delete
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
    }
  } catch (err) {
    status = false;
    msg = err.message;
  }

  res.json({
    status: status,
    message: msg,
    tbRedemptionConditionsHD: null,
  });
});

router.post("/redemptionsGame", validateToken, async (req, res) => {
  if (req.body.rewardType === "1") {
    tbRedemptionCoupon.update(
      { isDeleted: true },
      { where: { id: req.body.rewardId } }
    );
    const coupon = await tbRedemptionCoupon.findOne({
      where: { id: req.body.rewardId },
    });

    tbRedemptionConditionsHD.update(
      {
        totalReward: parseInt(req.body.totalReward) - parseInt(req.body.count),
      },
      { where: { id: coupon.dataValues.redemptionConditionsHDId } }
    );
  } else {
    tbRedemptionProduct.update(
      { isDeleted: true },
      { where: { id: req.body.rewardId } }
    );

    const product = await tbRedemptionProduct.findOne({
      where: { id: req.body.rewardId },
    });

    tbRedemptionConditionsHD.update(
      {
        totalReward: parseInt(req.body.totalReward) - parseInt(req.body.count),
      },
      { where: { id: product.dataValues.redemptionConditionsHDId } }
    );
  }

  res.json({
    status: true,
    message: "success",
  });
});

router.post("/CloneCoupon", async (req, res) => {
  const couponId = req.body.couponId;
  const qry = `INSERT INTO mbk_database.tbcouponcodes SELECT * FROM mbk_temp.tbcouponcodes where mbk_temp.tbcouponcodes.id not in (select id from mbk_database.tbcouponcodes) and mbk_temp.tbcouponcodes.redemptionCouponId in (select id from mbk_database.tbredemptioncoupons t) `;
  db.sequelize
    .query(qry, null, { raw: true })
    .then((result) => {
      const deleteqry = `DELETE FROM mbk_temp.tbcouponcodes WHERE mbk_temp.tbcouponcodes.redemptionCouponId IN (select redemptionCouponId from mbk_database.tbcouponcodes)`;
      db.sequelize
        .query(deleteqry, null, { raw: true })
        .then((result) => {
          const updateCount =
            `update mbk_database.tbredemptioncoupons set couponCount = (select count(id) from mbk_database.tbcouponcodes where  mbk_database.tbcouponcodes.redemptionCouponId = ` +
            couponId +
            ` ) WHERE mbk_database.tbredemptioncoupons.id = ` +
            couponId;
          db.sequelize
            .query(updateCount, null, { raw: true })
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
    })
    .catch((error) => {
      res.json({ error: "error insert" });
    });
});

//#region line liff

router.get("/gettbcouponcodes", validateLineToken, async (req, res) => {
  let status = true;
  let msg = "";
  let RedemptionCoupon = [];
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    const Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });

    if (Member) {
      let _tbMemberReward = await tbMemberReward.findAll({
        where: {
          isDeleted: !1,
          rewardType: "Coupon",
          memberId: Member.id,
          isUsedCoupon: !1,
        },
        attributes: ["id", "TableHDId"],
      });
      if (_tbMemberReward) {
        await (async () => {
          let memberRewardIdlist = [];
          _tbMemberReward.map((e) => {
            memberRewardIdlist.push(e.id);
          });
          const _rewardusedList = await tbOrderHD.findAll({
            attributes: ["memberRewardId"],
            where: {
              memberRewardId: memberRewardIdlist,
            },
          });
          if (_rewardusedList) {
            _rewardusedList.map((e) => {
              const memberRewardId = e.memberRewardId;
              _tbMemberReward = _tbMemberReward.filter((f) => {
                if (f.id !== memberRewardId) {
                  return f;
                }
              });
            });
          }
        })();

        await (async () => {
          let TableHDIdList = [];
          _tbMemberReward.map((e) => {
            TableHDIdList.push(e.TableHDId);
          });
          tbRedemptionCoupon.hasMany(tbCouponCode, { foreignKey: "id" });
          tbCouponCode.belongsTo(tbRedemptionCoupon, {
            foreignKey: "redemptionCouponId",
          });
          tbRedemptionCoupon.belongsTo(tbRedemptionConditionsHD, {
            foreignKey: "redemptionConditionsHDId",
          });
          let _tbCouponCode = await tbCouponCode.findAll({
            where: { isDeleted: false, id: TableHDIdList },
            attributes: ["id", "redemptionCouponId"],
            include: [
              {
                model: tbRedemptionCoupon,
                attributes: [
                  "id",
                  "discount",
                  "discountType",
                  "isNotExpired",
                  "startDate",
                  "expireDate",
                  "couponName",
                ],
                where: {
                  isDeleted: !1,
                  id: { [Op.col]: "tbCouponCode.redemptionCouponId" },
                  isCancel: false,
                  // couponType: false,
                },
                include: [
                  {
                    model: tbRedemptionConditionsHD,
                    attributes: ["id", "couponType"],
                    where: { couponType: false, isDeleted: false },
                    required: true,
                  },
                ],
              },
            ],
          });
          if (_tbCouponCode) {
            for (var i = 0; i < _tbCouponCode.length; i++) {
              let e = _tbCouponCode[i];
              // _tbCouponCode.map(e=>{
              if (
                e &&
                (e.tbRedemptionCoupon.expireDate
                  ? e.tbRedemptionCoupon.expireDate.setHours(0, 0, 0, 0)
                  : new Date().setHours(0, 0, 0, 0)) >=
                  new Date().setHours(0, 0, 0, 0)
              ) {
                // const _tbImage = await tbImage.findOne({
                //   attributes: ["image"],
                //   where: {
                //     isDeleted: false,
                //     relatedId: Encrypt.DecodeKey(e.tbRedemptionCoupon.id),
                //     relatedTable: "tbRedemptionCoupon",
                //   },
                // });
                e.dataValues.image = null;
                // _tbImage.image;
                RedemptionCoupon.push({
                  id: e.dataValues.id,
                  image: e.dataValues.image,
                  imageId: e.tbRedemptionCoupon.id,
                  couponName: e.tbRedemptionCoupon.couponName,
                  discount: e.tbRedemptionCoupon.discount,
                  isNotExpired: e.tbRedemptionCoupon.isNotExpired,
                  discountType: e.tbRedemptionCoupon.discountType,
                  expiredDate:
                    e.tbRedemptionCoupon.expireDate == null
                      ? "-"
                      : e.tbRedemptionCoupon.expireDate,
                });
              }
            }
          }
        })();

        // for (var i = 0; i < _tbMemberReward.length; i++) {
        //   //ตรวจสอบถูกนำไปใช้ใน tbOrderHD
        //   // const _tbOrderHD = await tbOrderHD.count({
        //   //   attributes: ["id"],
        //   //   where: {
        //   //     memberRewardId: _tbMemberReward[i].id,
        //   //   },
        //   // });

        //   // if (_tbOrderHD == 0) {
        //   tbRedemptionCoupon.hasMany(tbCouponCode, { foreignKey: "id" });
        //   tbCouponCode.belongsTo(tbRedemptionCoupon, {
        //     foreignKey: "redemptionCouponId",
        //   });
        //   tbRedemptionCoupon.belongsTo(tbRedemptionConditionsHD, {
        //     foreignKey: "redemptionConditionsHDId",
        //   });
        //   let _tbCouponCode = await tbCouponCode.findOne({
        //     where: { isDeleted: false, id: _tbMemberReward[i].TableHDId },
        //     attributes: ["id", "redemptionCouponId"],
        //     include: [
        //       {
        //         model: tbRedemptionCoupon,
        //         attributes: [
        //           "id",
        //           "discount",
        //           "discountType",
        //           "isNotExpired",
        //           "startDate",
        //           "expireDate",
        //           "couponName",
        //         ],
        //         where: {
        //           isDeleted: !1,
        //           id: { [Op.col]: "tbCouponCode.redemptionCouponId" },
        //           isCancel: false,
        //           // couponType: false,
        //         },
        //         include: [
        //           {
        //             model: tbRedemptionConditionsHD,
        //             attributes: ["id", "couponType"],
        //             where: { couponType: false, isDeleted: false },
        //             required: true,
        //           },
        //         ],
        //       },
        //     ],
        //   });
        //   if (
        //     _tbCouponCode &&
        //     (_tbCouponCode.tbRedemptionCoupon.expireDate
        //       ? _tbCouponCode.tbRedemptionCoupon.expireDate.setHours(0, 0, 0, 0)
        //       : new Date().setHours(0, 0, 0, 0)) >=
        //       new Date().setHours(0, 0, 0, 0)
        //   ) {
        //     const _tbImage = await tbImage.findOne({
        //       attributes: ["image"],
        //       where: {
        //         isDeleted: false,
        //         relatedId: Encrypt.DecodeKey(
        //           _tbCouponCode.tbRedemptionCoupon.id
        //         ),
        //         relatedTable: "tbRedemptionCoupon",
        //       },
        //     });
        //     _tbCouponCode.dataValues.image = _tbImage.image;
        //     RedemptionCoupon.push({
        //       id: _tbCouponCode.dataValues.id,
        //       image: _tbCouponCode.dataValues.image,
        //       couponName: _tbCouponCode.tbRedemptionCoupon.couponName,
        //       discount: _tbCouponCode.tbRedemptionCoupon.discount,
        //       isNotExpired: _tbCouponCode.tbRedemptionCoupon.isNotExpired,
        //       discountType: _tbCouponCode.tbRedemptionCoupon.discountType,
        //       expiredDate:
        //         _tbCouponCode.tbRedemptionCoupon.expireDate == null
        //           ? "-"
        //           : _tbCouponCode.tbRedemptionCoupon.expireDate,
        //     });
        //   }
        //   // }
        // }
        console.log();
      }
    }
  } catch (e) {
    res.json({
      status: false,
      message: e.message,
      RedemptionCoupon: RedemptionCoupon,
    });
  }

  return res.json({
    status: status,
    msg: msg,
    tbredemptioncoupons: RedemptionCoupon,
  });
});
//#endregion line liff

module.exports = router;
