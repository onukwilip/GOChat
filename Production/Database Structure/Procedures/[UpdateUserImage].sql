USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[UpdateUserImage]    Script Date: 9/29/2022 3:08:42 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[UpdateUserImage](@UserId varchar(max), @IPAddress varchar(max), @ProfilePicture varbinary(max))
as
begin
    declare @IPExists int;
	set @IPExists=(select dbo.CheckIPExists(@IPAddress, @UserID));

	if(@IPExists = 1)
		begin
			UPDATE Users SET ProfilePicture=@ProfilePicture WHERE UserID=@UserID;
		end;
	else
		begin
			return 0;
		end;
end;