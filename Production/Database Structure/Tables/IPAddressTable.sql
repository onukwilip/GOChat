--CREATE LOG TABLE TO LOG USER IN WITH IP ADDRESS
create Table LogUser(
	Id int not null identity(1000,1) primary key,
	IPAddress varchar(max),
	City varchar(max),
	Country_code varchar(max),
	Country_name varchar(max),
	Latitude float,
	Longitude float,
	loginDate datetime,
	logoutdate datetime,
	State varchar(max)
);