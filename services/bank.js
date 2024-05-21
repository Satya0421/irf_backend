import Bank from "../models/bankModel.js";

const addBankDetails = async (bankDetails) => await Bank.create({ ...bankDetails });

const updateBankDetails = async (id, bankdetails) =>
  await Bank.findByIdAndUpdate({ _id: id }, { ...bankdetails }, { new: true });

const isAccountNumberExist = async (accountNumber) => await Bank.findOne({ accountNumber });

const isUpiIdExist = async (upiId) => await Bank.findOne({ upiId });

const findBankDetailsById = async (id) => await Bank.findById(id);

const updateBankStatus = async (id, isAccountVerified) =>
  await Bank.findByIdAndUpdate(
    id,
    { $set: { isAccountVerified: !isAccountVerified } },
    { new: true }
  );

export {
  addBankDetails,
  updateBankDetails,
  isAccountNumberExist,
  isUpiIdExist,
  findBankDetailsById,
  updateBankStatus,
};
