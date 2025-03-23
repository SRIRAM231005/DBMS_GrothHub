const express = require("express");
<<<<<<< Updated upstream
const {ITbusiness, ITUserProjects, ITUserEmployees, ITProjectsEmployees, ITEmployeesFire, ITEmployeesHire, ITEmployeesAfterHire, showDevList, HireSelectedEmployees,BusEmpPrjStart} = require('../controller/ITbusiness_control');
=======
const {ITbusiness, ITUserProjects, ITUserEmployees, ITProjectsEmployees, ITEmployeesFire, ITEmployeesHire, showDevList} = require('../controller/ITbusiness_control');
>>>>>>> Stashed changes

const ITbusinessRouter = express.Router();

ITbusinessRouter.route('/ITmainbusiness').post(ITbusiness);
ITbusinessRouter.route('/ITUserProjects').post(ITUserProjects);
ITbusinessRouter.route('/ITUserEmployees').post(ITUserEmployees);
ITbusinessRouter.route('/ITProjectsEmployees').post(ITProjectsEmployees);
ITbusinessRouter.route('/ITEmployeesFire').post(ITEmployeesFire);
ITbusinessRouter.route('/ITEmployeesHire').post(ITEmployeesHire);
<<<<<<< Updated upstream
ITbusinessRouter.route('/ITEmployeesAfterHire').post(ITEmployeesAfterHire);
ITbusinessRouter.route('/showDevList').post(showDevList);
ITbusinessRouter.route('/HireSelectedEmployees').post(HireSelectedEmployees);  
ITbusinessRouter.route('/BusEmpPrjStart').post(BusEmpPrjStart);
=======
ITbusinessRouter.route('/showDevList').post(showDevList);
>>>>>>> Stashed changes

module.exports = ITbusinessRouter