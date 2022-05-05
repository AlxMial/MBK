const express = require("express");
const router = express.Router();
const db = require("../../models");

router.post("/", async (req, res) => {
    const qry = `INSERT INTO mbk_database.tbpointcodedts SELECT * FROM mbk_temp.tbpointcodedts `;
    db.sequelize.query(qry, null, {raw: true}).then(result=>{
        res.json({message:"success"});
    })
});

module.exports = router;