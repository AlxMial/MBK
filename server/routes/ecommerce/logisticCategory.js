const express = require("express");
const router = express.Router();
const { tbLogisticCategory } = require("../../models");
const { validateToken } = require("../../middlewares/AuthMiddleware");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const ValidateEncrypt = require("../../services/crypto");
const Encrypt = new ValidateEncrypt();

router.post("/", validateToken, async (req, res) => {
    const data = await tbLogisticCategory.create(req.body);
    res.json({
        status: true,
        message: "success",
        tbLogisticCategory: data,
    });
});

router.get("/", validateToken, async (req, res) => {
    const data = await tbLogisticCategory.findAll({
        where: { isDeleted: false },
    });
    res.json({
        status: true,
        message: "success",
        tbLogisticCategory: data,
    });
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const data = await tbLogisticCategory.findOne({ where: { id: id } });
    res.json({
        status: true,
        message: "success",
        tbLogisticCategory: data,
    });
});

router.put("/", validateToken, async (req, res) => {
    const data = await tbLogisticCategory.findOne({
        where: {
            isDeleted: false,
            id: {
                [Op.ne]: req.body.id,
            }
        },
    });

    const dataUpdate = await tbLogisticCategory.update(req.body, {
        where: { id: req.body.id },
    });
    res.json({
        status: true,
        message: "success",
        tbLogisticCategory: dataUpdate,
    });
});

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    req.body.isDeleted = true;
    tbLogisticCategory.update(req.body, { where: { id: id } });
    res.json({ status: true, message: "success", tbLogisticCategory: null });
});

//#region line liff
router.get("/getProductCategory"
    // , validateLineToken
    , async (req, res) => {
        let status = true
        let msg = ""
        let ProductCategory = []

        try {
            const _tbLogisticCategory = await tbLogisticCategory.findAll({
                attributes: ["id", "categoryName"],
                where: { isDeleted: false },
            });

            _tbLogisticCategory.map((e, i) => {
                ProductCategory.push({
                    id: Encrypt.EncodeKey(e.id),
                    name: e.categoryName
                })
            })
        } catch (e) {
            status = false
            msg = e.message
        }
        res.json({
            status: status,
            msg: msg,
            tbLogisticCategory: ProductCategory,
        });
    });
//#endregion line liff

module.exports = router;
