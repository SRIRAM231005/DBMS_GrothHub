CREATE TABLE IF NOT EXISTS Users (
    Username VARCHAR(255) PRIMARY KEY,
    Password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Balances(
    Username VARCHAR(255) PRIMARY KEY, 
    Level int not null, 
    Total decimal(20,2) default 0, 
    Balance decimal(20,2) default 0, 
    Stocks decimal(20,2) default 0, 
    Business decimal(20,2) default 0, 
    Real_Estate decimal(20,2) default 0
);

CREATE TABLE IF NOT EXISTS Statistics(
    Username VARCHAR(255) PRIMARY KEY,
    NoOfBusiness int not null, 
    Real_estate int, 
    BoughtCompanies int default 0, 
    E_business decimal(10,2) default 0, 
    E_rent decimal(10,2) default 0, 
    E_dividends decimal(10,2) default 0, 
    E_trading decimal(10,2) default 0
);

CREATE TABLE IF NOT EXISTS Business(
    Business VARCHAR(255) PRIMARY KEY,
    SetupCost int
);

CREATE TABLE IF NOT EXISTS UserBusiness(
    Username VARCHAR(255),
    Business VARCHAR(255),
    Businessname VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS ItBusiness(
    Username VARCHAR(255) ,
    BusinessName VARCHAR(255),
    Wages decimal(10,2),
    Revenue decimal(10,2) default 0,
    PRIMARY KEY (Username, BusinessName)
);

CREATE TABLE IF NOT EXISTS ItProjects(
    Projectname VARCHAR(255) PRIMARY KEY,
    NoOfDev int,
    NoOfDesigner int,
    NoOfTeamLeader int,
    NoOfTester int,
    TimeTaken time,
    Cost int
);

CREATE TABLE IF NOT EXISTS ItUserProjects(
    Username VARCHAR(255),
    Projectname VARCHAR(255),
    ProjectStatus int default 0,
    ProjectCompTime datetime
);
-- ALTER TABLE ItUserProjects ADD COLUMN 

CREATE TABLE IF NOT EXISTS ItEmployees(
    Employeename VARCHAR(255) PRIMARY KEY,
    Role VARCHAR(255),
    Salary int,
    Skill int
);

CREATE TABLE IF NOT EXISTS ItUserEmployees(
    Username VARCHAR(255),
    BusinessName VARCHAR(255),
    Employeename VARCHAR(255),
    EmpStatusPrj int default 0
);

CREATE TABLE IF NOT EXISTS CompaniesWithStocks(
    CompanyName VARCHAR(255),
    symbol VARCHAR(255),
    logo VARCHAR(255),
    Valuation decimal(10,2),
    SharesAvailable int
);

CREATE TABLE IF NOT EXISTS UserInvestments(
    Username VARCHAR(255),
    CompanyName VARCHAR(255),
    buyPrice DECIMAL(10,2) NOT NULL,
    sharesOwned int,
    currentSharePrice DECIMAL(10,2)
);

