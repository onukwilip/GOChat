USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[GetUserByID]    Script Date: 9/29/2022 3:07:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER proc [dbo].[GetUserByID]
(
@UserID varchar(max),
@IPAddress varchar(max)
)
as
begin
	declare @IP varchar(max);
	set @IP='';
	select @IP=@IP+IPAddress+', ' from LogUser where UserId=@UserID and IPAddress=@IPAddress;

	if(@IP='')
		begin 
			return 0;
		end;
	else
		begin 
			select * from Users where UserID=@UserID;
		end;
end;