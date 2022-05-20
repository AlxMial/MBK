const express = require("express");
const router = express.Router();
const { tbImage } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/", validateToken, async (req, res) => {
    const data = await tbImage.create(req.body);
    res.json({
        status: true,
        message: "success",
        tbImage: data,
    });
});

router.get("/", validateToken, async (req, res) => {
    const data = await tbImage.findAll({
        where: { isDeleted: false },
    });
    res.json({
        status: true,
        message: "success",
        tbImage: data,
    });
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const data = await tbImage.findOne({ where: { id: id } });
    res.json({
        status: true,
        message: "success",
        tbImage: data,
    });
});

router.get("/byRelated/:relatedId/:relatedTable", validateToken, async (req, res) => {
    const relatedId = req.params.relatedId;
    const relatedTable = req.params.relatedTable;
    const data = await tbImage.findOne({
        where: {
            relatedId: relatedId,
            relatedTable: relatedTable
        }
    });
    res.json({
        status: true,
        message: "success",
        tbImage: data,
    });
});

router.put("/", validateToken, async (req, res) => {
    const data = await tbImage.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    if (!data) {
        const dataUpdate = await tbImage.update(req.body, {
            where: { id: req.body.id },
        });
        res.json({
            status: true,
            message: "success",
            tbImage: dataUpdate,
        });
    } else {
        res.json({
            status: false,
            message: "success",
            tbImage: null,
        });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    req.body.isDeleted = true;
    tbImage.update(req.body, { where: { id: id } });
    res.json({ status: true, message: "success", tbImage: null });
});

module.exports = router;
