const express = require("express");
const {ITbusiness, ITUserProjects, ITUserEmployees, ITProjectsEmployees, ITEmployeesFire} = require('../controller/ITbusiness_control');

const ITbusinessRouter = express.Router();

ITbusinessRouter.route('/ITmainbusiness').post(ITbusiness);
ITbusinessRouter.route('/ITUserProjects').post(ITUserProjects);
ITbusinessRouter.route('/ITUserEmployees').post(ITUserEmployees);
ITbusinessRouter.route('/ITProjectsEmployees').post(ITProjectsEmployees);
ITbusinessRouter.route('/ITEmployeesFire').post(ITEmployeesFire);

module.exports = ITbusinessRouter