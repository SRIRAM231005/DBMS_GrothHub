const express = require("express");
const {ITbusiness, GetITBusinessDetails, ITUserProjects, ITUserEmployees, ITProjectsEmployees, ITEmployeesFire, ITEmployeesHire, ITEmployeesAfterHire, showDevList, HireSelectedEmployees,BusEmpPrjStart,getPrjProgressCount,getPrjCompCount,PrjCompTimeAddition,getPrjProgress,getPrjComp,changeStatusStopProj,changeStatusCompProj} = require('../controller/ITbusiness_control');

const ITbusinessRouter = express.Router();

ITbusinessRouter.route('/ITmainbusiness').post(ITbusiness);
ITbusinessRouter.route('/GetITBusinessDetails').post(GetITBusinessDetails);
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
ITbusinessRouter.route('/PrjCompTimeAddition').post(PrjCompTimeAddition);
ITbusinessRouter.route('/getPrjCompCount').post(getPrjCompCount);
ITbusinessRouter.route('/getPrjComp').post(getPrjComp);
ITbusinessRouter.route('/getPrjProgress').post(getPrjProgress);
ITbusinessRouter.route('/changeStatusStopProj').post(changeStatusStopProj);
ITbusinessRouter.route('/changeStatusCompProj').post(changeStatusCompProj);

module.exports = ITbusinessRouter