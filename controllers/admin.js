import asyncHandler from "express-async-handler";
import * as userServices from "../services/user.js";
import xlsx from "xlsx";

//get allUser
//@route POST api/admin/get-all-users
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await userServices.getAllusers();
  if (!users) {
    return res.status(200).json({
      status: "success",
      message: "there is no users available",
      users: [],
    });
  }
  res.status(200).json({
    satus: "success",
    message: "users are available",
    users,
  });
});

//post readExcel
//@route POST api/admin/read-excel
const readExcel = asyncHandler(async (req, res, next) => {
  // Reading the Excel file
  const allTables = [];
  const workbook = xlsx.readFile("./public/race1.xlsx");
  workbook.SheetNames.forEach((sheetName) => {
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    let currentTableStart = null;
    let currentTableData = [];

    sheetData.forEach((row, rowIndex) => {
      const isEmptyRow = (row) =>
        Object.values(row).every((value) => value === undefined || value === "");

      if (isEmptyRow(row)) {
        // Empty row encountered
        if (currentTableStart !== null) {
          // Table end detected, add previous table data
          allTables.push({ data: [sheetData.slice(currentTableStart, rowIndex)] });
          currentTableStart = null;
          currentTableData = [];
        }
      } else {
        // Non-empty row encountered, start or continue table data
        if (currentTableStart === null) {
          currentTableStart = rowIndex;
        }
        currentTableData.push(row);
      }
    });

    // Handle the last table if it doesn't end with an empty row
    if (currentTableStart !== null) {
      allTables.push({ data: sheetData.slice(currentTableStart) });
    }
  });

  console.log(allTables);

  res.status(200).send({
    status: "success",
    message: allTables,
  });
});

export { getAllUsers, readExcel };
