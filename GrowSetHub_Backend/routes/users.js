const express = require("express");
const {userSignup,userUniquenessCheck,userLogin} = require('../controller/user_control');

const userRouter = express.Router();

userRouter.route('/signup').post(userSignup);
userRouter.route('/usercheck').post(userUniquenessCheck);
userRouter.route('/login').post(userLogin);

module.exports = userRouter