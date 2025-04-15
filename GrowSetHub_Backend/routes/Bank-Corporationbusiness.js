const express = require("express");
const {bankMainBusiness,SettingInterestsRates,DisplayBankDetails} = require('../controller/Bank-Corporationbusiness_control');

const BankCorporationRouter = express.Router();

BankCorporationRouter.route('/Bank-Corporationmainbusiness').post(bankMainBusiness);
BankCorporationRouter.route('/SettingInterestsRates').post(SettingInterestsRates);
BankCorporationRouter.route('/DisplayBankDetails').post(DisplayBankDetails);
// BankCorporationRouter.route('/usercheck').post(userUniquenessCheck);

module.exports = BankCorporationRouter