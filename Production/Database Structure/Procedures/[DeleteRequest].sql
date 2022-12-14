USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[DeleteRequest]    Script Date: 9/29/2022 1:58:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[DeleteRequest]
(
	@UserID varchar(max),
	@IPAddress varchar(max),
	@ID int
)
as
begin
	declare @IP varchar(max);
	declare @IPExists int=(select dbo.CheckIPExists(@IPAddress, @UserID));
	
	if(@IPExists = 1)
		begin
			DELETE FROM Requests WHERE id=@ID;
		end;
	else
		begin
			return 0;
		end;
end;