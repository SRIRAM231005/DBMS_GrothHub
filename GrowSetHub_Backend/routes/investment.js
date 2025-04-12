const express = require("express");
const {Stocks,CompaniesWithStocks,UserInvestments,BoughtShares,SoldShares,getAllRealEstatesNotBought,getAllRealEstatesBought,buyProperty,sellProperty,getTotalIncomePerHourUser,getCountofPropBought,TotalBoughtPrice} = require('../controller/investment_control');

const investmentRouter = express.Router();

investmentRouter.route('/stocks').post(Stocks);
investmentRouter.route('/CompaniesWithStocks').get(CompaniesWithStocks);
investmentRouter.route('/UserInvestments').post(UserInvestments);
investmentRouter.route('/BoughtShares').post(BoughtShares);
investmentRouter.route('/SoldShares').post(SoldShares);
investmentRouter.route('/getAllRealEstatesNotBought').post(getAllRealEstatesNotBought);
investmentRouter.route('/getAllRealEstatesBought').post(getAllRealEstatesBought);
investmentRouter.route('/buyProperty').post(buyProperty);
investmentRouter.route('/sellProperty').post(sellProperty);
investmentRouter.route('/getTotalIncomePerHourUser').post(getTotalIncomePerHourUser);
investmentRouter.route('/TotalBoughtPrice').post(TotalBoughtPrice);
investmentRouter.route('/getCountofPropBought').post(getCountofPropBought);

module.exports = investmentRouter