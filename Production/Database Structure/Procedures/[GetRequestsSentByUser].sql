USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[GetRequestsSentByUser]    Script Date: 9/29/2022 3:07:13 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[GetRequestsSentByUser]
(
	@UserID varchar(max),
	@IPAddress varchar(max)
)
as
begin
	declare @IP varchar(max);
	declare @IPExists int=(select dbo.CheckIPExists(@IPAddress, @UserID));
	
	if(@IPExists = 1)
		begin
			SELECT * FROM Requests WHERE From_ID=@UserID;
		end;
	else
		begin
			return 0;
		end;
end;