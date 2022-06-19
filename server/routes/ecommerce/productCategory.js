const express = require("express");
const router = express.Router();
const { tbProductCategory } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const { validateLineToken } = require("../../middlewares/LineMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
    const data = await tbProductCategory.create(req.body);
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
            }
        },
    });

    const dataUpdate = await tbProductCategory.update(req.body, {
        where: { id: req.body.id },
    });
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
router.get("/getProductCategory", validateLineToken, async (req, res) => {
    const data = await tbProductCategory.findAll({
        where: { isDeleted: false },
    });
    res.json({
        status: true,
        message: "success",
        tbProductCategory: data,
    });
});
//#endregion line liff

module.exports = router;
