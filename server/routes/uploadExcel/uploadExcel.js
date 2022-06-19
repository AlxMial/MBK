const express = require("express");
const router = express.Router();
const db = require("../../models");

router.post("/", async (req, res) => {
  const qry = `INSERT INTO mbk_database.tbpointcodedts SELECT * FROM mbk_temp.tbpointcodedts where mbk_temp.tbpointcodedts.id not in (select id from mbk_database.tbpointcodedts) and mbk_temp.tbpointcodedts.tbPointCodeHDId in (select id from mbk_database.tbpointcodehds t) `;
  db.sequelize
    .query(qry, null, { raw: true })
    .then((result) => {
      const deleteqry = `DELETE FROM mbk_temp.tbpointcodedts WHERE mbk_temp.tbpointcodedts.tbPointCodeHDId IN (select tbPointCodeHDId from mbk_database.tbpointcodedts)`;
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

router.post("/coupon", async (req, res) => {
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
          res.json({
            statue: false,
            error: "error insert",
          });
        });
    })
    .catch((error) => {
      res.json({
        statue: false,
        error: "error insert",
      });
    });
});

module.exports = router;
