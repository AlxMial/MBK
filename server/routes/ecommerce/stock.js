const express = require("express");
const router = express.Router();
const { tbStock } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
    const data = await tbStock.create(req.body);
    res.json({
        status: true,
        message: "success",
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
            ],
        },
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
    const data = await tbStock.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    const dataUpdate = await tbStock.update(req.body, {
        where: { id: req.body.id },
    });
    res.json({
        status: true,
        message: "success",
        tbStock: dataUpdate,
    });
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    req.body.isDeleted = true;
    tbStock.update(req.body, { where: { id: id } });
    res.json({ status: true, message: "success", tbStock: null });
});

// line liff
router.get("/getStock", validateLineToken, async (req, res) => {
    const data = await tbStock.findAll({
        where: { isDeleted: false },
    });
    res.json({
        status: true,
        message: "success",
        tbStock: data,
    });
});
module.exports = router;
