const express = require("express");
const {Stocks,CompaniesWithStocks,UserInvestments,BoughtShares,SoldShares} = require('../controller/investment_control');

const investmentRouter = express.Router();

investmentRouter.route('/stocks').post(Stocks);
investmentRouter.route('/CompaniesWithStocks').get(CompaniesWithStocks);
investmentRouter.route('/UserInvestments').post(UserInvestments);
investmentRouter.route('/BoughtShares').post(BoughtShares);
investmentRouter.route('/SoldShares').post(SoldShares);

module.exports = investmentRouter