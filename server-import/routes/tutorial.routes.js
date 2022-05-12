const express = require("express");
const router = express.Router();
const excelController = require("../controllers/tutorials/excel.controller");
const upload = require("../middlewares/upload");

let routes = (app) => {
  router.post("/upload", upload.single("file"), excelController.upload);
  router.post("/generateCode", excelController.generateCode);
  router.get("/tutorials", excelController.getTutorials);

  router.get("/download/:id", excelController.download);
  router.delete("/delete/:id", excelController.deleteCode);
  app.use("mbkimport/api/excel", router);
};

module.exports = routes;
