const express = require("express");
const router = express.Router();
const { tbImage } = require("../../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

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
            relatedTable: relatedTable,
            isDeleted: false,
        }
    });
    res.json({
        status: true,
        message: "success",
        tbImage: data,
    });
});

router.get("/getAllByRelated/:relatedId/:relatedTable", validateToken, async (req, res) => {
    const relatedId = req.params.relatedId;
    const relatedTable = req.params.relatedTable;

    const data = await tbImage.findAll({
        where: {
            relatedId: relatedId,
            isDeleted: false,
            relatedTable: {
                [Op.like]:  relatedTable + '%',
            }
            // relatedTable: relatedTable
        }
    });
    res.json({
        status: true,
        message: "success",
        tbImage: data,
    });
});

router.put("/", validateToken, async (req, res) => {
    // console.log('req.body', req.body)
    const data = await tbImage.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    const dataUpdate = await tbImage.update(req.body, {
        where: { id: req.body.id },
    });
    res.json({
        status: true,
        message: "success",
        tbImage: req.body,
    });
    // if (!data) {
    //     const dataUpdate = await tbImage.update(req.body, {
    //         where: { id: req.body.id },
    //     });
    //     res.json({
    //         status: true,
    //         message: "success",
    //         tbImage: dataUpdate,
    //     });
    // } else {
    //     res.json({
    //         status: false,
    //         message: "success",
    //         tbImage: null,
    //     });
    // }
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    req.body.isDeleted = true;
    tbImage.update(req.body, { where: { id: id } });
    res.json({ status: true, message: "success", tbImage: null });
});

router.get("/getImgQrCode/:id", async (req, res) => {
    const id = req.params.id;

    const _tbImage = await tbImage.findOne({
        where: { isDeleted: !1, relatedId: Encrypt.DecodeKey(id), relatedTable: "paymentQrCode" },
    });
    const imgBuffer = Buffer.from(_tbImage.dataValues.image, 'base64').toString('utf8')
    var im = Buffer(_tbImage.dataValues.image.toString('binary'), 'base64');
    var base64Data = imgBuffer.replace(/^data:image\/png;base64,/, '');

    var img = Buffer.from(base64Data, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });
    res.end(img);
});


module.exports = router;
