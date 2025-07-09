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
    `index` INT NOT NULL AUTO_INCREMENT UNIQUE, 
    Username VARCHAR(255),
    BusinessName VARCHAR(255),
    Wages decimal(10,2) default 0,
    Revenue decimal(10,2) default 0,
    PRIMARY KEY (Username, BusinessName)
);

CREATE TABLE IF NOT EXISTS BankBusiness (
    `index` INT NOT NULL AUTO_INCREMENT UNIQUE,
    Username VARCHAR(255) NOT NULL,
    BusinessName VARCHAR(20) NOT NULL,
    Revenue DECIMAL(10,2) DEFAULT 0.00,
    CreditInt DECIMAL(10,2) DEFAULT 3.00,
    DebitInt DECIMAL(10,2) DEFAULT 4.00,
    TotalAmount DECIMAL(10,2) DEFAULT 0.00,
    IntSetTime DATETIME,
    TotalCredits DECIMAL(10,2) DEFAULT 0.00,
    TotalDeposits DECIMAL(10,2) DEFAULT 0.00,
    PRIMARY KEY (Username, BusinessName)
);


CREATE TABLE IF NOT EXISTS ItProjects(
    Projectname VARCHAR(255) PRIMARY KEY,
    NoOfDev int,
    NoOfDesigner int,
    NoOfTeamLeader int,
    NoOfTester int,
    TimeTaken int,
    Cost int
);

INSERT INTO ItProjects (Projectname, NoOfDev, NoOfDesigner, NoOfTeamLeader, NoOfTester, TimeTaken, Cost) VALUES
('Inventory Tracker', 20, 10, 9, 5, 1, 3000),
('E-Commerce Website', 30, 12, 9, 7, 1, 3500),
('Mobile Game App', 25, 14, 9, 6, 1, 3200),
('AI Chatbot System', 40, 10, 9, 6, 1, 3900),
('Online Learning Portal', 35, 13, 9, 7, 1, 4000);

CREATE TABLE IF NOT EXISTS ItUserProjects(
    Username VARCHAR(255),
    BusinessName varchar(20),
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

INSERT INTO ItEmployees (Employeename, Role, Salary, Skill) VALUES
('Arjun Reddy', 'Junior Developers', 400, 6),
('Liam Smith', 'Junior Developers', 420, 7),
('Ravi Sharma', 'Middle Developers', 600, 8),
('Carlos Diaz', 'Middle Developers', 620, 7),
('Amit Verma', 'Senior Developers', 700, 9),
('Takeshi Nakamura', 'Senior Developers', 700, 9),
('Sophie Dubois', 'Designers', 500, 7),
('Priya Das', 'Designers', 520, 8),
('Rahul Bhat', 'Team Leaders', 700, 9),
('Emily Johnson', 'Testers', 480, 7);

CREATE TABLE IF NOT EXISTS ItUserEmployees(
    Username VARCHAR(255),
    BusinessName VARCHAR(255),
    Employeename VARCHAR(255),
    EmpStatusPrj int default 0,
    PrjName varchar(50),
    primary key(Username,BusinessName,Employeename)
);

CREATE TABLE IF NOT EXISTS CompaniesWithStocks(
    CompanyName VARCHAR(255),
    symbol VARCHAR(255),
    logo VARCHAR(255),
    Valuation decimal(10,2),
    SharesAvailable int
);

INSERT INTO CompaniesWithStocks (CompanyName, symbol, logo, Valuation, SharesAvailable) VALUES
('NVIDIA', 'NVDA', 'https://logo.clearbit.com/nvidia.com', 9000000.00, 9500),
('Tesla', 'TSLA', 'https://logo.clearbit.com/tesla.com', 8000000.00, 5000),
('Google', 'GOOGL', 'https://logo.clearbit.com/google.com', 12000000.00, 8000),
('Apple', 'AAPL', 'https://logo.clearbit.com/apple.com', 15000000.00, 6000),
('Amazon', 'AMZN', 'https://logo.clearbit.com/amazon.com', 13000000.00, 7000);


CREATE TABLE IF NOT EXISTS UserInvestments(
    `index` int primary key auto_increment,
    Username VARCHAR(255),
    CompanyName VARCHAR(255),
    buyPrice DECIMAL(10,2) NOT NULL,
    sharesOwned int,
    currentSharePrice DECIMAL(10,2)
);

 create table RealEstateMain(
    idx int primary key auto_increment, 
    image varchar(200), 
    price decimal(15,2), 
    location varchar(100), 
    incPerHr decimal(12,2)
);

INSERT INTO RealEstateMain (image, price, location, incPerHr) VALUES
('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbTivD_oysH73VO_08cHk5gK5lMsl4wWAIuEUQZRFDAoZ0s6tjibEl2-g&s=10', 250000.00, 'New York', 1200.50),
('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTldDsTspdf2S0VCtAI2DrTgyBD7s2gpKFQjhyQSe6bQhY2-ZWVzGtKHi76&s=10', 180000.00, 'San Francisco', 980.00),
('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0oNYhkXq1CGmcnJpCOzWryfUq8_F_x8TaQd-xev941-CfFokJY06D-aM&s=10', 300000.00, 'Los Angeles', 1500.75),
('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxwAvmb2789pNH7nzxS-u1a0rJaFojzs5apS7XLfkktmTfqBnvEGMMHKr6&s=10', 210000.00, 'Chicago', 1100.00);

 create table UserRealEstate(
    username varchar(20), 
    idx int, 
    primary key(username,idx)
);

