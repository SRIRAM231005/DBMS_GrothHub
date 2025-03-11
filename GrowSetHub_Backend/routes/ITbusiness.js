const express = require("express");
const {ITbusiness, ITUserProjects, ITUserEmployees, ITProjectsEmployees} = require('../controller/ITbusiness_control');

const ITbusinessRouter = express.Router();

ITbusinessRouter.route('/ITmainbusiness').post(ITbusiness);
ITbusinessRouter.route('/ITUserProjects').post(ITUserProjects);
ITbusinessRouter.route('/ITUserEmployees').post(ITUserEmployees);
ITbusinessRouter.route('/ITProjectsEmployees').get(ITProjectsEmployees);

module.exports = ITbusinessRouter