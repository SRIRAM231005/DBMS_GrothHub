const express = require("express");
const {Stocks} = require('../controller/investment_control');

const investmentRouter = express.Router();

investmentRouter.route('/stocks').post(Stocks);

module.exports = investmentRouter