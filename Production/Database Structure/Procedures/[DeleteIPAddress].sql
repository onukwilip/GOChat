USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[DeleteIPAddress]    Script Date: 9/29/2022 1:58:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER proc [dbo].[DeleteIPAddress](
@UserID varchar(max),
@IPAddress varchar(max)
)
as
begin
	DELETE FROM LogUser WHERE UserId=@UserID AND IPAddress=@IPAddress;
end;