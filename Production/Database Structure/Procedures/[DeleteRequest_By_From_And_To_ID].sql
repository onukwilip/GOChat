USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[DeleteRequest_By_From_And_To_ID]    Script Date: 9/29/2022 1:58:57 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[DeleteRequest_By_From_And_To_ID]
(
	@UserID varchar(max),
	@IPAddress varchar(max),
	@From_ID varchar(max),
	@To_ID varchar(max)
)
as
begin
	declare @IP varchar(max);
	declare @IPExists int=(select dbo.CheckIPExists(@IPAddress, @UserID));
	
	if(@IPExists = 1)
		begin
			DELETE FROM Requests WHERE From_ID=@From_ID and To_ID=@To_ID;
		end;
	else
		begin
			return 0;
		end;
end;