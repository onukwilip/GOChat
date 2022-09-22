CREATE PROCEDURE LogIPAddress
	(
	@IPAddress varchar(max),
	@City varchar(max),
	@Country_code varchar(max),
	@Country_name varchar(max),
	@Latitude float,
	@Longitude float,
	@State varchar(max),
	@UserId varchar(max)
	)
AS
begin
	declare @IP int;
	set @IP=(select dbo.CheckIPExists(@IPAddress, @UserId));
	if(@IP = 0)
		begin
			INSERT INTO LogUser(IPAddress, City, Country_code, Country_name, Latitude, Longitude, _State, UserId, loginDate) 
			VALUES(@IPAddress, @City, @Country_code, @Country_name, @Latitude, @Longitude, @State, @UserId, GETDATE());
		end;
	else
		begin
			UPDATE LogUser SET IPAddress=@IPAddress,
							   City=@City,
							   Country_code=@Country_code,
							   Country_name=@Country_name,
							   Latitude=@Latitude,
							   Longitude=@Longitude,
							   _State=@State,
							   UserId=@UserId,
							   loginDate=GETDATE()
							   WHERE UserId=@UserId;
		end;
end

