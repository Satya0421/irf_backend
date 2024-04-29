import Bank from "../models/bankModel.js";

const addBankDetails = async (bankName, accountNumber, ifc, upiId) =>
  await Bank.create({ bankName, accountNumber, ifc, upiId });

export { addBankDetails };
