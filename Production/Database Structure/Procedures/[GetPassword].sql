USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[GetPassword]    Script Date: 9/29/2022 1:59:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[GetPassword](@UserID varchar(max), @IPAddress varchar(max))
as
begin
	declare @IPExists int=(select dbo.CheckIPExists(@IPAddress, @UserID));
	
	if(@IPExists = 1)
		begin
			SELECT PWord FROM Users WHERE UserID=@UserID;
		end;

	else
		begin
			return 0;
		end;
end;