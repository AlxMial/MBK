import { useEffect, useState } from "react";
import { Workbook } from "exceljs";
import * as fs from "file-saver";
import moment from "moment";

export const exportExcel = async (dataExport, Title, TitleColumns, columns,sheetName) => {
  //Excel Title, Header, Data
  const title = Title;
  const header = TitleColumns;

  const data = [];
  let GenerateData = "";
  for (let val of dataExport) {
    GenerateData = "";
    for (let valueColumns of columns) {
      if (GenerateData === "") GenerateData = val[valueColumns];
      else {
        if (valueColumns.toLocaleLowerCase().includes("date"))
          GenerateData += "," + moment(val[valueColumns]).format("DD/MM/YYYY");
        else GenerateData += "," + val[valueColumns];
      }
    }
    data.push(GenerateData.split(','));
  }

  //Create workbook and worksheet
  let workbook = new Workbook();
  let worksheet = workbook.addWorksheet(sheetName);

  //Add Row and formatting
  let titleRow = worksheet.addRow([title]);
  titleRow.font = { name: 'Noto Sans', family: 4, size: 16, underline: 'double', bold: true }
  worksheet.addRow([]);

  //Add Image
  worksheet.mergeCells('A1:D2');

  //Blank Row
  worksheet.addRow([]);

  //Add Header Row
  let headerRow = worksheet.addRow(header);

  // Cell Style : Fill and Border
  headerRow.eachCell((cell, number) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' },
      bgColor: { argb: 'FF0000FF' }
    }
    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  })
  // worksheet.addRows(data);

  // Add Data and Conditional Formatting
  data.forEach(d => {
      let row = worksheet.addRow(d);
    }

  );

  worksheet.getColumn(3).width = 30;
  worksheet.getColumn(4).width = 30;
  worksheet.addRow([]);

  //Generate Excel File with given name
  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, Title+'.xlsx');
  })
};
