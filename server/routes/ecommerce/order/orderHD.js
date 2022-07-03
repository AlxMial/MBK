const express = require("express");
const moment = require("moment");
const router = express.Router();
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../../middlewares/LineMiddleware");
const ValidateEncrypt = require("../../../services/crypto");
const Encrypt = new ValidateEncrypt();
const jwt = require('jsonwebtoken');
const axios = require('axios').default;

const Sequelize = require("sequelize");
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
  tbPointEcommerce
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
  let status = true
  let msg = "success"
  let orderHD = []
  try {


    // tbImage.hasMany(tbOrderHD, { foreignKey: "relatedId" });
    // tbOrderHD.belongsTo(tbImage, { foreignKey: "id" });

    // tbImage.hasMany(tbOrderHD, { foreignKey: "id" });
    // tbOrderHD.belongsTo(tbImage, { foreignKey: "id" });

    tbOrderHD.hasMany(tbImage, {
      foreignKey: "relatedId",
    });

    tbOrderHD.hasMany(tbCancelOrder, {
      foreignKey: "orderId",
    });

    tbOrderHD.hasMany(tbReturnOrder, {
      foreignKey: "orderId",
    });


    const data = await tbOrderHD.findAll({
      where: { isDeleted: false },
      include: [
        {
          model: tbImage,
          where: {
            isDeleted: false,
            relatedTable: 'tbOrderHD',
          },
          required: false
        },
        {
          model: tbCancelOrder,
          where: {
            isDeleted: false,
          },
          required: false
        },
        {
          model: tbReturnOrder,
          where: {
            isDeleted: false,
          },
          required: false
        },
      ],
    })
    if (data) {
      data.map((e, i) => {
        let hd = e.dataValues;
        if (hd.tbImages.length > 0) {
          hd.image = hd.tbImages[0].image
          hd.imageName = hd.tbImages[0].imageName
        }
        if (hd.tbCancelOrders.length > 0) {
          hd.tbCancelOrder = hd.tbCancelOrders[0]
        }
        if (hd.tbReturnOrders.length > 0) {
          hd.tbReturnOrder = hd.tbCancelOrders[0]
        }



        hd.tbImages = null
        hd.tbCancelOrders = null
        hd.tbReturnOrders = null
        orderHD.push(hd)
      })
      // orderHD = data
    }
    // const data = await tbOrderHD.findAll({
    //   // limit: 3,
    //   where: { isDeleted: false },
    //   // attributes: {
    //   //   include: [
    //   //     [
    //   //       Sequelize.literal(`(
    //   //                   select sum(price) from tbstocks t 
    //   //                       where id in (select stockId from tborderdts t2 
    //   // 	                            where isDeleted=0
    //   // 	                            and orderId = tbOrderHD.id)
    //   //               )`),
    //   //       "sumPrice",
    //   //     ],
    //   //     [
    //   //       Sequelize.literal(`(
    //   //                   select image from tbimages t
    //   //                       where relatedId = tbOrderHD.id
    //   //                       and relatedTable = 'tbOrderHD'
    //   //                       and isDeleted = 0
    //   //               )`),
    //   //       "image",
    //   //     ],
    //   //     [
    //   //       Sequelize.literal(`(
    //   //                   select imageName from tbimages t
    //   //                       where relatedId = tbOrderHD.id
    //   //                       and relatedTable = 'tbOrderHD'
    //   //                       and isDeleted = 0
    //   //               )`),
    //   //       "imageName",
    //   //     ],
    //   //     [
    //   //       Sequelize.literal(`(
    //   //                   select deliveryCost from tblogistics t
    //   //                       where id = tbOrderHD.logisticId
    //   //                       and isDeleted = 0
    //   //               )`),
    //   //       "deliveryCost",
    //   //     ],
    //   //     [
    //   //       Sequelize.literal(`(
    //   //                   select logisticType from tblogistics t
    //   //                       where id = tbOrderHD.logisticId
    //   //                       and isDeleted = 0
    //   //               )`),
    //   //       "logisticType",
    //   //     ],
    //   //     [
    //   //       Sequelize.literal(`(
    //   //                   select sum(weight) from tbstocks t 
    //   //                       where id in (select stockId from tborderdts t2 
    //   // 	                            where t2.isDeleted=0
    //   // 	                            and t2.orderId = tbOrderHD.id)
    //   //               )`),
    //   //       "sumWeight",
    //   //     ],
    //   //   ],
    //   // },
    // });
    // if (data) {

    //   for (var i = 0; i < data.length; i++) {
    //     let hd = data[i].dataValues
    //     const _tbImage = await tbImage.findOne({ where: { relatedId: hd.id, relatedTable: "tbOrderHD" } })
    //     if (_tbImage) {
    //       hd.image = _tbImage.image
    //       hd.imageName = _tbImage.imageName
    //     }
    //     orderHD.push(hd)
    //   }
    //   // orderHD = data
    // }
  } catch (e) {
    status = false
    msg = e.message
  }
  res.json({
    status: status,
    message: msg,
    tbOrderHD: orderHD,
  });
});

router.get("/byId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const data = await tbOrderHD.findOne({ where: { id: id } });
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
      id: {
        [Op.ne]: req.body.id,
      },
    },
  });

  const dataUpdate = await tbOrderHD.update(req.body, {
    where: { id: req.body.id },
  });
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

//ข้อมูลสินค้า
const getorderDT = async (DT) => {
  let orderDT = []
  let status = true
  let msg = ""
  let total = 0; //ราคารวม
  let point = 0 //แต้ม
  try {
    for (var i = 0; i < DT.length; i++) {
      //ดึงราคาใหม่ และ จำนวนใหม่
      let _tbStock = await tbStock.findOne({
        attributes: [
          "isFlashSale",
          "price",
          "discount",
          "discountType",
          "productCount",
        ],
        where: {
          id: Encrypt.DecodeKey(DT[i].stockId || DT[i].id),
          productCount: {
            [Op.gte]: DT[i].amount,
          },
        },
      });

      if (_tbStock) {
        //มีสินค้า
        let _price = 0;
        if (_tbStock.discount > 0) {

          if (_tbStock.discountType == "THB") {
            _price = _tbStock.price - _tbStock.discount;
          } else {
            _price =
              _tbStock.price - (_tbStock.discount / 100) * _tbStock.price;
          }
          total += _price * DT[i].amount;
        } else {
          total += _tbStock.price * DT[i].amount;
        }
        orderDT.push({
          stockId: Encrypt.DecodeKey(DT[i].stockId || DT[i].id),
          amount: DT[i].amount,
          price: _tbStock.price,
          discount: _tbStock.discount,
          discountType: _tbStock.discountType,
          isFlashSale: _tbStock.isFlashSale,
          isFree: false
        });

        //แต้มสะสม 

        let _tbPointEcommerce = await tbPointEcommerce.findAll({
          attributes: [
            "type",
            "purchaseAmount",
            "productAmount",
            "points",
          ],
          where: {
            stockId: Encrypt.DecodeKey(DT[i].stockId || DT[i].id),
            startDate: { [Op.lte]: new Date() },
            endDate: { [Op.gte]: new Date() }
          },
        });
        if (_tbPointEcommerce) {
          _tbPointEcommerce.map((e, i) => {
            if (e.type == 1) {
              if (e.purchaseAmount <= (DT[i].price * DT[i].amount)) {
                let conut = parseInt((DT[i].price * DT[i].amount) / e.purchaseAmount)
                point = point + (conut * e.points)
              }
            } else {
              if (e.productAmount <= DT[i].amount) {
                let conut = parseInt((DT[i].amount) / e.purchaseAmount)
                point = point + (conut * e.points)
              }
            }
          })

        }

      } else {
        status = false;
        msg = "Stock empty !";
      }
    }
  } catch (e) {
    msg = e.message
  }
  return { status: status, msg: msg, orderDT: orderDT, total: total, point: point }
}
//คำนวนโปรร้าน
const getStorePromotion = async (total) => {
  let DiscountStorePromotion = 0
  let type = ""
  let msg = ""
  let status = true
  let orderDT = []
  try {
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
    });
    if (_tbPromotionStore) {
      let prodiscountList = _tbPromotionStore.find(
        (e) =>
          (e.condition == "discount" || e.condition == "%discount") &&
          e.buy <= total
      );

      if (prodiscountList != null) {
        type = "discount"
        let pro = _tbPromotionStore.filter((e) => {
          if (
            (e.condition == "discount" || e.condition == "%discount") &&
            e.buy <= total
          ) {
            return e;
          }
        });

        pro.map((e, i) => {
          let discount = 0;
          if (e.condition == "discount") {
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

        let productList = _tbPromotionStore.find(
          (e) => e.condition == "product"
        );
        if (productList) {
          type = "product"
          let _tbStock = await tbStock.findOne({
            attributes: [
              "isFlashSale",
              "price",
              "discount",
              "discountType",
              "productCount",
            ],
            where: {
              id: productList.stockId,
            },
          });
          if (_tbStock) {
            orderDT.push({
              stockId: productList.stockId,
              amount: 1,
              price: 0,
              discount: 0,
              discountType: 0,
              isFlashSale: false,
              isFree: true
            });
          }
        }
      }
    }
  } catch (e) {
    msg = e.message
    status = false
  }

  return { status: status, msg: msg, type: type, DiscountStorePromotion: DiscountStorePromotion, orderDT: orderDT }
}
//คำนวนค้าส่ง
const getDelivery = async (logisticId, total) => {
  let status = true
  let msg = ""
  let deliveryCost = 0; //ค่าส่ง
  let discountDelivery = 0; //โปรค่าส่ง

  try {
    const _tbLogistic = await tbLogistic.findOne({
      attributes: ["id", "deliveryCost"],
      where: { id: logisticId, isShow: true, isDeleted: false },
    });
    if (_tbLogistic) {
      //มีข้อมูลในระบบ
      let _deliveryCost = _tbLogistic.deliveryCost;
      //มีค่าส่ง
      if (_deliveryCost > 0) {
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
            deliveryCost = 0; //ค่าส่ง
            discountDelivery = _tbPromotionDelivery.deliveryCost; //โปรค่าส่ง
          } else {
            deliveryCost = _deliveryCost; //ค่าส่ง
            discountDelivery = 0; //โปรค่าส่ง
          }
        } else {
          deliveryCost = _deliveryCost; //ค่าส่ง
          discountDelivery = 0; //โปรค่าส่ง
        }
      } else {

      }
    } else {
      //ไม่มีข้อมูลการจัดส่ง
      status = false;
      msg = "logistic empty !";
    }
  } catch (e) {
    status = false
    msg = e.message
  }
  return {
    status: status,
    msg: msg,
    deliveryCost: deliveryCost,
    discountDelivery: discountDelivery
  }
}
//คูปอง
const getDiscountCoupon = async (usecouponid) => {
  let status = true
  let msg = ""
  let DiscountCoupon = 0; // ส่วนลดCoupon
  let memberRewardId = null
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
          if (_tbRedemptionCoupon.discountType == 1) {
            DiscountCoupon = _tbRedemptionCoupon.discount;
          } else {
            DiscountCoupon = (_tbRedemptionCoupon.discount / 100) * totel;
          }
        }
      } else {
        status = false;
        msg = "คูปองไม่สามมารถใช้ได้";
      }
    }
  }
  catch (e) {
    status = false;
    msg = e.message;
  }
  return { status: status, msg: msg, DiscountCoupon: DiscountCoupon, memberRewardId: memberRewardId }
}
const getAddress = async (addressId, memberID) => {
  let status = true
  let msg = ""
  let address;
  try {
    let attributes = ["firstName"
      , "lastName"
      , "phone"
      , "address"
      , "subDistrict"
      , "district"
      , "province"
      , "country"
      , "postcode"]
    if (addressId == null) {
      //ใช้ที่อยู่ member 
      let Member = await tbMember.findOne({
        attributes: attributes,
        where: { id: memberID },
      });
      if (Member) {
        address = Member.dataValues
      }

    } else {
      //ใช้ที่อยู่ที่เลิก

      let Member = await tbOtherAddress.findOne({
        attributes: attributes,
        where: { memberID: memberID },
      });
      if (Member) {
        address = Member.dataValues
      }
    }
  } catch (e) {
    status = false
    msg = "Error Address !"
  }
  return { status: status, msg: msg, address: address }
}
//เพิ่ม Order เท่านั่น
router.post("/doSaveOrder", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  const uid = Encrypt.DecodeKey(req.user.uid);
  let Member;
  let orderId;
  let { orderhd, orderdt, cart } = req.body;
  let orderDT = [];
  let url2c2p
  try {
    Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });

    //#region ถอดรหัส 
    orderhd.memberId = Member.id;
    orderhd.orderDate = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "asia/bangkok",
        hour12: false,
      })
    );
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
    let point = 0
    let _getorderDT = await getorderDT(orderdt)
    if (_getorderDT.status) {
      total = _getorderDT.total
      point = _getorderDT.point
      orderDT = _getorderDT.orderDT
    } else {
      status = _getorderDT.status;
      msg = _getorderDT.msg;
    }
    //#endregion ข้อมูลสินค้า

    //#region โปรร้าน
    let DiscountStorePromotion = 0;
    if (status) {
      let _getStorePromotion = await getStorePromotion(total)
      if (_getStorePromotion.status) {
        if (_getStorePromotion.type == "discount") {
          DiscountStorePromotion = _getStorePromotion.DiscountStorePromotion
          total = total - DiscountStorePromotion
        } else if (_getStorePromotion.type == "product") {
          let _orderDT = _getStorePromotion.orderDT
          _orderDT.map((e, i) => {
            orderDT.push(e)
          })
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
      let _getDelivery = await getDelivery(orderhd.logisticId, total)
      if (_getDelivery.status) {
        deliveryCost = _getDelivery.deliveryCost; //ค่าส่ง
        discountDelivery = _getDelivery.discountDelivery; //โปรค่าส่ง
        total = total + deliveryCost + discountDelivery
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
        let _getDiscountCoupon = await getDiscountCoupon(orderhd.usecouponid)
        if (_getDiscountCoupon.status) {
          DiscountCoupon = _getDiscountCoupon.DiscountCoupon
          orderhd.memberRewardId = _getDiscountCoupon.memberRewardId
        } else {
          status = _getDiscountCoupon.status;
          msg = _getDiscountCoupon.msg;
        }
      }
    }
    total = total - DiscountCoupon
    //#endregion ส่วนลด Coupon

    //#region ที่อยู่ปัจจุบัน
    if (status) {
      let _getAddress = await getAddress(orderhd.otherAddressId, Member.id)
      if (_getAddress.status) {
        const address = _getAddress.address
        orderhd.firstName = address.firstName
        orderhd.lastName = address.lastName
        orderhd.phone = address.phone
        orderhd.address = address.firstName
        orderhd.subDistrict = address.subDistrict
        orderhd.district = address.district
        orderhd.province = address.province
        orderhd.country = address.country
        orderhd.postcode = address.postcode
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
        let data = await tbOrderHD.count({
          where: {
            orderNumber: {
              [Op.like]: "%" + today + "%",
            },
          },
        });
        let num = "";
        data = data + 1;
        if (data < 10) {
          num = "000" + data.toString();
        } else if (data < 100) {
          num = "00" + data.toString();
        } else if (data < 1000) {
          num = "0" + data.toString();
        }
        return "LOA-" + today + "-" + num;
      };
      //#endregion รันรหัสสินค้า
      orderhd.orderNumber = await genorderNumber();
      orderhd.deliveryCost = deliveryCost;
      orderhd.discountDelivery = discountDelivery;
      orderhd.discountCoupon = DiscountCoupon;
      orderhd.discountStorePromotion = DiscountStorePromotion;
      orderhd.points = point
      orderhd.netTotal = total

      try {
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
              let _tbStockData = await tbStock.findOne({ attributes: ["productCount"], where: { id: orderDT[i].stockId } })
              if (_tbStockData) {
                let _tbStock = await tbStock.update({ productCount: _tbStockData.productCount - orderDT[i].amount }, {

                  where: {
                    id: orderDT[i].stockId,
                  },
                });
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
          let secretKey = '0181112C92043EA4AD2976E082A3C5F20C1137ED39FFC5D651C7A420BA51AF22'
          let payload = {
            "merchantID": '764764000011180',

            "invoiceNo": orderId + "-" + orderhd.orderNumber,
            "description": "item 1",
            "amount": orderhd.netTotal,
            "currencyCode": "THB",
            "request3DS": "Y",
            "backendReturnUrl": "https://undefined.ddns.net/mahboonkrongserver/2c2p",
            "frontendReturnUrl": "https://undefined.ddns.net/mahboonkrongserver/line/paymentsucceed/" + Encrypt.EncodeKey((orderId + "," + orderhd.orderNumber)),
          }

          const token = jwt.sign(payload, secretKey);
          await axios.post("https://sandbox-pgw.2c2p.com/payment/4.1/PaymentToken",
            { "payload": token })
            .then(function (res) {
              // handle success
              let payload = res.data.payload
              const decoded = jwt.decode(payload)
              url2c2p = decoded
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

      } catch (e) {
        status = false
        msg = e.message
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
    url: url2c2p
  });
});
router.post("/doSaveUpdateOrder", validateLineToken, async (req, res) => {
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

      //สินค้า
      let total = 0; //ราคารวม
      let point = 0
      let orderdt = data.orderdt;
      let orderDT = [];
      let _getorderDT = await getorderDT(orderdt)
      if (_getorderDT.status) {
        total = _getorderDT.total
        point = _getorderDT.point
        orderDT = _getorderDT.orderDT
      } else {
        status = _getorderDT.status;
        msg = _getorderDT.msg;
      }

      // โปรร้าน
      let DiscountStorePromotion = 0;
      let _getStorePromotion = await getStorePromotion(total)
      if (_getStorePromotion.status) {
        if (_getStorePromotion.type == "discount") {
          DiscountStorePromotion = _getStorePromotion.DiscountStorePromotion
          total = total - DiscountStorePromotion
        } else if (_getStorePromotion.type == "product") {
          let _orderDT = _getStorePromotion.orderDT
          _orderDT.map((e, i) => {
            orderDT.push(e)
          })
        }
      } else {
        status = _getStorePromotion.status;
        msg = _getStorePromotion.msg;
      }


      //ข้อมูลวิธีการจัดส่ง
      let deliveryCost = 0; //ค่าส่ง
      let discountDelivery = 0; //โปรค่าส่ง

      let _getDelivery = await getDelivery(Encrypt.DecodeKey(data.logisticId), total)
      if (_getDelivery.status) {
        deliveryCost = _getDelivery.deliveryCost; //ค่าส่ง
        discountDelivery = _getDelivery.discountDelivery; //โปรค่าส่ง
        total = total + deliveryCost + discountDelivery
      } else {
        status = _getDelivery.status;
        msg = _getDelivery.msg;
      }


      // ส่วนลดCoupon
      let DiscountCoupon = 0;
      if (status) {
        if (data.usecouponid != null) {
          let _getDiscountCoupon = await getDiscountCoupon(data.usecouponid)
          if (_getDiscountCoupon.status) {
            DiscountCoupon = _getDiscountCoupon.DiscountCoupon
            data.memberRewardId = _getDiscountCoupon.memberRewardId
          } else {
            status = _getDiscountCoupon.status;
            msg = _getDiscountCoupon.msg;
          }
        }
      }
      total = total - DiscountCoupon

      //ที่อยู่ปัจจุบัน
      if (status) {
        let _getAddress = await getAddress(data.otherAddressId, Member.id)
        if (_getAddress.status) {
          const address = _getAddress.address
          data.firstName = address.firstName
          data.lastName = address.lastName
          data.phone = address.phone
          data.address = address.firstName
          data.subDistrict = address.subDistrict
          data.district = address.district
          data.province = address.province
          data.country = address.country
          data.postcode = address.postcodeF
        } else {
          status = _getAddress.status;
          msg = _getAddress.msg;
        }
      }

      if (status) {
        try {
          const updtbOrderHD = await tbOrderHD.update(
            {
              logisticId: Encrypt.DecodeKey(data.logisticId),
              paymentId: Encrypt.DecodeKey(data.paymentId),
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
              netTotal: total
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
        } catch (e) {
          status = false;
          msg = e.message;
        }
      }
    } else {
      status = false
      msg = "member empty !"
    }
  } catch (e) {
    status = false
    msg = e.message
  }
  return res.json({
    status: status,
    msg: msg,
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
        },
        {
          where: {
            id: Encrypt.DecodeKey(data.id),
          },
        }
      );
      //#endregion อัพถานะการจ่ายเงิน
      //#region อัพถานะคูปอง
      const _tbOrderHD = await tbOrderHD.findOne(
        {
          attributes: ["memberRewardId", "transportStatus"],
          where: {
            id: Encrypt.DecodeKey(data.id),
          },
        }
      );
      if (_tbOrderHD) {
        if (_tbOrderHD.memberRewardId != null) {
          await tbMemberReward.update(
            {
              isUsedCoupon: true,
              deliverStatus: _tbOrderHD.transportStatus
            },
            { where: { id: _tbOrderHD.memberRewardId } }
          );
        }

      }
      //#endregion อัพถานะคูปอง

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

router.post("/getOrderHD", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let Member;
  let { PaymentStatus, TransportStatus, isCancel, isReturn } = req.body;
  let OrderHDData = [];
  let OrderHD = [];
  let attributesOrderHD = [
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
  ];
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    if (Member) {
      if (
        PaymentStatus == 1 &&
        TransportStatus == 1 &&
        !isCancel &&
        !isReturn
      ) {
        ///ที่ต้องชำระ
        let _OrderHDData = await tbOrderHD.findAll({
          attributes: attributesOrderHD,
          where: {
            isCancel: isCancel,
            IsDeleted: false,
            memberId: Member.id,
            paymentStatus: [PaymentStatus, 2],
            transportStatus: TransportStatus,
            isReturn: isReturn,
          },
        });
        for (var i = 0; i < _OrderHDData.length; i++) {
          let hd = _OrderHDData[i].dataValues;
          const _tbCancelOrder = await tbCancelOrder.findOne({
            attributes: ["id", "orderId"],
            where: {
              IsDeleted: false,
              orderId: _OrderHDData[i].id,
            },
          });
          if (_tbCancelOrder == null) {
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
      } else if (PaymentStatus == 3 && TransportStatus == 1) {
        //เตรียมสินค้า
        let _OrderHDData = await tbOrderHD.findAll({
          attributes: attributesOrderHD,
          where: {
            isCancel: false,
            IsDeleted: false,
            memberId: Member.id,
            paymentStatus: PaymentStatus,
            transportStatus: TransportStatus,
          },
        });
        if (_OrderHDData) {
          for (var i = 0; i < _OrderHDData.length; i++) {
            const _tbCancelOrder = await tbCancelOrder.findOne({
              attributes: ["id", "orderId"],
              where: {
                IsDeleted: false,
                orderId: _OrderHDData[i].id,
              },
            });
            if (_tbCancelOrder == null) {
              OrderHDData.push(_OrderHDData[i]);
            }
          }
        }
      } else if (PaymentStatus == 3 && TransportStatus == 2) {
        //ที่ต้องได้รับ
        OrderHDData = await tbOrderHD.findAll({
          attributes: attributesOrderHD,
          where: {
            isCancel: false,
            IsDeleted: false,
            memberId: Member.id,
            paymentStatus: PaymentStatus,
            transportStatus: TransportStatus,
            isReturn: isReturn,
          },
        });
      } else if (
        PaymentStatus == 3 &&
        TransportStatus == 3 &&
        !isReturn
      ) {
        //สำเร็จ
        let _OrderHDData = await tbOrderHD.findAll({
          attributes: attributesOrderHD,
          where: {
            isCancel: false,
            IsDeleted: false,
            memberId: Member.id,
            paymentStatus: PaymentStatus,
            transportStatus: TransportStatus,
            isReturn: isReturn,
          },
        });

        if (_OrderHDData) {
          for (var i = 0; i < _OrderHDData.length; i++) {
            const _tbReturnOrder = await tbReturnOrder.findOne({
              attributes: ["id", "orderId", "returnStatus"],
              where: {
                IsDeleted: false,
                orderId: _OrderHDData[i].id,
                // returnStatus: [1,2, 3],
              },
            });
            if (_tbReturnOrder == null) {
              OrderHDData.push(_OrderHDData[i]);
            } else {
              if (_tbReturnOrder.dataValues.returnStatus == 3) {
                _OrderHDData[i].dataValues.returnStatus = _tbReturnOrder.dataValues.returnStatus;
                OrderHDData.push(_OrderHDData[i]);
              }
            }
          }
        }
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
                memberId: Member.id,
              },
            });
            if (_tbOrderHD != null) {
              _tbOrderHD.dataValues.cancelStatus =
                _tbCancelOrder[i].cancelStatus;
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
                memberId: Member.id,
              },
            });
            if (_tbOrderHD != null) {
              _tbOrderHD.dataValues.returnStatus =
                _tbReturnOrder[i].returnStatus;
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
          let amount = 0;
          let price = 0;
          const OrderDTData = await tbOrderDT.findAll({
            attributes: [
              "id",
              "amount",
              "price",
              "discount",
              "discountType",
              "stockId",
              // , "orderId"
            ],
            where: {
              IsDeleted: false, orderId: hd.id,
              isFree: false
            },
          });

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
              parseFloat(_tbStock.discount) > 0
                ? _tbStock.discountType == "THB"
                  ? parseFloat(_tbStock.price) - parseFloat(_tbStock.discount)
                  : parseFloat(_tbStock.price) -
                  (parseFloat(_tbStock.discount) / 100) *
                  parseFloat(_tbStock.price)
                : 0;
            dt.price = parseFloat(_tbStock.price);
            amount += dt.amount;
            hd.dt.push({
              id: Encrypt.EncodeKey(dt.stockId),
              price: dt.price,
              discount: dt.discount,
              productName: dt.productName,
              amount: dt.amount,
            });

            price += (dt.discount > 0 ? dt.discount : dt.price) * dt.amount;
          }

          price =
            price +
            hd.deliveryCost +
            hd.discountDelivery -
            hd.discountCoupon -
            hd.discountStorePromotion;

          hd.amount = amount;
          hd.price = price;
          hd.id = Encrypt.EncodeKey(hd.id);
          OrderHD.push({
            id: hd.id,
            orderNumber: hd.orderNumber,
            amount: hd.amount,
            price: hd.price,
            returnStatus: hd.returnStatus,
            cancelStatus: hd.cancelStatus,
            dt: hd.dt,
            isPaySlip: hd.isPaySlip == null ? null : hd.isPaySlip,
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
    OrderHD: OrderHD,
  });
});
//หน้าจอ ชำระเงิน
router.post("/getOrder", validateLineToken, async (req, res) => {
  let status = true;
  let msg;
  let Member;
  let { orderId } = req.body;
  let OrderHDData;
  let OrderHD;
  try {
    const uid = Encrypt.DecodeKey(req.user.uid);
    Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    if (Member) {
      OrderHDData = await tbOrderHD.findOne({
        attributes: ["id", "logisticId", "paymentId", "memberRewardId", "paymentStatus"],
        where: {
          id: Encrypt.DecodeKey(orderId),
          isCancel: false,
          IsDeleted: false,
          memberId: Member.id,
          // paymentStatus: "Wating",
          transportStatus: 1,
          isReturn: false,
        },
      });
      let total = 0;
      if (OrderHDData) {
        const OrderDTData = await tbOrderDT.findAll({
          attributes: [
            "id",
            "amount",
            "price",
            "discount",
            "discountType",
            "stockId",
            "orderId",
          ],
          where: { IsDeleted: false, orderId: OrderHDData.dataValues.id },
        });
        // ลดราคา
        for (var j = 0; j < OrderDTData.length; j++) {
          let dt = OrderDTData[j].dataValues;
          //ลดราคา
          if (dt.discount > 0) {
            let price = 0;
            if (dt.discountType === "Percent") {
              price = dt.price - (dt.discount / 100) * dt.price;
            } else {
              price = dt.price - dt.discount;
            }
            total = total + price * dt.amount;
          } else {
            total = total + dt.price * dt.amount;
          }
        }
        // คูปอง

        let DiscountStorePromotion = 0; // โปรร้าน

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
        });
        if (_tbPromotionStore) {
          let prodiscountList = _tbPromotionStore.find(
            (e) =>
              (e.condition == "discount" || e.condition == "%discount") &&
              e.buy <= total
          );

          if (prodiscountList != null) {
            let pro = _tbPromotionStore.filter((e) => {
              if (
                (e.condition == "discount" || e.condition == "%discount") &&
                e.buy <= total
              ) {
                return e;
              }
            });

            pro.map((e, i) => {
              let discount = 0;
              if (e.condition == "discount") {
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
            let productList = _tbPromotionStore.find(
              (e) => e.condition == "product"
            );
            if (productList) {
              let _tbStock = await tbStock.findOne({
                attributes: [
                  "isFlashSale",
                  "price",
                  "discount",
                  "discountType",
                  "productCount",
                ],
                where: {
                  id: productList.stockId,
                },
              });
            }

          }
        }
        total = total - DiscountStorePromotion;

        // ค่าขนส่ง
        //ข้อมูลวิธีการจัดส่ง
        let deliveryCost = 0; //ค่าส่ง
        let discountDelivery = 0; //โปรค่าส่ง
        const _tbLogistic = await tbLogistic.findOne({
          attributes: ["id", "deliveryCost"],
          where: {
            id: OrderHDData.dataValues.logisticId,
            isShow: true,
            isDeleted: false,
          },
        });
        if (_tbLogistic) {
          //มีข้อมูลในระบบ
          let _deliveryCost = _tbLogistic.deliveryCost;
          //มีค่าส่ง
          if (_deliveryCost > 0) {
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
              if (total - DiscountStorePromotion >= _tbPromotionDelivery.buy) {
                //เข้าเงื่อนไขโปร
                deliveryCost = 0; //ค่าส่ง
                discountDelivery = _tbPromotionDelivery.deliveryCost; //โปรค่าส่ง
              } else {
                deliveryCost = _deliveryCost; //ค่าส่ง
                discountDelivery = 0; //โปรค่าส่ง
              }
            } else {
              deliveryCost = _deliveryCost; //ค่าส่ง
              discountDelivery = 0; //โปรค่าส่ง
            }
          }
        } else {
          //ไม่มีข้อมูลการจัดส่ง
          status = false;
          msg = "logistic empty !";
        }
        total = total + deliveryCost + discountDelivery;

        // ส่วนลดCoupon
        let DiscountCoupon = 0;
        if (OrderHDData.dataValues.memberRewardId != null) {
          const _tbMemberReward = await tbMemberReward.findOne({
            attributes: ["id", "TableHDId"],
            where: { id: OrderHDData.dataValues.memberRewardId },
          });
          //มีคูปอง
          if (_tbMemberReward) {
            const _tbCouponCode = await tbCouponCode.findOne({
              attributes: ["redemptionCouponId"],
              where: { id: _tbMemberReward.TableHDId },
            });
            const _tbRedemptionCoupon = await tbRedemptionCoupon.findOne({
              attributes: ["discount", "discountType"],
              where: { id: _tbCouponCode.redemptionCouponId },
            });

            if (_tbRedemptionCoupon) {
              if (_tbRedemptionCoupon.discountType == 1) {
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

        total = total - DiscountCoupon;

        let _tbPayment = await tbPayment.findOne({
          attributes: [
            "id",
            "accountName",
            "accountNumber",
            "bankBranchName",
            "bankName",
          ],
          where: { isDeleted: false, id: OrderHDData.dataValues.paymentId },
        });
        if (_tbPayment) {
          _tbPayment.dataValues.id = Encrypt.EncodeKey(
            _tbPayment.dataValues.id
          );
        }

        OrderHD = {
          id: Encrypt.EncodeKey(OrderHDData.dataValues.id),
          price: total,
          Payment: _tbPayment,
        };

        if (OrderHDData.dataValues.paymentStatus != 1) {
          status = false;
          msg = OrderHDData.dataValues.paymentStatus == 2 ? "รอการตรวจสอบ" : "ชำระเงินเรียบร้อยแล้ว";
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
    Member = await tbMember.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    let sumprice = 0;
    if (Member) {
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
          "netTotal"
        ],
        where: {
          IsDeleted: false,
          id: Encrypt.DecodeKey(Id),
        },
      });

      if (OrderHDData) {
        let hd = OrderHDData.dataValues;
        hd.dt = [];
        const OrderDTData = await tbOrderDT.findAll({
          attributes: [
            "id",
            "amount",
            "price",
            "discount",
            "discountType",
            "stockId",
            "orderId",
          ],
          where: {
            IsDeleted: false, orderId: hd.id,
            isFree: false
          },
        });

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
          // hd.dt.push(dt)
          dt.discount = parseFloat(dt.discount);
          dt.discount =
            dt.discount > 0
              ? dt.discountType == "THB"
                ? dt.price - dt.discount
                : dt.price - (dt.discount / 100) * dt.price
              : 0;
          sumprice +=
            dt.discount > 0 ? dt.discount * dt.amount : dt.price * dt.amount;
          hd.dt.push({
            id: _tbStock.id,
            productName: _tbStock.productName,
            amount: dt.amount,
            price: dt.price,
            discount: dt.discount,
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
                  "expiredDate",
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

        const _tbCancelOrder = await tbCancelOrder.findOne({
          attributes: [
            "id",
            "cancelStatus",
            "cancelType",
            "cancelDetail",
            "description",
            "createdAt",
          ],
          where: { isDeleted: false, orderId: hd.id },
        });
        let tbCancelOrderData = null;
        if (_tbCancelOrder) {
          _tbCancelOrder.dataValues.id = Encrypt.EncodeKey(_tbCancelOrder.id);
          tbCancelOrderData = _tbCancelOrder;
        }

        const _tbReturnOrder = await tbReturnOrder.findOne({
          attributes: [
            "id",
            "returnStatus",
            "returnType",
            "returnDetail",
            "description",
            "createdAt",
          ],
          where: { isDeleted: false, orderId: hd.id },
        });
        let tbReturnOrderData = null;
        if (_tbReturnOrder) {
          _tbReturnOrder.dataValues.id = Encrypt.EncodeKey(_tbReturnOrder.id);
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
                    "isNotExpired",
                    "startDate",
                    "expiredDate",
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
                discount: _tbCouponCode.tbRedemptionCoupon.discount,
                expiredDate:
                  _tbCouponCode.tbRedemptionCoupon.expiredDate == null
                    ? "-"
                    : _tbCouponCode.tbRedemptionCoupon.expiredDate,
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
          logisticId:
            type == "update" ? Encrypt.EncodeKey(hd.logisticId) : null,
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
          netTotal: hd.netTotal
        };


        // เช็คการจ่ายเงิน
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

router.post("/upd_shopcart", async (req, res) => {
  let status = true;
  let msg;
  // const uid = Encrypt.DecodeKey(req.user.uid);
  const { id, quantity, type, uid } = req.body;
  let shop_orders = [];
  try {
    const _tbCartHD = await tbCartHD.findOne({
      attributes: ["id"],
      where: { uid: uid },
    });
    if (_tbCartHD) {
      //#region ข้อมูลมีตระกร้า
      const _tbCartDT = await tbCartDT.findOne({
        attributes: ["id", "amount"],
        where: { strockId: Encrypt.DecodeKey(id) },
      });
      //#endregion ข้อมูลมีตระกร้า

      if (_tbCartDT) {
        //ดึงจำนวนคงเหลือ
        const _tbStock = await tbStock.findOne({
          attributes: ["id", "productCount"],
          where: { id: Encrypt.DecodeKey(id) },
        });
        if (_tbStock) {
          const addamount = quantity; //จำนวนที่เพิ่ม
          const oldamount = _tbCartDT.amount; // จำนวนในตระกร้า
          const productCount = _tbStock.productCount; // จำนวนสินค้า
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
              const dataupd = await tbCartDT.update(
                {
                  amount: quantity,
                },
                { where: { strockId: Encrypt.DecodeKey(id) } }
              );
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
      } else {
        //ไม่มีให้เพิ่ม
        const addtbCartDT = await tbCartDT.create({
          carthdId: _tbCartHD.id,
          strockId: Encrypt.DecodeKey(id),
          amount: quantity,
        });
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
      const _tbCartHD = await tbCartHD.findOne({
        attributes: ["id"],
        where: { uid: uid },
      });
      if (_tbCartHD) {
        const _tbCartDT = await tbCartDT.findAll({
          attributes: ["strockId", "amount"],
          where: { carthdId: _tbCartHD.id },
        });
        _tbCartDT.map((e, i) => {
          shop_orders.push({
            id: Encrypt.EncodeKey(e.strockId),
            quantity: e.amount,
          });
        });
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

//#endregion line liff
module.exports = router;
