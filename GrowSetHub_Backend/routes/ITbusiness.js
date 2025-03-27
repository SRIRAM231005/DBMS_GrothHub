const express = require("express");
const {ITbusiness, ITUserProjects, ITUserEmployees, ITProjectsEmployees, ITEmployeesFire, ITEmployeesHire, ITEmployeesAfterHire, showDevList, HireSelectedEmployees,BusEmpPrjStart,getPrjProgressCount} = require('../controller/ITbusiness_control');

const ITbusinessRouter = express.Router();

ITbusinessRouter.route('/ITmainbusiness').post(ITbusiness);
ITbusinessRouter.route('/ITUserProjects').post(ITUserProjects);
ITbusinessRouter.route('/ITUserEmployees').post(ITUserEmployees);
ITbusinessRouter.route('/ITProjectsEmployees').post(ITProjectsEmployees);
ITbusinessRouter.route('/ITEmployeesFire').post(ITEmployeesFire);
ITbusinessRouter.route('/ITEmployeesHire').post(ITEmployeesHire);
ITbusinessRouter.route('/ITEmployeesAfterHire').post(ITEmployeesAfterHire);
ITbusinessRouter.route('/showDevList').post(showDevList);
ITbusinessRouter.route('/HireSelectedEmployees').post(HireSelectedEmployees);  
ITbusinessRouter.route('/BusEmpPrjStart').post(BusEmpPrjStart);
ITbusinessRouter.route('/getPrjProgressCount').post(getPrjProgressCount);

module.exports = ITbusinessRouter