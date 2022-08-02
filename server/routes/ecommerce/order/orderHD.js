const express = require("express");
const moment = require("moment");
const router = express.Router();
const bcrypt = require("bcrypt");
const { tb2c2p } = require("../../../models");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../../middlewares/LineMiddleware");
const ValidateEncrypt = require("../../../services/crypto");
const Encrypt = new ValidateEncrypt();
const jwt = require("jsonwebtoken");
const axios = require("axios").default;
const config = require("../../../services/config.line");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    dialect: config.database.dialect,
  }
);
const db = require("../../../models");
const {
  tbOrderHD,
  tbMember,
  tbOrderDT,
  tbStock,
  tbLogistic,
  tbPromotionDelivery,
  tbPayment,
  tbRedemptionCoupon,
  tbCouponCode,
  tbCancelOrder,
  tbReturnOrder,
  tbCartHD,
  tbCartDT,
  tbImage,
  tbMemberReward,
  tbPromotionStore,
  tbPointEcommerce,
  tbProductCategory,
  tbMemberPoint,
  tbOtherAddress,
  tbLogisticCategory,
} = require("../../../models");
const e = require("express");
const { parseWithoutProcessing } = require("handlebars");
// const tbReturnOrder = require("../../../models/tbReturnOrder");

const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
  const data = await tbOrderHD.create(req.body);
  res.json({
    status: true,
    message: "success",
    tbOrderHD: data,
  });
});

router.get("/", validateToken, async (req, res) => {
  let status = true;
  let msg = "success";
  let orderHD = [];
  try {
    tbOrderHD.hasMany(tbCancelOrder, {
      foreignKey: "orderId",
    });
    tbOrderHD.hasMany(tbReturnOrder, {
      foreignKey: "orderId",
    });

    tbOrderHD.belongsTo(tbOtherAddress, {
      foreignKey: "otherAddressId",
    });

    tbOrderHD.belongsTo(tbMember, {
      foreignKey: "memberId",
    });

    tbOrderHD.belongsTo(tbLogistic, {
      foreignKey: "logisticId",
    });

    tbLogistic.hasMany(tbLogisticCategory, {
      foreignKey: "logisticCategoryId",
    });

    const data = await tbOrderHD.findAll({
      where: { isDeleted: false },
      include: [
        {
          model: tbCancelOrder,
          where: {
            isDeleted: false,
          },
          required: false,
        },
        {
          model: tbReturnOrder,
          where: {
            isDeleted: false,
          },
          required: false,
        },
        {
          model: tbOtherAddress,
          where: {
            isDeleted: false,
          },
          required: false,
        },
        {
          model: tbMember,
          where: {
            isDeleted: false,
          },
          required: false,
        },
        {
          model: tbLogistic,
          where: {
            isDeleted: false,
          },

          required: false,
        },
      ],
      order: [["orderNumber", "DESC"]],
    });
    if (data) {
      data.map((e, i) => {
        let hd = e.dataValues;
        //เป็นการโอนและมีการแนบสลิปแล้ว
        if (hd.paymentType == 1 && hd.paymentStatus >= 2) {
          hd.isImage = true; //มี image
          hd.imageName = "ไฟล์แนบ";
        } else {
          hd.isImage = false;
        }
        if (hd.tbCancelOrders.length > 0) {
          hd.tbCancelOrder = hd.tbCancelOrders[0];
        }
        if (hd.tbReturnOrders.length > 0) {
          hd.tbReturnOrder = hd.tbReturnOrders[0];
        }
        if (e.dataValues.tbOtherAddress) {
          hd.firstName = Encrypt.DecodeKey(
            e.dataValues.tbOtherAddress.firstName
          );
          hd.lastName = Encrypt.DecodeKey(e.dataValues.tbOtherAddress.lastName);
          hd.address = Encrypt.DecodeKey(e.dataValues.tbOtherAddress.address);
          hd.subDistrict = e.dataValues.tbOtherAddress.subDistrict;
          hd.district = e.dataValues.tbOtherAddress.district;
          hd.province = e.dataValues.tbOtherAddress.province;
          hd.postcode = e.dataValues.tbOtherAddress.postcode;
        } else {
          hd.firstName = Encrypt.DecodeKey(hd.firstName);
          hd.lastName = Encrypt.DecodeKey(hd.lastName);
          hd.address = Encrypt.DecodeKey(hd.address);
        }

        if (e.dataValues.tbMember) {
          hd.email = Encrypt.DecodeKey(e.dataValues.tbMember.email);
        }

        // hd.tbImages = null
        hd.tbCancelOrders = null;
        hd.tbReturnOrders = null;
        orderHD.push(hd);
      });
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }
  res.json({
    status: status,
    message: msg,
    tbOrderHD: orderHD,
  });
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;

  tbOrderHD.belongsTo(tbMember, {
    foreignKey: "memberId",
  });

  const data = await tbOrderHD.findOne({
    where: { id: id },
    include: [
      {
        model: tbMember,
        attributes: ["email"],
        where: {
          isDeleted: false,
        },
        required: false,
      },
    ],
  });
  data.dataValues["email"] = Encrypt.DecodeKey(data.dataValues.tbMember.email);
  data.dataValues.firstName = Encrypt.DecodeKey(data.dataValues.firstName);
  data.dataValues.lastName = Encrypt.DecodeKey(data.dataValues.lastName);

  res.json({
    status: true,
    message: "success",
    tbOrderHD: data,
  });
});

router.put("/", validateToken, async (req, res) => {
  const data = await tbOrderHD.findOne({
    where: {
      isDeleted: false,
      id: req.body.id,
    },
  });

  let hd = data.dataValues;
  //รอตรวจสอบ
  //จ่ายเงินสำเร็จ
  let addPoint = false;
  if (req.body.paymentStatus == 3 || hd.paymentStatus == 3) {
    // addPoint = (req.body.prepareDate == null && req.body.paymentType == 1) ? true : false;
    // สถานะขนส่ง
    if (req.body.transportStatus == 1) {
      if (req.body.prepareDate == null) {
        req.body.prepareDate = new Date();
      }
    } else if (req.body.transportStatus == 2) {
      if (req.body.prepareDate == null) {
        req.body.prepareDate = new Date();
      }
      req.body.inTransitDate = new Date();
    } else if (req.body.transportStatus == 3) {
      if (req.body.prepareDate == null) {
        req.body.prepareDate = new Date();
      }
      if (req.body.inTransitDate == null) {
        req.body.inTransitDate = new Date();
      }
      if (req.body.doneDate == null) {
        req.body.doneDate = new Date();
        addPoint = true;
      }
    }
  }

  try {
    req.body.firstName = Encrypt.EncodeKey(req.body.firstName);
    req.body.lastName = Encrypt.EncodeKey(req.body.lastName);
  } catch {}

  const dataUpdate = await tbOrderHD.update(req.body, {
    where: { id: req.body.id },
  });
  if (addPoint) {
    let Member = await tbMember.findOne({
      attributes: ["id", "memberPoint"],
      where: { id: data.memberId },
    });
    const _tbMemberPoint = await tbMemberPoint.create({
      campaignType: 2,
      point: data.points,
      redeemDate: new Date(),
      expireDate: new Date(new Date().getFullYear() + 2, 11, 31),
      tbMemberId: Member.id,
      isDeleted: false,
    });
    const dataMember = await tbMember.update(
      { memberPoint: Member.memberPoint + data.points },
      { where: { id: Member.id } }
    );
  }
  res.json({
    status: true,
    message: "success",
    tbOrderHD: dataUpdate,
  });
});

router.delete("/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  req.body.isDeleted = true;
  tbOrderHD.update(req.body, { where: { id: id } });
  res.json({ status: true, message: "success", tbOrderHD: null });
});

//#region line liff
//#region ตรวจสอบ FlashSale
const isFlashSale = (e) => {
  let isFlash = false;
  let startDateCampaign = new Date(
    new Date(e.startDateCampaign).toISOString().split("T")[0].replace(/-/g, "/")
  );
  let endDateCampaign = new Date(
    new Date(e.endDateCampaign).toISOString().split("T")[0].replace(/-/g, "/")
  );
  let _today = new Date();
  let today = new Date(
    _today.getFullYear() +
      "/" +
      (_today.getMonth() + 1) +
      "/" +
      _today.getDate()
  );
  if (today >= startDateCampaign && today <= endDateCampaign) {
    let startTimeCampaign = new Date(
      new Date().toISOString().split("T")[0].replace(/-/g, "/") +
        " " +
        e.startTimeCampaign
    );
    let endTimeCampaign = new Date(
      new Date().toISOString().split("T")[0].replace(/-/g, "/") +
        " " +
        e.endTimeCampaign
    );
    today = new Date();
    // อยู่ในเวลา
    if (today > startTimeCampaign && today < endTimeCampaign) {
      isFlash = true;
    }
  }

  return isFlash;
};

//#endregion ตรวจสอบ FlashSale
//ข้อมูลสินค้า
const getorderDT = async (DT) => {
  let orderDT = [];
  let status = true;
  let msg = "";
  let total = 0; //ราคารวม
  let point = 0; //แต้ม
  let stockNumber = 0;
  try {
    for (var i = 0; i < DT.length; i++) {
      //ดึงราคาใหม่ และ จำนวนใหม่
      let _tbStock = await tbStock.findOne({
        attributes: [
          "isFlashSale",
          "price",
          "discount",
          "discountType",
          "productName",
          "productCount",
          "salePercent",
          "saleDiscount",
          "startDateCampaign",
          "endDateCampaign",
          "startTimeCampaign",
          "endTimeCampaign",
        ],
        where: {
          id: Encrypt.DecodeKey(DT[i].stockId || DT[i].id),
          productCount: {
            [Op.gte]: DT[i].amount,
          },
        },
      });
      let discount = _tbStock.discount;
      if (_tbStock) {
        if (_tbStock.isFlashSale) {
          //อยู่ในเงือนไข
          if (isFlashSale(_tbStock)) {
            discount = _tbStock.saleDiscount;
          }
        }

        total = total + (_tbStock.price - discount) * DT[i].amount;
        stockNumber += DT[i].amount;
        orderDT.push({
          stockId: Encrypt.DecodeKey(DT[i].stockId || DT[i].id),
          amount: DT[i].amount,
          price: _tbStock.price,
          discount: discount,
          discountType: _tbStock.discountType,
          isFlashSale: _tbStock.isFlashSale ? isFlashSale(_tbStock) : false,
          isFree: false,
        });

        //แต้มสะสม
        //type : จำนวนสิน
        let _tbPointEcommerce = await tbPointEcommerce.findAll({
          attributes: ["type", "purchaseAmount", "productAmount", "points"],
          where: {
            stockId: Encrypt.DecodeKey(DT[i].stockId || DT[i].id),
            startDate: { [Op.lte]: new Date() },
            endDate: { [Op.gte]: new Date() },
            isDeleted: false,
            type: 2,
          },
        });
        if (_tbPointEcommerce) {
          _tbPointEcommerce.map((e, i) => {
            if (e.productAmount <= DT[i].amount) {
              let conut = parseInt(DT[i].amount / e.productAmount);
              point += conut * e.points;
            }
          });
        }
      } else {
        status = false;
        msg = "Stock empty !";
      }
    }

    //คะแนนจากยอดซื้อ
    if (total > 0) {
      let _tbPointEcommerce = await tbPointEcommerce.findAll({
        attributes: ["type", "purchaseAmount", "productAmount", "points"],
        where: {
          startDate: { [Op.lte]: new Date() },
          endDate: { [Op.gte]: new Date() },
          isDeleted: false,
          type: 1,
          purchaseAmount: { [Op.lte]: total },
        },
      });
      if (_tbPointEcommerce) {
        _tbPointEcommerce.map((e, i) => {
          let conut = parseInt(total / e.purchaseAmount);
          point += conut * e.points;
        });
      }
    }
  } catch (e) {
    msg = e.message;
  }
  return {
    status: status,
    msg: msg,
    orderDT: orderDT,
    total: total,
    point: point,
    stockNumber: stockNumber,
  };
};
//คำนวนโปรร้าน
const getStorePromotion = async (total) => {
  let DiscountStorePromotion = 0;
  let type = "";
  let msg = "";
  let status = true;
  let orderDT = [];
  try {
    tbPromotionStore.belongsTo(tbStock, {
      foreignKey: "stockId",
    });
    const _tbPromotionStore = await tbPromotionStore.findAll({
      attributes: [
        "id",
        "buy",
        "condition",
        "discount",
        "percentDiscount",
        "percentDiscountAmount",
        "stockId",
        "campaignName",
      ],
      where: {
        isDeleted: false,
        isInactive: true,
      },
      include: [
        {
          model: tbStock,
          attributes: ["id", "productCount"],
          where: { productCount: { [Op.gt]: 0 } },
        },
      ],
    });
    if (_tbPromotionStore) {
      let prodiscountList = _tbPromotionStore.find(
        (e) => (e.condition == 1 || e.condition == 2) && e.buy <= total
      );

      if (prodiscountList != null) {
        type = "discount";
        let pro = _tbPromotionStore.filter((e) => {
          if ((e.condition == 1 || e.condition == 2) && e.buy <= total) {
            return e;
          }
        });

        pro.map((e, i) => {
          let discount = 0;
          if (e.condition == 1) {
            discount = e.discount;
          } else {
            discount = (e.percentDiscount / 100) * total;
            if (discount > e.percentDiscountAmount) {
              discount = e.percentDiscountAmount;
            }
          }
          if (discount > DiscountStorePromotion) {
            DiscountStorePromotion = discount;
          }
        });
      } else {
        //แถมสินค้า

        let productList = _tbPromotionStore.filter(
          (e) => e.condition == 3 && e.buy <= total
        );
        if (productList && productList.length > 0) {
          let highestbuy = productList.sort(function (a, b) {
            const buyA = parseFloat(a.buy); // ignore upper and lowercase
            const buyB = parseFloat(b.buy); // ignore upper and lowercase
            if (buyA > buyB) {
              return -1;
            }
            if (buyA < buyB) {
              return 1;
            }
            return 0;
          })[0];
          type = "product";
          let _tbStock = await tbStock.findOne({
            attributes: [
              "isFlashSale",
              "price",
              "discount",
              "discountType",
              "productCount",
            ],
            where: {
              id: highestbuy.stockId,
            },
          });
          if (_tbStock) {
            if (_tbStock.productCount > 0) {
              orderDT.push({
                stockId: highestbuy.stockId,
                amount: 1,
                price: 0,
                discount: 0,
                discountType: 0,
                isFlashSale: false,
                isFree: true,
              });
            }
          }
        }
      }
    }
  } catch (e) {
    msg = e.message;
    status = false;
  }

  return {
    status: status,
    msg: msg,
    type: type,
    DiscountStorePromotion: DiscountStorePromotion,
    orderDT: orderDT,
  };
};
//คำนวนค้าส่ง
const getDelivery = async (logisticId, total) => {
  let status = true;
  let msg = "";
  let deliveryCost = 0; //ค่าส่ง
  let discountDelivery = 0; //โปรค่าส่ง

  try {
    const _tbLogistic = await tbLogistic.findOne({
      attributes: ["id", "deliveryCost"],
      where: { id: logisticId, isShow: true, isDeleted: false },
    });
    if (_tbLogistic) {
      //มีข้อมูลในระบบ
      deliveryCost = _tbLogistic.deliveryCost;
      //มีค่าส่ง
      if (deliveryCost > 0) {
        //ตรวสอบโปรส่ง
        const _tbPromotionDelivery = await tbPromotionDelivery.findOne({
          attributes: ["buy", "deliveryCost"],
          where: {
            isInactive: true,
            isDeleted: false,
          },
        });
        if (_tbPromotionDelivery) {
          //มีโปร
          if (total >= _tbPromotionDelivery.buy) {
            //เข้าเงื่อนไขโปร
            // deliveryCost = 0; //ค่าส่ง
            discountDelivery = _tbPromotionDelivery.deliveryCost; //โปรค่าส่ง
          } else {
            // deliveryCost = _deliveryCost; //ค่าส่ง
            // discountDelivery = 0; //โปรค่าส่ง
          }
        } else {
          // deliveryCost = _deliveryCost; //ค่าส่ง
          // discountDelivery = 0; //โปรค่าส่ง
        }
      } else {
      }
    } else {
      //ไม่มีข้อมูลการจัดส่ง
      status = false;
      msg = "logistic empty !";
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }
  return {
    status: status,
    msg: msg,
    deliveryCost: deliveryCost,
    discountDelivery: discountDelivery,
  };
};
//คูปอง
const getDiscountCoupon = async (usecouponid, total) => {
  let status = true;
  let msg = "";
  let DiscountCoupon = 0; // ส่วนลดCoupon
  let memberRewardId = null;
  try {
    if (usecouponid != null) {
      const _tbMemberReward = await tbMemberReward.findOne({
        attributes: ["id", "TableHDId"],
        where: { TableHDId: Encrypt.DecodeKey(usecouponid) },
      });
      //มีคูปอง

      if (_tbMemberReward) {
        memberRewardId = _tbMemberReward.id;

        const _tbCouponCode = await tbCouponCode.findOne({
          attributes: ["redemptionCouponId"],
          where: { id: _tbMemberReward.TableHDId },
        });

        const _tbRedemptionCoupon = await tbRedemptionCoupon.findOne({
          attributes: ["discount", "discountType"],
          where: { id: _tbCouponCode.redemptionCouponId },
        });

        if (_tbRedemptionCoupon) {
          if (_tbRedemptionCoupon.discountType === "1") {
            DiscountCoupon = _tbRedemptionCoupon.discount;
          } else {
            DiscountCoupon = (_tbRedemptionCoupon.discount / 100) * total;
          }
        }
      } else {
        status = false;
        msg = "คูปองไม่สามมารถใช้ได้";
      }
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }
  return {
    status: status,
    msg: msg,
    DiscountCoupon: DiscountCoupon,
    memberRewardId: memberRewardId,
  };
};
const getAddress = async (addressId, memberID) => {
  let status = true;
  let msg = "";
  let address;
  try {
    let attributes = [
      "firstName",
      "lastName",
      "phone",
      "address",
      "subDistrict",
      "district",
      "province",
      "country",
      "postcode",
    ];
    if (addressId == null) {
      //ใช้ที่อยู่ member
      let Member = await tbMember.findOne({
        attributes: attributes,
        where: { id: memberID },
      });
      if (Member) {
        address = Member.dataValues;
      }
    } else {
      //ใช้ที่อยู่ที่เลิก

      let Member = await tbOtherAddress.findOne({
        attributes: attributes,
        where: {
          memberID: memberID,
          id: addressId,
        },
      });
      if (Member) {
        address = Member.dataValues;
      }
    }
  } catch (e) {
    status = false;
    msg = "Error Address !";
  }
  return { status: status, msg: msg, address: address };
};
//เพิ่ม Order เท่านั่น
router.post("/doSaveOrder", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let orderId;
  let { orderhd, orderdt, cart } = req.body;
  let orderDT = [];
  let url2c2p;
  try {
    const memberId = Encrypt.DecodeKey(req.user.id);
    const uid = Encrypt.DecodeKey(req.user.uid);
    //#region ถอดรหัส
    orderhd.memberId = memberId;
    orderhd.orderDate = new Date();
    if (orderhd.paymentId != null) {
      orderhd.paymentId = Encrypt.DecodeKey(orderhd.paymentId);
    }

    orderhd.logisticId = Encrypt.DecodeKey(orderhd.logisticId);
    orderhd.otherAddressId =
      Encrypt.DecodeKey(orderhd.isAddress) == "memberId"
        ? null
        : Encrypt.DecodeKey(orderhd.isAddress);
    //#endregion ถอดรหัส

    //#region ข้อมูลสินค้า
    let total = 0; //ราคารวม
    let point = 0;
    let sumprice = 0;
    let stockNumber = 0;
    let _getorderDT = await getorderDT(orderdt);
    if (_getorderDT.status) {
      total = _getorderDT.total;
      console.log(_getorderDT.total);
      sumprice = _getorderDT.total;
      point = _getorderDT.point;
      orderDT = _getorderDT.orderDT;
      stockNumber = _getorderDT.stockNumber;
    } else {
      status = _getorderDT.status;
      msg = _getorderDT.msg;
    }
    //#endregion ข้อมูลสินค้า

    //#region โปรร้าน
    let DiscountStorePromotion = 0;
    if (status) {
      let _getStorePromotion = await getStorePromotion(total);
      if (_getStorePromotion.status) {
        if (_getStorePromotion.type == "discount") {
          DiscountStorePromotion = _getStorePromotion.DiscountStorePromotion;
          total = total - DiscountStorePromotion;
        } else if (_getStorePromotion.type == "product") {
          let _orderDT = _getStorePromotion.orderDT;
          _orderDT.map((e, i) => {
            orderDT.push(e);
          });
        }
      } else {
        status = _getStorePromotion.status;
        msg = _getStorePromotion.msg;
      }
    }
    //#endregion โปรร้าน

    //#region ข้อมูลวิธีการจัดส่ง
    let deliveryCost = 0; //ค่าส่ง
    let discountDelivery = 0; //โปรค่าส่ง
    if (status) {
      let _getDelivery = await getDelivery(orderhd.logisticId, total);
      if (_getDelivery.status) {
        deliveryCost = _getDelivery.deliveryCost; //ค่าส่ง
        discountDelivery = _getDelivery.discountDelivery; //โปรค่าส่ง
        //  total = total + deliveryCost + discountDelivery
      } else {
        status = _getDelivery.status;
        msg = _getDelivery.msg;
      }
    }
    //#endregion ข้อมูลวิธีการจัดส่ง

    //#region ส่วนลด Coupon
    let DiscountCoupon = 0;
    if (status) {
      if (orderhd.usecouponid != null) {
        let _getDiscountCoupon = await getDiscountCoupon(
          orderhd.usecouponid,
          sumprice
        );
        if (_getDiscountCoupon.status) {
          DiscountCoupon = _getDiscountCoupon.DiscountCoupon;
          orderhd.memberRewardId = _getDiscountCoupon.memberRewardId;
        } else {
          status = _getDiscountCoupon.status;
          msg = _getDiscountCoupon.msg;
        }
      }
    }
    total = total - parseFloat(DiscountCoupon);
    total = total < 0 ? 0 : total;
    //บวกค้าส่งทีหลัง
    total =
      total +
      parseFloat(discountDelivery > 0 ? discountDelivery : deliveryCost);
    //#endregion ส่วนลด Coupon

    //#region ที่อยู่ปัจจุบัน
    if (status) {
      let _getAddress = await getAddress(orderhd.otherAddressId, memberId);
      if (_getAddress.status) {
        const address = _getAddress.address;
        orderhd.firstName = address.firstName;
        orderhd.lastName = address.lastName;
        orderhd.phone = address.phone;
        orderhd.address = address.address;
        orderhd.subDistrict = address.subDistrict;
        orderhd.district = address.district;
        orderhd.province = address.province;
        orderhd.country = address.country;
        orderhd.postcode = address.postcode;
      } else {
        status = _getAddress.status;
        msg = _getAddress.msg;
      }
    }
    //#endregion ที่อยู่ปัจจุบัน

    if (status) {
      //#region รันรหัสสินค้า
      const genorderNumber = async () => {
        const today = moment().format("YYYYMM");
        let data = await tbOrderHD.findOne({
          attributes: ["orderNumber"],
          where: {
            orderNumber: {
              [Op.like]: "%" + today + "%",
            },
          },
          order: [["id", "DESC"]],
        });
        if (data) {
          let str = data.dataValues.orderNumber.split("-")[2];
          let num = parseInt(str);
          num = num + 1;
          if (num < 10) {
            num = "000" + num.toString();
          } else if (num < 100) {
            num = "00" + num.toString();
          } else if (num < 1000) {
            num = "0" + num.toString();
          }
          return "LOA-" + today + "-" + num;
        } else {
          return "LOA-" + today + "-0001";
        }
      };
      //#endregion รันรหัสสินค้า
      orderhd.orderNumber = await genorderNumber();
      orderhd.deliveryCost = deliveryCost;
      orderhd.discountDelivery = discountDelivery;
      orderhd.discountCoupon = DiscountCoupon;
      orderhd.discountStorePromotion = DiscountStorePromotion;
      orderhd.points = point;
      orderhd.netTotal = total;
      orderhd.stockNumber = stockNumber;

      let t;
      try {
        t = await db.sequelize.transaction();
        //#region create dt
        const _tbOrderHD = await tbOrderHD.create(orderhd);
        if (_tbOrderHD) {
          orderId = Encrypt.EncodeKey(_tbOrderHD.dataValues.id);
          for (var i = 0; i < orderDT.length; i++) {
            orderDT[i].stockId = orderDT[i].stockId;
            orderDT[i].orderId = _tbOrderHD.dataValues.id;
            const _tbOrderDT = await tbOrderDT.create(orderDT[i]);
            //#region อัพ Stock สินค้า
            if (_tbOrderDT) {
              let _tbStockData = await tbStock.findOne({
                attributes: ["productCount"],
                where: { id: orderDT[i].stockId },
              });
              if (_tbStockData) {
                let _tbStock = await tbStock.update(
                  {
                    productCount: _tbStockData.productCount - orderDT[i].amount,
                  },
                  {
                    where: {
                      id: orderDT[i].stockId,
                    },
                  }
                );
              }
            }
            //#endregion อัพ Stock สินค้า
          }
        }
        //#endregion create dt

        //#region ลบข้อมูลในตระกร้า
        if (cart) {
          const dataDel = await tbCartHD.destroy({ where: { uid: uid } });
        }
        //#endregion ลบข้อมูลในตระกร้า

        //#region 2c2p
        if (orderhd.paymentType == 2) {
          // orderId = 6
          //sandbox
          let secretKey =
            "0181112C92043EA4AD2976E082A3C5F20C1137ED39FFC5D651C7A420BA51AF22";
          //production
          // let secretKey =
          //   "E02D173E018D61DC6A96F8146FEB38F3F1BD6F5350833D671DC89409772E871D";
          let payload = {
            merchantID: "764764000011180",
            invoiceNo: orderId + "-" + orderhd.orderNumber,
            description: "item 1",
            amount: orderhd.netTotal,
            currencyCode: "THB",
            request3DS: "Y",
            paymentChannel: ["CC"],
            backendReturnUrl: "",
            frontendReturnUrl:
              "https://mbk-whale.web.app/line/paymentsucceed/" +
              Encrypt.EncodeKey(orderId + "," + orderhd.orderNumber),
          };

          const token = jwt.sign(payload, secretKey);

          await axios
            .post("https://sandbox-pgw.2c2p.com/payment/4.1/PaymentToken", {
              payload: token,
            })
            .then(async function (res) {
              // handle success
              let payload = res.data.payload;
              const decoded = jwt.decode(payload);
              const _2c2p = await tb2c2p.create({
                payload: payload,
                uid: uid,
                orderId: orderId + "," + orderhd.orderNumber,
              });
              url2c2p = decoded;
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            .then(function () {
              // always executed
            });
        }
        //#endregion 2c2p

        await t.commit();
      } catch (e) {
        if (t) {
          await t.rollback();
        }
        status = false;
        msg = e.message;
      }
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }
  return res.json({
    status: status,
    msg: msg,
    orderId: orderId,
    url: url2c2p,
  });
});
router.post("/doSaveUpdateOrder", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let url2c2p;
  let Member;

  try {
    let { data } = req.body;
    console.log(data);
    const uid = Encrypt.DecodeKey(req.user.uid);
    Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    if (Member) {
      //สินค้า
      let total = 0; //ราคารวม
      let point = 0;
      let sumprice = 0;
      let orderdt = data.orderdt;
      let orderDT = [];
      let stockNumber = 0;
      let _getorderDT = await getorderDT(orderdt);
      if (_getorderDT.status) {
        total = _getorderDT.total;
        sumprice = _getorderDT.total;
        point = _getorderDT.point;
        orderDT = _getorderDT.orderDT;
        stockNumber = _getorderDT.stockNumber;
      } else {
        status = _getorderDT.status;
        msg = _getorderDT.msg;
      }
      console.log(status);
      // โปรร้าน
      let DiscountStorePromotion = 0;
      let _getStorePromotion = await getStorePromotion(total);
      if (_getStorePromotion.status) {
        if (_getStorePromotion.type == "discount") {
          DiscountStorePromotion = _getStorePromotion.DiscountStorePromotion;
          total = total - DiscountStorePromotion;
        } else if (_getStorePromotion.type == "product") {
          let _orderDT = _getStorePromotion.orderDT;
          _orderDT.map((e, i) => {
            orderDT.push(e);
          });
        }
      } else {
        status = _getStorePromotion.status;
        msg = _getStorePromotion.msg;
      }
      console.log(status);
      //ข้อมูลวิธีการจัดส่ง
      let deliveryCost = 0; //ค่าส่ง
      let discountDelivery = 0; //โปรค่าส่ง

      let _getDelivery = await getDelivery(
        Encrypt.DecodeKey(data.logisticId),
        total
      );
      if (_getDelivery.status) {
        deliveryCost = _getDelivery.deliveryCost; //ค่าส่ง
        discountDelivery = _getDelivery.discountDelivery; //โปรค่าส่ง
      } else {
        status = _getDelivery.status;
        msg = _getDelivery.msg;
      }
      // ส่วนลดCoupon
      let DiscountCoupon = 0;
      if (status) {
        if (data.usecouponid != null) {
          let _getDiscountCoupon = await getDiscountCoupon(
            data.usecouponid,
            sumprice
          );
          if (_getDiscountCoupon.status) {
            DiscountCoupon = _getDiscountCoupon.DiscountCoupon;
            data.memberRewardId = _getDiscountCoupon.memberRewardId;
          } else {
            status = _getDiscountCoupon.status;
            msg = _getDiscountCoupon.msg;
          }
        }
      }
      total = total - parseFloat(DiscountCoupon);
      total = total < 0 ? 0 : total;
      //บวกค้าส่งทีหลัง
      total =
        total +
        parseFloat(discountDelivery > 0 ? discountDelivery : deliveryCost);
      //ที่อยู่ปัจจุบัน
      if (status) {
        let _getAddress = await getAddress(data.otherAddressId, Member.id);
        if (_getAddress.status) {
          const address = _getAddress.address;
          data.firstName = address.firstName;
          data.lastName = address.lastName;
          data.phone = address.phone;
          data.address = address.address;
          data.subDistrict = address.subDistrict;
          data.district = address.district;
          data.province = address.province;
          data.country = address.country;
          data.postcode = address.postcodeF;
        } else {
          status = _getAddress.status;
          msg = _getAddress.msg;
        }
      }

      if (status) {
        let t;
        try {
          t = await db.sequelize.transaction();
          const updtbOrderHD = await tbOrderHD.update(
            {
              logisticId: Encrypt.DecodeKey(data.logisticId),
              paymentId:
                data.orderHd.paymentType == 2
                  ? null
                  : Encrypt.DecodeKey(data.paymentId),
              paymentType: data.paymentType,
              otherAddressId:
                Encrypt.DecodeKey(data.isAddress) == "memberId"
                  ? null
                  : Encrypt.DecodeKey(data.isAddress),
              memberRewardId: data.memberRewardId,
              firstName: data.firstName,
              lastName: data.lastName,
              phone: data.phone,
              address: data.firstName,
              subDistrict: data.subDistrict,
              district: data.district,
              province: data.province,
              country: data.country,
              postcode: data.postcode,
              discountStorePromotion: DiscountStorePromotion,
              deliveryCost: deliveryCost,
              discountDelivery: discountDelivery,
              discountCoupon: DiscountCoupon,
              points: point,
              netTotal: total,
              stockNumber: stockNumber,
            },
            { where: { id: Encrypt.DecodeKey(data.id) } }
          );

          const dataDel = await tbOrderDT.destroy({
            where: {
              orderId: Encrypt.DecodeKey(data.id),
            },
          });

          if (orderDT) {
            for (var i = 0; i < orderDT.length; i++) {
              orderDT[i].stockId = orderDT[i].stockId;
              orderDT[i].orderId = Encrypt.DecodeKey(data.id);

              const _tbOrderDT = await tbOrderDT.create(orderDT[i]);
            }
          }
          await t.commit();
        } catch (e) {
          if (t) {
            await t.rollback();
          }
          status = false;
          msg = e.message;
        }
        console.log(data.paymentType);
        //#region 2c2p
        if (data.paymentType == 2) {
          // orderId = 6
          let secretKey =
            "0181112C92043EA4AD2976E082A3C5F20C1137ED39FFC5D651C7A420BA51AF22";
          //production
          // let secretKey =
          //   "E02D173E018D61DC6A96F8146FEB38F3F1BD6F5350833D671DC89409772E871D";
          let payload = {
            merchantID: "764764000011180",
            invoiceNo: data.orderHd.id + "-" + data.orderHd.orderNumber + 1,
            description: "item 1",
            amount: data.orderHd.netTotal,
            currencyCode: "THB",
            request3DS: "Y",
            paymentChannel: ["CC"],
            backendReturnUrl: "",
            frontendReturnUrl:
              "https://mbk-whale.web.app/line/paymentsucceed/" +
              Encrypt.EncodeKey(
                data.orderHd.id + "," + data.orderHd.orderNumber
              ),
          };

          const token = jwt.sign(payload, secretKey);
          // console.log(token);
          // https://sandbox-pgw.2c2p.com/payment/4.1/PaymentToken
          await axios
            .post("https://sandbox-pgw.2c2p.com/payment/4.1/PaymentToken", {
              payload: token,
            })
            .then(async function (res) {
              // handle success
              // console.log(res.data);
              let payload = res.data.payload;
              const decoded = jwt.decode(payload);
              const _2c2p = await tb2c2p.create({
                payload: payload,
                uid: uid,
                orderId: data.orderHd.id + "," + data.orderHd.orderNumber,
              });
              url2c2p = decoded;
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            .then(function () {
              // always executed
            });
        }
        //#endregion 2c2p
      }
    } else {
      status = false;
      msg = "member empty !";
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }
  return res.json({
    status: status,
    msg: msg,
    url: url2c2p,
  });
});

router.post("/doSaveSlip", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let Member;
  try {
    let { data } = req.body;
    const uid = Encrypt.DecodeKey(req.user.uid);
    Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    if (Member) {
      //#region update ข้อมูล
      let t;
      try {
        t = await db.sequelize.transaction();
        //#region อัพโหลดรูป
        const _tbImage = await tbImage.create({
          createdAt: new Date(),
          relatedId: Encrypt.DecodeKey(data.id),
          image: data.Image,
          isDeleted: false,
          relatedTable: "tbOrderHD",
        });
        //#endregion อัพโหลดรูป
        //#region อัพถานะการจ่ายเงิน
        const _tbOrderHDupd = await tbOrderHD.update(
          {
            paymentStatus: 2,
            paymentDate: new Date(),
          },
          {
            where: {
              id: Encrypt.DecodeKey(data.id),
            },
          }
        );
        //#endregion อัพถานะการจ่ายเงิน
        //#region อัพถานะคูปอง
        const _tbOrderHD = await tbOrderHD.findOne({
          attributes: ["memberRewardId", "transportStatus"],
          where: {
            id: Encrypt.DecodeKey(data.id),
          },
        });
        if (_tbOrderHD) {
          if (_tbOrderHD.memberRewardId != null) {
            await tbMemberReward.update(
              {
                isUsedCoupon: true,
                deliverStatus: _tbOrderHD.transportStatus,
              },
              { where: { id: _tbOrderHD.memberRewardId } }
            );
          }
        }
        //#endregion อัพถานะคูปอง
        await t.commit();
      } catch (e) {
        if (t) {
          await t.rollback();
        }
        status = false;
        msg = e.message;
      }
      //#endregion update ข้อมูล
    } else {
      status = false;
      msg = "auth";
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }
  return res.json({
    status: status,
    msg: msg,
  });
});

router.get("/getOrderOver48Hour", async (req, res) => {
  let OrderHDData = [];
  const attributesOrderHD = [
    "id",
    "orderNumber",
    "logisticId",
    "paymentId",
    "stockNumber",
    "couponCodeId",
    "paymentStatus",
    "orderDate",
    "deliveryCost",
    "discountDelivery",
    "discountCoupon",
    "discountStorePromotion",
    "netTotal",
  ];
  const attributesOrderDT = [
    "id",
    "amount",
    "price",
    "discount",
    "discountType",
    "stockId",
    "isFree",
  ];
  try {
    tbOrderHD.hasMany(tbCancelOrder, {
      foreignKey: "orderId",
    });
    tbOrderHD.hasMany(tbCancelOrder, {
      foreignKey: "orderId",
    });
    tbOrderHD.hasMany(tbOrderDT, {
      foreignKey: "orderId",
    });

    //#region รายการที่ต้องชำระ

    ///

    let _OrderHDData = await tbOrderHD.findAll({
      attributes: attributesOrderHD,
      where: {
        isCancel: false,
        IsDeleted: false,
        paymentStatus: [1],
        transportStatus: 1,
        isReturn: false,
      },
      include: [
        {
          attributes: ["id", "orderId"],
          model: tbCancelOrder,
          where: {
            isDeleted: false,
          },
          required: false,
        },
        {
          attributes: attributesOrderDT,
          model: tbOrderDT,
          where: {
            isDeleted: false,
          },
          required: false,
        },
      ],
      order: [["orderNumber", "DESC"]],
    });

    //#region ตรวจสอบ เกิน 48 ชม.ให้ยกเลิก auto
    for (var i = 0; i < _OrderHDData.length; i++) {
      let hd = _OrderHDData[i].dataValues;
      //ไม่มีการยกเลิก
      if (hd.tbCancelOrders.length < 1) {
        if ((new Date() - hd.orderDate) / 1000 / 60 / 60 / 24 > 2) {
          const data = await tbCancelOrder.create({
            orderId: hd.id,
            cancelStatus: 3,
            cancelType: 3,
            cancelDetail: "Auto",
            description: "Auto",
            isDeleted: false,
          });
          const _tbOrderHD = await tbOrderHD.update(
            {
              isCancel: true,
            },
            {
              where: {
                id: hd.id,
              },
            }
          );
        }
      }
    }
    //#endregion ตรวจสอบ เกิน 48 ชม.ให้ยกเลิก auto
    //#endregion รายการที่ต้องชำระ

    res.json({ data: _OrderHDData });
  } catch {
    res.json({ data: "error" });
  }
});

router.post("/getOrderHD", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let { PaymentStatus, TransportStatus, isCancel, isReturn } = req.body;
  let OrderHDData = [];
  let OrderHD = [];
  const attributesOrderHD = [
    "id",
    "orderNumber",
    "logisticId",
    "paymentId",
    "stockNumber",
    "couponCodeId",
    "paymentStatus",
    "orderDate",
    "deliveryCost",
    "discountDelivery",
    "discountCoupon",
    "discountStorePromotion",
    "netTotal",
    "trackNo",
  ];
  const attributesOrderDT = [
    "id",
    "amount",
    "price",
    "discount",
    "discountType",
    "stockId",
    "isFree",
  ];
  try {
    const memberId = Encrypt.DecodeKey(req.user.id);

    tbOrderHD.hasMany(tbCancelOrder, {
      foreignKey: "orderId",
    });
    tbOrderHD.hasMany(tbCancelOrder, {
      foreignKey: "orderId",
    });
    tbOrderHD.hasMany(tbOrderDT, {
      foreignKey: "orderId",
    });

    //#region รายการที่ต้องชำระ
    if (PaymentStatus == 1 && TransportStatus == 1 && !isCancel && !isReturn) {
      ///

      let _OrderHDData = await tbOrderHD.findAll({
        attributes: attributesOrderHD,
        where: {
          isCancel: isCancel,
          IsDeleted: false,
          memberId: memberId,
          paymentStatus: [PaymentStatus, 2],
          transportStatus: TransportStatus,
          isReturn: isReturn,
        },
        include: [
          {
            attributes: ["id", "orderId"],
            model: tbCancelOrder,
            where: {
              isDeleted: false,
            },
            required: false,
          },
          {
            attributes: attributesOrderDT,
            model: tbOrderDT,
            where: {
              isDeleted: false,
            },
            required: false,
          },
        ],
        order: [["orderNumber", "DESC"]],
      });

      //#region ตรวจสอบ เกิน 48 ชม.ให้ยกเลิก auto
      for (var i = 0; i < _OrderHDData.length; i++) {
        let hd = _OrderHDData[i].dataValues;
        //ไม่มีการยกเลิก
        if (hd.tbCancelOrders.length < 1) {
          if ((new Date() - hd.orderDate) / 1000 / 60 / 60 / 24 > 2) {
            // const data = await tbCancelOrder.create({
            //   orderId: hd.id,
            //   cancelStatus: 3,
            //   cancelType: 3,
            //   cancelDetail: "Auto",
            //   description: "Auto",
            //   isDeleted: false,
            // });
            // const _tbOrderHD = await tbOrderHD.update(
            //   {
            //     isCancel: true,
            //   },
            //   {
            //     where: {
            //       id: hd.id,
            //     },
            //   }
            // );
          } else {
            if (hd.paymentStatus == 2) {
              hd.isPaySlip = true;
            } else {
              hd.isPaySlip = false;
            }
            _OrderHDData[i].dataValues = hd;
            OrderHDData.push(_OrderHDData[i]);
          }
        }
      }
      //#endregion ตรวจสอบ เกิน 48 ชม.ให้ยกเลิก auto
      //#endregion รายการที่ต้องชำระ
    } else if (PaymentStatus == 3 && TransportStatus == 1) {
      //#region รายการเตรียมสินค้า
      let _OrderHDData = await tbOrderHD.findAll({
        attributes: attributesOrderHD,
        where: {
          isCancel: false,
          IsDeleted: false,
          memberId: memberId,
          paymentStatus: PaymentStatus,
          transportStatus: TransportStatus,
        },
        include: [
          {
            attributes: ["id", "orderId"],
            model: tbCancelOrder,
            where: {
              isDeleted: false,
            },
            required: false,
          },
          {
            attributes: attributesOrderDT,
            model: tbOrderDT,
            where: {
              isDeleted: false,
            },
            required: false,
          },
        ],
        order: [["orderNumber", "DESC"]],
      });
      if (_OrderHDData) {
        for (var i = 0; i < _OrderHDData.length; i++) {
          let hd = _OrderHDData[i].dataValues;
          if (hd.tbCancelOrders.length < 1) {
            OrderHDData.push(_OrderHDData[i]);
          }
        }
      }
      //#endregion รายการเตรียมสินค้า
    } else if (PaymentStatus == 3 && TransportStatus == 2) {
      //#region รายการที่ต้องได้รับ
      OrderHDData = await tbOrderHD.findAll({
        attributes: attributesOrderHD,
        where: {
          isCancel: false,
          IsDeleted: false,
          memberId: memberId,
          paymentStatus: PaymentStatus,
          transportStatus: TransportStatus,
          isReturn: isReturn,
        },
        include: [
          {
            attributes: attributesOrderDT,
            model: tbOrderDT,
            where: {
              isDeleted: false,
            },
            required: false,
          },
        ],
      });
      //#endregion รายการที่ต้องได้รับ
    } else if (PaymentStatus == 3 && TransportStatus == 3 && !isReturn) {
      //#region รายการสำเร็จ
      let _OrderHDData = await tbOrderHD.findAll({
        attributes: attributesOrderHD,
        where: {
          isCancel: false,
          IsDeleted: false,
          memberId: memberId,
          paymentStatus: PaymentStatus,
          transportStatus: TransportStatus,
          isReturn: isReturn,
        },
        include: [
          {
            attributes: attributesOrderDT,
            model: tbOrderDT,
            where: {
              isDeleted: false,
            },
            required: false,
          },
          {
            attributes: ["id", "orderId", "returnStatus"],
            model: tbReturnOrder,
            where: {
              isDeleted: false,
            },
            required: false,
          },
        ],
      });

      if (_OrderHDData) {
        for (var i = 0; i < _OrderHDData.length; i++) {
          if (_OrderHDData[i].tbReturnOrders < 1) {
            OrderHDData.push(_OrderHDData[i]);
          } else {
            if (_OrderHDData[i].tbReturnOrders[0].returnStatus == 3) {
              _OrderHDData[i].dataValues.returnStatus =
                _OrderHDData[i].tbReturnOrders[0].returnStatus;
              OrderHDData.push(_OrderHDData[i]);
            }
          }
        }
      }
      //#region รายการสำเร็จ
    } else if (
      PaymentStatus == 1 &&
      TransportStatus == 1 &&
      isCancel &&
      !isReturn
    ) {
      //ยกเลิก
      // OrderHDData = []
      const _tbCancelOrder = await tbCancelOrder.findAll({
        attributes: ["id", "orderId", "cancelStatus"],
        where: {
          IsDeleted: false,
        },
      });
      if (_tbCancelOrder) {
        for (var i = 0; i < _tbCancelOrder.length; i++) {
          const _tbOrderHD = await tbOrderHD.findOne({
            attributes: attributesOrderHD,
            where: {
              IsDeleted: false,
              id: _tbCancelOrder[i].orderId,
              memberId: memberId,
            },
            include: [
              {
                attributes: attributesOrderDT,
                model: tbOrderDT,
                where: {
                  isDeleted: false,
                },
                required: false,
              },
            ],
          });
          if (_tbOrderHD != null) {
            _tbOrderHD.dataValues.cancelStatus = _tbCancelOrder[i].cancelStatus;
            OrderHDData.push({ dataValues: _tbOrderHD.dataValues });
          }
        }
      }
    } else if (
      PaymentStatus == 3 &&
      TransportStatus == 3 &&
      !isCancel &&
      isReturn
    ) {
      //คืนสินค้า

      const _tbReturnOrder = await tbReturnOrder.findAll({
        attributes: ["id", "orderId", "returnStatus"],
        where: {
          IsDeleted: false,
          // returnStatus: [1, 2, 3],
        },
      });

      if (_tbReturnOrder) {
        for (var i = 0; i < _tbReturnOrder.length; i++) {
          const _tbOrderHD = await tbOrderHD.findOne({
            attributes: attributesOrderHD,
            where: {
              IsDeleted: false,
              id: _tbReturnOrder[i].orderId,
              memberId: memberId,
            },
            include: [
              {
                attributes: attributesOrderDT,
                model: tbOrderDT,
                where: {
                  isDeleted: false,
                },
                required: false,
              },
            ],
          });
          if (_tbOrderHD != null) {
            _tbOrderHD.dataValues.returnStatus = _tbReturnOrder[i].returnStatus;
            OrderHDData.push({ dataValues: _tbOrderHD.dataValues });
          }
        }
      }
    }

    //มีสินค้า
    if (OrderHDData) {
      for (var i = 0; i < OrderHDData.length; i++) {
        let hd = OrderHDData[i].dataValues;

        hd.dt = [];
        // let amount = 0;
        let price = 0;
        let OrderDTData = [];
        if (hd.tbOrderDTs == null) {
          const _OrderDTData = await tbOrderDT.findAll({
            attributes: attributesOrderDT,
            where: {
              IsDeleted: false,
              orderId: hd.id,
              isFree: false,
            },
          });
          OrderDTData = _OrderDTData;
        } else {
          OrderDTData = hd.tbOrderDTs;
        }

        for (var j = 0; j < OrderDTData.length; j++) {
          let dt = OrderDTData[j].dataValues;
          dt.id = Encrypt.EncodeKey(dt.id);
          const _tbStockData = await tbStock.findOne({
            attributes: [
              "id",
              "productName",
              "discount",
              "discountType",
              "price",
            ],
            where: { id: dt.stockId },
          });
          let _tbStock = _tbStockData.dataValues;
          dt.productName = _tbStock.productName;

          dt.discount =
            parseFloat(dt.discount) > 0
              ? parseFloat(dt.price) - parseFloat(dt.discount)
              : 0;
          dt.price = parseFloat(dt.price);
          hd.dt.push({
            id: Encrypt.EncodeKey(dt.stockId),
            price: dt.price,
            discount: dt.discount,
            productName: dt.productName,
            amount: dt.amount,
            isFree: dt.isFree,
          });

          price += (dt.discount > 0 ? dt.discount : dt.price) * dt.amount;
        }

        price =
          price +
          hd.deliveryCost +
          hd.discountDelivery -
          hd.discountCoupon -
          hd.discountStorePromotion;

        // hd.amount = stockNumber;
        // hd.price = netTotal;
        hd.id = Encrypt.EncodeKey(hd.id);
        console.log("hd", hd);
        OrderHD.push({
          id: hd.id,
          orderNumber: hd.orderNumber,
          amount: hd.stockNumber,
          price: hd.netTotal,
          returnStatus: hd.returnStatus,
          cancelStatus: hd.cancelStatus,
          trackNo: hd.trackNo,
          dt: hd.dt,
          isPaySlip: hd.isPaySlip == null ? null : hd.isPaySlip,
        });
      }
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }

  return res.json({
    status: status,
    msg: msg,
    OrderHD: OrderHD,
  });
});

//หน้าจอ ชำระเงิน
router.post("/getOrder", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let { orderId } = req.body;
  let OrderHDData;
  let OrderHD;
  try {
    const memberId = Encrypt.DecodeKey(req.user.id);
    OrderHDData = await tbOrderHD.findOne({
      attributes: [
        "id",
        "orderNumber",
        "orderDate",
        "logisticId",
        "paymentId",
        "memberRewardId",
        "paymentStatus",
        "netTotal",
      ],
      where: {
        id: Encrypt.DecodeKey(orderId),
        isCancel: false,
        IsDeleted: false,
        memberId: memberId,
        transportStatus: 1,
        isReturn: false,
      },
    });

    if (OrderHDData) {
      let _tbPayment = await tbPayment.findOne({
        attributes: [
          "id",
          "accountName",
          "accountNumber",
          "bankBranchName",
          "bankName",
        ],
        where: {
          isDeleted: false,
          id:
            OrderHDData.dataValues.paymentId === null
              ? 1
              : OrderHDData.dataValues.paymentId,
        },
      });
      if (_tbPayment) {
        _tbPayment.dataValues.id = Encrypt.EncodeKey(_tbPayment.dataValues.id);
      }

      const member = await tbMember.findOne({
        attributes: ["firstName", "lastName", "email"],
        where: { uid: Encrypt.DecodeKey(req.user.uid) },
      });

      OrderHD = {
        id: Encrypt.EncodeKey(OrderHDData.dataValues.id),
        orderNumber: OrderHDData.dataValues.orderNumber,
        email: member ? Encrypt.DecodeKey(member.dataValues.email) : null,
        memberName: member
          ? Encrypt.DecodeKey(member.dataValues.firstName) +
            " " +
            Encrypt.DecodeKey(member.dataValues.lastName)
          : null,
        price: OrderHDData.dataValues.netTotal,
        Payment: _tbPayment,
      };

      if (OrderHDData.dataValues.paymentStatus != 1) {
        status = false;
        msg =
          OrderHDData.dataValues.paymentStatus == 2
            ? "รอการตรวจสอบ"
            : "ชำระเงินเรียบร้อยแล้ว";
      }
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }

  return res.json({
    status: status,
    msg: msg,
    order: OrderHDData,
    OrderHD: OrderHD,
  });
});

router.post("/getOrderHDById", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let Member;
  let { Id, type } = req.body;
  let OrderHDData;
  let OrderHD;
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    const memberId = Encrypt.DecodeKey(req.user.id);
    tbOrderHD.hasMany(tbCancelOrder, {
      foreignKey: "orderId",
    });
    tbOrderHD.hasMany(tbReturnOrder, {
      foreignKey: "orderId",
    });
    tbOrderHD.hasMany(tbOrderDT, {
      foreignKey: "orderId",
    });

    let sumprice = 0;
    OrderHDData = await tbOrderHD.findOne({
      attributes: [
        "id",
        "orderNumber",
        "paymentType",
        "paymentStatus",
        "transportStatus",
        "isCancel",
        "isReturn",
        "logisticId",
        "memberId",
        "paymentId",
        "couponCodeId",
        "orderDate",
        "paymentDate",
        "memberRewardId",
        "otherAddressId",
        "paymentType",
        "stockNumber",
        ["deliveryCost", "hddeliveryCost"],
        "discountDelivery",
        "discountCoupon",
        "discountStorePromotion",
        "points",
        "netTotal",
        "trackNo",
      ],
      where: {
        IsDeleted: false,
        id: Encrypt.DecodeKey(Id),
      },
      include: [
        {
          attributes: [
            "id",
            "cancelStatus",
            "cancelType",
            "cancelDetail",
            "description",
            "createdAt",
            "cancelOtherRemark",
          ],
          model: tbCancelOrder,
          where: {
            isDeleted: false,
          },
          required: false,
        },
        {
          attributes: [
            "id",
            "returnStatus",
            "returnType",
            "returnDetail",
            "description",
            "createdAt",
            "returnOtherRemark",
          ],
          model: tbReturnOrder,
          where: {
            isDeleted: false,
          },
          required: false,
        },
        {
          attributes: [
            "id",
            "amount",
            "price",
            "discount",
            "discountType",
            "stockId",
            "orderId",
            "isFree",
          ],
          model: tbOrderDT,
          where: {
            isDeleted: false,
            // isFree: false
          },
          required: false,
        },
      ],
    });

    if (OrderHDData) {
      let hd = OrderHDData.dataValues;
      hd.dt = [];
      const OrderDTData = hd.tbOrderDTs;
      for (var j = 0; j < OrderDTData.length; j++) {
        let dt = OrderDTData[j].dataValues;
        dt.id = Encrypt.EncodeKey(dt.id);
        const _tbStockData = await tbStock.findOne({
          attributes: [
            "id",
            "productName",
            "discount",
            "discountType",
            "price",
          ],
          where: { id: dt.stockId },
        });
        dt.stockId = Encrypt.EncodeKey(dt.stockId);
        let _tbStock = _tbStockData.dataValues;
        _tbStock.id = Encrypt.EncodeKey(_tbStock.id);
        dt.stock = _tbStock;
        dt.discount = parseFloat(dt.discount);
        dt.discount = dt.discount > 0 ? dt.price - dt.discount : 0;
        sumprice +=
          dt.discount > 0 ? dt.discount * dt.amount : dt.price * dt.amount;
        hd.dt.push({
          id: _tbStock.id,
          productName: _tbStock.productName,
          amount: dt.amount,
          price: dt.price,
          discount: dt.discount,
          isFree: dt.isFree,
        });
      }
      //ค่าจัดส่ง
      let deliveryCost = 0;
      let olddeliveryCost = 0;
      const _tbLogistic = await tbLogistic.findOne({
        attributes: ["id", "deliveryCost"],
        where: { isDeleted: false, isShow: true, id: hd.logisticId },
      });
      if (_tbLogistic) {
        deliveryCost = _tbLogistic.deliveryCost;
        olddeliveryCost = _tbLogistic.deliveryCost;
      }
      //โปรโมชั่นขนส่ง
      const _tbPromotionDelivery = await tbPromotionDelivery.findOne({
        attributes: ["id", "buy", "deliveryCost"],
        where: { isDeleted: false, isInactive: true },
      });
      if (_tbPromotionDelivery) {
        //เข้าเงือนไขส่วนลดโปร
        if (sumprice >= _tbPromotionDelivery.buy) {
          deliveryCost =
            deliveryCost < _tbPromotionDelivery.deliveryCost
              ? 0
              : deliveryCost - _tbPromotionDelivery.deliveryCost;
        }
      }

      // couponCodeId
      if (hd.couponCodeId != null) {
        tbRedemptionCoupon.hasMany(tbCouponCode, { foreignKey: "id" });
        tbCouponCode.belongsTo(tbRedemptionCoupon, {
          foreignKey: "redemptionCouponId",
        });
        const _tbRedemptionCoupon = await tbCouponCode.findOne({
          where: { id: hd.couponCodeId },
          attributes: ["redemptionCouponId"],
          include: [
            {
              model: tbRedemptionCoupon,
              attributes: [
                "id",
                "discount",
                "isNotExpired",
                "startDate",
                "expireDate",
                "couponName",
              ],
              where: {
                isDeleted: !1,
                id: { [Op.col]: "tbCouponCode.redemptionCouponId" },
              },
            },
          ],
        });
        hd.RedemptionCoupon = _tbRedemptionCoupon.dataValues;
      }

      let tbCancelOrderData = null;
      if (OrderHDData.tbCancelOrders.length > 0) {
        let _tbCancelOrder = OrderHDData.tbCancelOrders[0].dataValues;
        _tbCancelOrder.id = Encrypt.EncodeKey(_tbCancelOrder.id);
        tbCancelOrderData = _tbCancelOrder;
      }
      let tbReturnOrderData = null;
      if (OrderHDData.tbReturnOrders.length > 0) {
        let _tbReturnOrder = OrderHDData.tbReturnOrders[0].dataValues;
        _tbReturnOrder.id = Encrypt.EncodeKey(_tbReturnOrder.id);
        tbReturnOrderData = _tbReturnOrder;
      }

      let RedemptionCoupon;
      if (type == "update" && hd.memberRewardId != null) {
        const _tbMemberReward = await tbMemberReward.findOne({
          where: {
            id: hd.memberRewardId,
          },
          attributes: ["TableHDId"],
        });
        if (_tbMemberReward) {
          tbRedemptionCoupon.hasMany(tbCouponCode, { foreignKey: "id" });
          tbCouponCode.belongsTo(tbRedemptionCoupon, {
            foreignKey: "redemptionCouponId",
          });

          let _tbCouponCode = await tbCouponCode.findOne({
            where: { isDeleted: !1, id: _tbMemberReward.TableHDId },
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
                },
              },
            ],
          });

          if (_tbCouponCode) {
            const _tbImage = await tbImage.findOne({
              attributes: ["image"],
              where: {
                isDeleted: false,
                relatedId: Encrypt.DecodeKey(
                  _tbCouponCode.tbRedemptionCoupon.id
                ),
                relatedTable: "tbRedemptionCoupon",
              },
            });
            _tbCouponCode.dataValues.image = _tbImage.image;
            RedemptionCoupon = {
              id: Encrypt.EncodeKey(_tbCouponCode.dataValues.id),
              image: _tbCouponCode.dataValues.image,
              couponName: _tbCouponCode.tbRedemptionCoupon.couponName,
              discountType: _tbCouponCode.tbRedemptionCoupon.discountType,
              discount: _tbCouponCode.tbRedemptionCoupon.discount,
              expireDate:
                _tbCouponCode.tbRedemptionCoupon.expireDate == null
                  ? "-"
                  : _tbCouponCode.tbRedemptionCoupon.expireDate,
            };
          }
        }
      }

      hd.id = Encrypt.EncodeKey(hd.id);
      hd.sumprice = sumprice;
      hd.deliveryCost = deliveryCost;
      hd.total = sumprice + deliveryCost;
      OrderHD = {
        id: hd.id,
        dt: hd.dt,
        trackNo: hd.trackNo,
        sumprice: hd.sumprice,
        deliveryCost: hd.deliveryCost,
        olddeliveryCost: olddeliveryCost,
        total: hd.total,
        orderNumber: hd.orderNumber,
        paymentStatus: hd.paymentStatus,
        transportStatus: hd.transportStatus,
        isCancel: hd.isCancel,
        isReturn: hd.isReturn,
        orderDate: hd.orderDate,
        paymentDate: hd.paymentDate,
        tbCancelOrder: tbCancelOrderData,
        tbReturnOrder: tbReturnOrderData,
        paymentType: hd.paymentType,
        // , paymentType: type == "update" ? hd.paymentType : null
        logisticId: type == "update" ? Encrypt.EncodeKey(hd.logisticId) : null,
        paymentId: type == "update" ? Encrypt.EncodeKey(hd.paymentId) : null,

        memberRewardId:
          type == "update"
            ? hd.memberRewardId == null
              ? null
              : Encrypt.EncodeKey(hd.memberRewardId)
            : null,
        otherAddressId:
          type == "update"
            ? hd.otherAddressId == null
              ? Encrypt.EncodeKey("memberId")
              : Encrypt.EncodeKey(hd.otherAddressId)
            : null,
        coupon:
          type == "update"
            ? hd.memberRewardId == null
              ? null
              : RedemptionCoupon
            : null,

        hddeliveryCost: hd.hddeliveryCost,
        hddiscountDelivery: hd.discountDelivery,
        hddiscountCoupon: hd.discountCoupon,
        hddiscountStorePromotion: hd.discountStorePromotion,
        stockNumber: hd.stockNumber,
        points: hd.points,
        netTotal: hd.netTotal,
      };
      // เช็คการจ่ายเงิน
    }
  } catch (e) {
    status = false;
    msg = e.message;
  }
  return res.json({
    status: status,
    msg: msg,
    // order: OrderHDData,
    OrderHD: OrderHD,
  });
});

router.post("/upd_shopcart", async (req, res) => {
  let status = true;
  let msg;
  // const uid = Encrypt.DecodeKey(req.user.uid);
  const { id, quantity, type, uid } = req.body;
  let shop_orders = [];
  let t;
  try {
    const _tbCartHD = await tbCartHD.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });

    t = await db.sequelize.transaction();
    if (_tbCartHD) {
      //#region ข้อมูลมีตระกร้า
      const _tbCartDT = await tbCartDT.findOne({
        attributes: ["id", "amount"],
        where: {
          strockId: Encrypt.DecodeKey(id),
          carthdId: _tbCartHD.dataValues.id,
        },
      });
      //#endregion ข้อมูลมีตระกร้า
      if (_tbCartDT) {
        //#region ดึงจำนวนคงเหลือ
        const _tbStock = await tbStock.findOne({
          attributes: ["id", "productCount"],
          where: { id: Encrypt.DecodeKey(id) },
        });
        //#endregion ดึงจำนวนคงเหลือ
        if (_tbStock) {
          const addamount = quantity; //จำนวนที่เพิ่ม
          const oldamount = _tbCartDT.amount; // จำนวนในตระกร้า
          const productCount = _tbStock.productCount; // จำนวนสินค้า
          //#region update
          if (type == "add" || type == "plus") {
            if (oldamount + addamount <= productCount) {
              ///upd จำนวน
              const dataupd = await tbCartDT.update(
                {
                  amount: _tbCartDT.amount + quantity,
                },
                { where: { strockId: Encrypt.DecodeKey(id) } }
              );
            } else {
              status = false;
              msg =
                "ไม่สามารถเพิ่มจำนวนสินค้านี้ได้ เนื่องจากคุณเพิ่มสินค้านี้ไว้ในรถเข็นแล้ว " +
                oldamount +
                " ชิ้น";
            }
          } else if (type == "minus") {
            // ในตระกร้ามากกว่า 1
            if (oldamount > 1) {
              const dataupd = await tbCartDT.update(
                {
                  amount: _tbCartDT.amount - quantity,
                },
                { where: { strockId: Encrypt.DecodeKey(id) } }
              );
            } else {
              const dataupd = await tbCartDT.destroy({
                where: {
                  strockId: Encrypt.DecodeKey(id),
                },
              });
            }
          } else if (type == "del") {
            const dataupd = await tbCartDT.destroy({
              where: {
                strockId: Encrypt.DecodeKey(id),
              },
            });
          } else if (type == "quantity") {
            if (quantity <= productCount) {
              ///upd จำนวน

              if (parseInt(productCount) <= 0) {
                const dataupd = await tbCartDT.destroy({
                  where: {
                    id: _tbCartDT.id,
                  },
                });
              } else {
                const dataupd = await tbCartDT.update(
                  {
                    amount: quantity,
                  },
                  { where: { strockId: Encrypt.DecodeKey(id) } }
                );
              }
            } else {
              if (productCount <= 0) {
                const dataupd = await tbCartDT.destroy({
                  where: {
                    strockId: Encrypt.DecodeKey(id),
                  },
                });
              } else {
                const dataupd = await tbCartDT.update(
                  {
                    amount: productCount,
                  },
                  { where: { strockId: Encrypt.DecodeKey(id) } }
                );
              }
            }
          }
          //#endregion update
        } else {
          status = false;
          msg = "!Stock empty";
        }
      } else {
        //ไม่มีให้เพิ่ม
        if (quantity > 0) {
          const addtbCartDT = await tbCartDT.create({
            carthdId: _tbCartHD.id,
            strockId: Encrypt.DecodeKey(id),
            amount: quantity,
          });
        }
      }
    } else {
      //ไม่มีให้เพิ่ม
      const addtbCartHD = await tbCartHD.create({ uid: uid });
      if (addtbCartHD) {
        const addtbCartDT = await tbCartDT.create({
          carthdId: addtbCartHD.id,
          strockId: Encrypt.DecodeKey(id),
          amount: quantity,
        });
      }
    }
    await t.commit();

    const _tbCartHDData = await tbCartHD.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    if (_tbCartHDData) {
      const _tbCartDT = await tbCartDT.findAll({
        attributes: ["strockId", "amount"],
        where: { carthdId: _tbCartHDData.id },
      });
      _tbCartDT.map((e, i) => {
        shop_orders.push({
          id: Encrypt.EncodeKey(e.strockId),
          quantity: e.amount,
        });
      });
    }
  } catch (e) {
    if (t) {
      await t.rollback();
    }
    status = false;
    msg = e.message;
  }
  return res.json({
    status: status,
    msg: msg,
    shop_orders: shop_orders,
  });
});
router.post(
  "/get_shopcart",
  // , validateLineToken
  async (req, res) => {
    let status = true;
    let msg;
    // const uid = Encrypt.DecodeKey(req.user.uid);
    const { uid } = req.body;
    let shop_orders = [];
    try {
      tbCartHD.hasMany(tbCartDT, { foreignKey: "carthdId" });
      // tbStock.hasMany(tbCartDT, { foreignKey: "strockId" });
      const _tbCartHD = await tbCartHD.findOne({
        attributes: ["id"],
        where: { uid: uid },
        include: [
          {
            attributes: ["strockId", "amount"],
            model: tbCartDT,
            // include: [
            //   {
            //     attributes: [
            //       "price",
            //       "discount",
            //       "productCount",
            //       "isFlashSale",
            //       "startDateCampaign",
            //       "endDateCampaign",
            //       "startTimeCampaign",
            //       "endTimeCampaign",
            //     ],
            //     model: tbStock,
            //   },
            // ],
          },
        ],
      });

      if (_tbCartHD) {
        let dtList = _tbCartHD.tbCartDTs;
        for (var i = 0; i < dtList.length; i++) {
          const strockId = dtList[i].strockId;
          const amount = dtList[i].amount;
          const _tbStock = await tbStock.findOne({
            attributes: [
              "id",
              "price",
              "discount",
              "productName",
              "productCount",
              "isFlashSale",
              "startDateCampaign",
              "endDateCampaign",
              "startTimeCampaign",
              "endTimeCampaign",
              "salePercent",
              "saleDiscount",
            ],
            where: { id: strockId },
          });
          if (_tbStock) {
            _tbStock.dataValues.id = Encrypt.EncodeKey(_tbStock.dataValues.id);
            shop_orders.push({
              id: Encrypt.EncodeKey(strockId),
              quantity: amount,
              tbStock: _tbStock.dataValues,
            });
          }
        }
      }
    } catch (e) {
      status = false;
      msg = e.message;
    }
    return res.json({
      status: status,
      msg: msg,
      shop_orders: shop_orders,
    });
  }
);

router.post("/export", validateToken, async (req, res) => {
  // tbOrderHD.hasMany(tbCancelOrder, {
  //   foreignKey: "orderId",
  // });
  // tbOrderHD.hasMany(tbReturnOrder, {
  //   foreignKey: "orderId",
  // });
  // tbOrderHD.belongsTo(tbMember, {
  //   foreignKey: "memberId",
  // });

  // tbOrderDT.belongsTo(tbStock, {
  //   foreignKey: "stockId",
  // });

  // tbStock.belongsTo(tbProductCategory, {
  //   foreignKey: "productCategoryId",
  // });

  // const data = await tbOrderHD.findAll({
  //   where: { isDeleted: false },
  //   include: [
  //     // {

  //     //   model: tbMemberReward,
  //     //   where: {isDeleted: false , id: Sequelize.col('tbOrderHD.memberRewardId')},
  //     //   include: [
  //     //     {
  //     //       model: tbCouponCode,
  //     //       where: { id: Sequelize.col('tbOrderHD.memberRewardId') }
  //     //     }
  //     //   ],
  //     //   required: false,
  //     // },
  //     {
  //       model: tbCancelOrder,
  //       where: {
  //         isDeleted: false,
  //       },
  //       required: false,
  //     },
  //     {
  //       model: tbReturnOrder,
  //       where: {
  //         isDeleted: false,
  //       },
  //       required: false,
  //     },
  //     {
  //       model: tbOrderDT,
  //       where: {
  //         isDeleted: false,
  //       },
  //       include: [
  //         {
  //           model: tbStock,
  //           where: {
  //             isDeleted: false,
  //           },
  //           required: false,
  //         },
  //       ],
  //       required: false,
  //     },
  //     {
  //       model: tbMember,
  //       attributes: ["memberCard", "email"],
  //       where: {
  //         isDeleted: false,
  //       },
  //       required: false,
  //     },
  //   ],
  //   order: [["orderNumber", "DESC"]],
  // });

  // const data = await sequelize.query(
  //   `select tborderhds.orderNumber
  // ,tborderhds.orderDate
  // ,tbmembers.memberCard
  // ,tbmembers.firstName
  // ,tbmembers.lastName
  // ,tbproductcategories.categoryName
  // ,tbstocks.productName
  // ,tborderdts.amount
  // ,tborderdts.price
  // ,tborderhds.deliveryCost
  // ,tborderhds.netTotal
  // ,tborderdts.isFlashSale
  // ,tborderhds.discountStorePromotion
  // ,tbstocks.discount
  // ,tborderhds.discountCoupon
  // ,tborderhds.paymentStatus
  // ,tborderhds.paymentDate
  // ,tborderhds.transportStatus
  // ,tborderhds.trackNo
  // ,tborderhds.points
  // ,tborderhds.phone
  // ,tbmembers.email
  // ,tborderhds.address
  // ,tborderhds.province
  // ,tborderhds.district
  // ,tborderhds.subDistrict
  // ,tborderhds.postcode
  // from tborderhds
  // left join tborderdts on tborderdts.orderId  = tborderhds.id
  // left join tbmembers on tbmembers.id = tborderhds.memberId
  // left join tbstocks on tbstocks.id = tborderdts.stockId
  // left join tbproductcategories on tbproductcategories.id = tbstocks.productCategoryId
  // where tborderhds.isDeleted = 0
  // order by orderNumber`,
  //   { type: QueryTypes.SELECT }
  // );

  // const data = Sequelize.literal()
  // const [results, data] = await sequelize.query(`select tborderhds.orderNumber
  // ,tborderhds.orderDate
  // ,tbmembers.memberCard
  // ,tbmembers.firstName
  // ,tbmembers.lastName
  // ,tbproductcategories.categoryName
  // ,tbstocks.productName
  // ,tborderdts.amount
  // ,tborderdts.price
  // ,tborderhds.deliveryCost
  // ,tborderhds.netTotal
  // ,tborderdts.isFlashSale
  // ,tborderhds.discountStorePromotion
  // ,tbstocks.discount
  // ,tborderhds.discountCoupon
  // ,tbcouponcodes.codeCoupon
  // ,tborderhds.paymentType
  // ,tborderhds.paymentStatus
  // ,tborderhds.paymentDate
  // ,tblogisticcategories.logisticCategory
  // ,tborderhds.transportStatus
  // ,tborderhds.trackNo
  // ,tborderhds.doneDate
  // ,tbcancelorders.createdAt AS createdAtCancel
  // ,tbcancelorders.cancelStatus
  // ,tbcancelorders.cancelDetail
  // ,tbcancelorders.description AS descriptionCancel
  // ,tbcancelorders.cancelOtherRemark
  // ,tbreturnorders.createdAt AS createdAtReturn
  // ,tbreturnorders.returnStatus
  // ,tbreturnorders.returnDetail
  // ,tbreturnorders.description AS descriptionReturn
  // ,tbreturnorders.returnOtherRemark
  // ,tborderhds.points
  // ,tborderhds.phone
  // ,tbmembers.email
  // ,tborderhds.address
  // ,tborderhds.province
  // ,tborderhds.district
  // ,tborderhds.subDistrict
  // ,tborderhds.postcode
  // from tborderhds
  // left join tborderdts on tborderdts.orderId  = tborderhds.id
  // left join tbmembers on tbmembers.id = tborderhds.memberId
  // left join tbstocks on tbstocks.id = tborderdts.stockId
  // left join tbproductcategories on tbproductcategories.id = tbstocks.productCategoryId
  // left join tbcancelorders on tbcancelorders.orderId = tborderhds.id
  // left join tbreturnorders on tbreturnorders.orderId = tborderhds.id
  // left join tblogistics on tborderhds.logisticId  = tblogistics.id
  // left join tblogisticcategories on tblogisticcategories.id = tblogistics.logisticCategoryId
  // left join tbmemberrewards on tbmemberrewards.id = tborderhds.memberRewardId
  // left join tbcouponcodes on tbcouponcodes.id = tbmemberrewards.TableHDId
  // where tborderhds.isDeleted = 0
  // order by orderNumber`);
  // if (results) {
  //   data.map((e, i) => {
  //     let hd = e;
  //     hd.firstName = Encrypt.DecodeKey(hd.firstName);
  //     hd.lastName = Encrypt.DecodeKey(hd.lastName);
  //     hd.phone = Encrypt.DecodeKey(hd.phone);
  //     hd.address = Encrypt.DecodeKey(hd.address);
  //     hd.email = Encrypt.DecodeKey(hd.email);
  //     hd.memberCard = Encrypt.DecodeKey(hd.memberCard);
  //   });
  //   res.json({ status: true, message: "success", tbOrder: data });
  // } else res.json({ status: false, message: "not found order", tbOrder: null });

  if (req.body.ArrayWhere.length > 2) {
    const [results, data] =
      await sequelize.query(`select tborderhds.orderNumber 
  ,tborderhds.orderDate
  ,tbmembers.memberCard  
  ,tbmembers.firstName 
  ,tbmembers.lastName
  ,tbproductcategories.categoryName 
  ,tbstocks.productName
  ,tborderdts.amount
  ,tborderdts.price
  ,tborderhds.deliveryCost 
  ,tborderhds.netTotal 
  ,tborderdts.isFlashSale 
  ,tborderhds.discountStorePromotion 
  ,tbstocks.discount
  ,tborderhds.discountCoupon
  ,tbcouponcodes.codeCoupon 
  ,tborderhds.paymentType 
  ,tborderhds.paymentStatus
  ,tborderhds.paymentDate
  ,tblogisticcategories.logisticCategory 
  ,tborderhds.transportStatus
  ,tborderhds.trackNo
  ,tborderhds.doneDate 
  ,tbcancelorders.createdAt AS createdAtCancel 
  ,tbcancelorders.cancelStatus
  ,tbcancelorders.cancelDetail 
  ,tbcancelorders.description AS descriptionCancel
  ,tbcancelorders.cancelOtherRemark 
  ,tbreturnorders.createdAt AS createdAtReturn
  ,tbreturnorders.returnStatus  
  ,tbreturnorders.returnDetail 
  ,tbreturnorders.description AS descriptionReturn
  ,tbreturnorders.returnOtherRemark  
  ,tborderhds.points
  ,tborderhds.phone 
  ,tbmembers.email
  ,tborderhds.address
  ,tborderhds.province 
  ,tborderhds.district 
  ,tborderhds.subDistrict 
  ,tborderhds.postcode 
  from tborderhds
  left join tborderdts on tborderdts.orderId  = tborderhds.id 
  left join tbmembers on tbmembers.id = tborderhds.memberId 
  left join tbstocks on tbstocks.id = tborderdts.stockId 
  left join tbproductcategories on tbproductcategories.id = tbstocks.productCategoryId 
  left join tbcancelorders on tbcancelorders.orderId = tborderhds.id 
  left join tbreturnorders on tbreturnorders.orderId = tborderhds.id 
  left join tblogistics on tborderhds.logisticId  = tblogistics.id
  left join tblogisticcategories on tblogisticcategories.id = tblogistics.logisticCategoryId 
  left join tbmemberrewards on tbmemberrewards.id = tborderhds.memberRewardId 
  left join tbcouponcodes on tbcouponcodes.id = tbmemberrewards.TableHDId 
  where tborderhds.isDeleted = 0 and tborderhds.id in ${req.body.ArrayWhere}  order by orderNumber`);

    if (results) {
      data.map((e, i) => {
        let hd = e;
        hd.firstName = Encrypt.DecodeKey(hd.firstName);
        hd.lastName = Encrypt.DecodeKey(hd.lastName);
        hd.phone = Encrypt.DecodeKey(hd.phone);
        hd.address = Encrypt.DecodeKey(hd.address);
        hd.email = Encrypt.DecodeKey(hd.email);
        hd.memberCard = Encrypt.DecodeKey(hd.memberCard);
      });
      res.json({ status: true, message: "success", tbOrder: data });
    } else
      res.json({ status: false, message: "not found order", tbOrder: null });
  } else {
    const [results, data] =
      await sequelize.query(`select tborderhds.orderNumber 
,tborderhds.orderDate
,tbmembers.memberCard  
,tbmembers.firstName 
,tbmembers.lastName
,tbproductcategories.categoryName 
,tbstocks.productName
,tborderdts.amount
,tborderdts.price
,tborderhds.deliveryCost 
,tborderhds.netTotal 
,tborderdts.isFlashSale 
,tborderhds.discountStorePromotion 
,tbstocks.discount
,tborderhds.discountCoupon
,tbcouponcodes.codeCoupon 
,tborderhds.paymentType 
,tborderhds.paymentStatus
,tborderhds.paymentDate
,tblogisticcategories.logisticCategory 
,tborderhds.transportStatus
,tborderhds.trackNo
,tborderhds.doneDate 
,tbcancelorders.createdAt AS createdAtCancel 
,tbcancelorders.cancelStatus
,tbcancelorders.cancelDetail 
,tbcancelorders.description AS descriptionCancel
,tbcancelorders.cancelOtherRemark 
,tbreturnorders.createdAt AS createdAtReturn
,tbreturnorders.returnStatus  
,tbreturnorders.returnDetail 
,tbreturnorders.description AS descriptionReturn
,tbreturnorders.returnOtherRemark  
,tborderhds.points
,tborderhds.phone 
,tbmembers.email
,tborderhds.address
,tborderhds.province 
,tborderhds.district 
,tborderhds.subDistrict 
,tborderhds.postcode 
from tborderhds
left join tborderdts on tborderdts.orderId  = tborderhds.id 
left join tbmembers on tbmembers.id = tborderhds.memberId 
left join tbstocks on tbstocks.id = tborderdts.stockId 
left join tbproductcategories on tbproductcategories.id = tbstocks.productCategoryId 
left join tbcancelorders on tbcancelorders.orderId = tborderhds.id 
left join tbreturnorders on tbreturnorders.orderId = tborderhds.id 
left join tblogistics on tborderhds.logisticId  = tblogistics.id
left join tblogisticcategories on tblogisticcategories.id = tblogistics.logisticCategoryId 
left join tbmemberrewards on tbmemberrewards.id = tborderhds.memberRewardId 
left join tbcouponcodes on tbcouponcodes.id = tbmemberrewards.TableHDId 
where tborderhds.isDeleted = 0  order by orderNumber`);
    if (results) {
      data.map((e, i) => {
        let hd = e;
        hd.firstName = Encrypt.DecodeKey(hd.firstName);
        hd.lastName = Encrypt.DecodeKey(hd.lastName);
        hd.phone = Encrypt.DecodeKey(hd.phone);
        hd.address = Encrypt.DecodeKey(hd.address);
        hd.email = Encrypt.DecodeKey(hd.email);
        hd.memberCard = Encrypt.DecodeKey(hd.memberCard);
      });
      res.json({ status: true, message: "success", tbOrder: data });
    } else
      res.json({ status: false, message: "not found order", tbOrder: null });
  }
});

//#endregion line liff
module.exports = router;
