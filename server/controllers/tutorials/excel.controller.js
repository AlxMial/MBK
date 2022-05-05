const db = require("../../models");
const Tutorial = db.tutorials;

const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");
const fsExtra = require("fs-extra");
const { writeJson } = require("fs-extra");
const { writeFileSync,readFileSync  } = require("fs");
const fs = require("fs");

const upload = async (req, res) => {
  try {
    console.log(req)
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path =
      __basedir + "/server/resources/static/assets/uploads/" + req.file.filename;
      __basedir +
      "/server/resources/static/assets/uploads/" +
      req.file.filename;

    let pathJson =
      __basedir +
      "/server/resources/static/assets/json/" + req.body.tbPointCodeHDId +".json";

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

      let tutorials = [];

      rows.forEach((row) => {
        let tutorial = {
          id: row[0],
          title: row[1],
          description: row[2],
          published: row[3],
        };

        tutorials.push(tutorial);
      });
      writeFileSync(pathJson, JSON.stringify(tutorials, null, 2), 'utf8');
      const data = readFileSync(pathJson);
      Tutorial
        .bulkCreate(JSON.parse(data))
        .then(() => {
          res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Fail to import data into database!",
            error: error.message,
          });
        });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

const getTutorials = (req, res) => {
  Tutorial.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

const download = (req, res) => {
  Tutorial.findAll().then((objs) => {
    let tutorials = [];

    objs.forEach((obj) => {
      tutorials.push({
        id: obj.id,
        title: obj.title,
        description: obj.description,
        published: obj.published,
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Tutorials");

    worksheet.columns = [
      { header: "Id", key: "id", width: 5 },
      { header: "Title", key: "title", width: 25 },
      { header: "Description", key: "description", width: 25 },
      { header: "Published", key: "published", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(tutorials);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "tutorials.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

module.exports = {
  upload,
  getTutorials,
  download,
};
