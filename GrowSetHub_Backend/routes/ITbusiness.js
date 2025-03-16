const express = require("express");
const {ITbusiness, ITUserProjects, ITUserEmployees, ITProjectsEmployees, ITEmployeesFire, ITEmployeesHire, ITEmployeesAfterHire} = require('../controller/ITbusiness_control');

const ITbusinessRouter = express.Router();

ITbusinessRouter.route('/ITmainbusiness').post(ITbusiness);
ITbusinessRouter.route('/ITUserProjects').post(ITUserProjects);
ITbusinessRouter.route('/ITUserEmployees').post(ITUserEmployees);
ITbusinessRouter.route('/ITProjectsEmployees').post(ITProjectsEmployees);
ITbusinessRouter.route('/ITEmployeesFire').post(ITEmployeesFire);
ITbusinessRouter.route('/ITEmployeesHire').post(ITEmployeesHire);
ITbusinessRouter.route('/ITEmployeesAfterHire').post(ITEmployeesAfterHire);

module.exports = ITbusinessRouter