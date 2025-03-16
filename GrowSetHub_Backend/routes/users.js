const express = require("express");
const {userSignup,userUniquenessCheck,userLogin} = require('../controller/user_control');
const {InsertUserbusiness, SelectUserbusiness} = require('../controller/business_control');
const {Balance, Statistics} = require('../controller/profile_control');

const userRouter = express.Router();

userRouter.route('/signup').post(userSignup);
userRouter.route('/usercheck').post(userUniquenessCheck);
userRouter.route('/login').post(userLogin);
userRouter.route('/InsertUserbusiness').post(InsertUserbusiness);
userRouter.route('/SelectUserbusiness').post(SelectUserbusiness);
userRouter.route('/Balance').post(Balance);
userRouter.route('/Statistics').post(Statistics);

module.exports = userRouter