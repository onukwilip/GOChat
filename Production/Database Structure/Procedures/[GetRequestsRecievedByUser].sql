USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[GetRequestsRecievedByUser]    Script Date: 9/29/2022 1:59:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[GetRequestsRecievedByUser]
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
			SELECT * FROM Requests WHERE To_ID=@UserID;
		end;
	else
		begin
			return 0;
		end;
end;