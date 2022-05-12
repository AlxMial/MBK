const express = require("express");
const router = express.Router();
const db = require("../../models");

router.post("/", async (req, res) => {
    const qry = `INSERT INTO mbk_database.tbpointcodedts SELECT * FROM mbk_temp.tbpointcodedts where mbk_temp.tbpointcodedts.id not in (select id from mbk_database.tbpointcodedts) and mbk_temp.tbpointcodedts.tbPointCodeHDId in (select id from mbk_database.tbpointcodehds t) `;
    db.sequelize.query(qry, null, {raw: true}).then(result=>{
        res.json({message:"success"});
    }).catch(error =>{

        res.json({error: "error insert"});
    })
});

module.exports = router;