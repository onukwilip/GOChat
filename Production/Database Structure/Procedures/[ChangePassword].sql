USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[ChangePassword]    Script Date: 9/29/2022 1:58:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[ChangePassword](@UserID varchar(max), @IPAddress varchar(max), @Password varchar(max))
as
begin
	declare @IPExists int=(select dbo.CheckIPExists(@IPAddress, @UserID));
	
	if(@IPExists = 1)
		begin
			 UPDATE Users SET PWord=@Password WHERE UserID=@UserID;
		end;

	else
		begin
			return 0;
		end;
end;