const express = require("express");
const {Stocks,CompanyData} = require('../controller/investment_control');

const investmentRouter = express.Router();

investmentRouter.route('/stocks').post(Stocks);
investmentRouter.route('/company').post(CompanyData);

module.exports = investmentRouter