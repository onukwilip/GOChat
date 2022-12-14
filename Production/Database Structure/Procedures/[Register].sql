USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[Register]    Script Date: 9/29/2022 3:08:27 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER     proc [dbo].[Register]
(
@UserId varchar(max),
@UserName varchar(max),
@Password varchar(max),
@Email varchar(max),
@DateCreated datetime
)
as
begin
	 declare @UserDoesNotExist INT;

	 set @UserDoesNotExist=(SELECT dbo.CheckIfUserExists(@UserId, @Email))

	 if (@UserDoesNotExist = 1)
		 begin
			insert into Users(UserID, UserName, PWord, Email, Authenticated, DateCreated, LastSeen, IsOnline)
			values(@UserId, @UserName, @Password, @Email, 0, @DateCreated, GETDATE(), 'false');
			return 1;
		 end;
	 else
	 begin
		return 0;
	 end
end;