const express = require("express");
const router = express.Router();
const { tbPointEcommerce } = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/",validateToken, async (req, res) => {
  const pointEcommerceHD = await tbPointEcommerce.findOne({
    where: {
      campaignName: req.body.campaignName,
      isDeleted: false,
    },
  });
  if (!pointEcommerceHD) {
    const postCode = await tbPointEcommerce.create(req.body);
    res.json({
      status: true,
      isCampaignName: false,
      message: "success",
      tbPointEcommerce: postCode,
    });
  } else {
    res.json({
      status: false,
      isCampaignName: true,
      message: "success",
      tbPointEcommerce: null,
    });
  }
});

router.get("/", validateToken, async (req, res) => {
  const listPointEcommerce = await tbPointEcommerce.findAll({
    where: { isDeleted: false },
    order :[['createdAt', 'DESC']]
  });
  res.json({
    status: true,
    message: "success",
    tbPointEcommerce: listPointEcommerce,
  });
});

router.get("/byId/:id",validateToken, async (req, res) => {
  const id = req.params.id;
  const listPointEcommerce = await tbPointEcommerce.findOne({ where: { id: id } });
  res.json({
    status: true,
    message: "success",
    tbPointEcommerce: listPointEcommerce,
  });
});

router.put("/",validateToken, async (req, res) => {
  const pointEcommerceHD = await tbPointEcommerce.findOne({
    where: {
      campaignName: req.body.campaignName,
      isDeleted: false,
      id: {
        [Op.ne] : req.body.id,
      }
    },
  });

  if (!pointEcommerceHD) {
    const listPointEcommerce = await tbPointEcommerce.update(req.body, {
      where: { id: req.body.id },
    });
    res.json({
      status: true,
      message: "success",
      tbPointEcommerce: listPointEcommerce,
    });
  } else {
    res.json({
      status: false,
      isCampaignName: true,
      message: "success",
      tbPointEcommerce: null,
    });
  }
});

router.delete("/:pointEcommerceId",validateToken, async (req, res) => {
  const pointEcommerceId = req.params.pointEcommerceId;
  req.body.isDeleted = true;
  tbPointEcommerce.update(req.body, { where: { id: pointEcommerceId } });
  res.json({ status: true, message: "success", tbPointEcommerce: null });
});

module.exports = router;
