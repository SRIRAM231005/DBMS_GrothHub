const express = require("express");
const {bankMainBusiness} = require('../controller/Bank-Corporationbusiness_control');

const BankCorporationRouter = express.Router();

BankCorporationRouter.route('/Bank-Corporationmainbusiness').post(bankMainBusiness);
BankCorporationRouter.route('/SettingInterestsRates').post(SettingInterestsRates);
// BankCorporationRouter.route('/usercheck').post(userUniquenessCheck);

module.exports = BankCorporationRouter