USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[GetAllUsers]    Script Date: 9/29/2022 1:59:04 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[GetAllUsers](@IPAddress varchar(max), @UserID varchar(max))
as
begin
	declare @IPExists int=(select dbo.CheckIPExists(@IPAddress, @UserID));
	
	if(@IPExists = 1)
		begin
			 SELECT * FROM Users;
		end;

	else
		begin
			return 0;
		end;
end;
