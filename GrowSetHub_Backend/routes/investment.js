const express = require("express");
const {Stocks,CompaniesWithStocks,UserInvestments} = require('../controller/investment_control');

const investmentRouter = express.Router();

investmentRouter.route('/stocks').post(Stocks);
investmentRouter.route('/CompaniesWithStocks').get(CompaniesWithStocks);
investmentRouter.route('/UserInvestments').post(UserInvestments);

module.exports = investmentRouter