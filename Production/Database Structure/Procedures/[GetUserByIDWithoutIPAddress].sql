USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[GetUserByIDWithoutIPAddress]    Script Date: 9/29/2022 3:07:40 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[GetUserByIDWithoutIPAddress](@UserID VARCHAR(MAX))
AS
BEGIN
	SELECT * FROM Users WHERE UserID=@UserID;
END;