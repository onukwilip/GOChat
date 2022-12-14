USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[AcceptRequest]    Script Date: 9/29/2022 1:58:25 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[AcceptRequest]
	@ID int,
	@UserID VARCHAR(MAX),
	@IPAddress VARCHAR(MAX),
	@ChatRoomID VARCHAR(MAX)
AS
	BEGIN
		DECLARE @From_Type VARCHAR(MAX)='', 
		@To_Type VARCHAR(MAX)='',
		@To_ID VARCHAR(MAX)='',
		@From_ID VARCHAR(MAX)='',
		@ReturnValue INT;

		SELECT TOP(1) 
		@From_Type = From_Type,
		@To_Type = To_Type,
		@From_ID = From_ID,
		@To_ID = To_ID
		FROM Requests 
		WHERE id=@ID;

		IF(@From_Type='User' AND @To_Type='User')
			BEGIN
				EXECUTE Accept_Request_User_User @UserID, @From_ID, @ID, @ChatRoomID, @To_ID, @IPAddress;
				RETURN 1;
			END;

		IF(@From_Type='User' AND @To_Type='Group')
			BEGIN
				EXECUTE Accepted_Requests_User_Group @From_ID, @ID, @To_ID, @To_ID; 
				RETURN 1;
			END;

		IF(@From_Type='Group' AND @To_Type='User')
			BEGIN
				EXECUTE Accepted_Requests_Group_User @From_ID, @ID, @From_ID, @To_ID;
				RETURN 1;
			END;

		ELSE
			BEGIN
				RETURN 0;
			END;
	END;
