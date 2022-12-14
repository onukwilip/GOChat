USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[UpdateUser]    Script Date: 9/29/2022 3:08:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[UpdateUser](
@UserID VARCHAR(MAX), 
@Email VARCHAR(MAX),
@UserName VARCHAR(MAX),
@Description VARCHAR(MAX),
@IPAddress VARCHAR(MAX)
)
AS
BEGIN
	declare @EmailExists varchar(max), @IPExists int;
	set @EmailExists='';
	set @IPExists=(select dbo.CheckIPExists(@IPAddress, @UserID));

	select @EmailExists=@EmailExists + Email + ', ' from Users where Email=@Email and UserID != @UserID; 

	if(@EmailExists='' and @IPExists = 1)
		begin
			UPDATE Users SET UserName=@UserName, Email=@Email, Description= @Description WHERE UserID=@UserID;
		end;
	else
		begin
			return 0;
		end;
END;