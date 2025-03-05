CREATE TABLE IF NOT EXISTS Users (
    Username VARCHAR(255) PRIMARY KEY,
    Password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Balances(
    Username VARCHAR(255) PRIMARY KEY, 
    Level int not null, 
    Total decimal(2) default 0, 
    Balance decimal(2) default 0, 
    Stocks decimal(2) default 0, 
    Business decimal(2) default 0, 
    Real_Estate decimal(2) default 0
);

CREATE TABLE IF NOT EXISTS Statitics(
    NoOfBusiness int not null, 
    Real_estate int, 
    BoughtCompanies int default 0, 
    E_business decimal(2) default 0, 
    E_rent decimal(2) default 0, 
    E_dividends decimal(2) default 0, 
    E_trading decimal(2) default 0
);
