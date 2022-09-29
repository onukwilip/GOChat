USE [GOChat]
GO

/****** Object:  StoredProcedure [dbo].[Accept_Request_User_User]    Script Date: 9/29/2022 1:56:34 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER procedure [dbo].[Accept_Request_User_User]
(
	@UserID varchar(max),
	@From_ID varchar(max),
	@ID int,
	@ChatRoomID varchar(max),
	@To_ID varchar(max),
	@IPAddress varchar(max)
)
as
begin
	--CHECK IF USER IS LOGGED IN
	Declare @IPExists int=(Select dbo.CheckIPExists(@IPAddress, @UserID)), @Member varchar(max)='';

	--IF USER IS LOGGED IN
	if(@IPExists=1)
		begin
			--SELECTS IF CHATROOM_MEMBERS OF EITHER MEMBERS EXISTS
			Select 
			@Member=@Member + MemberId + ', ' 
			from ChatRoomMembers 
			where (MemberId=@From_ID and IdentityToRender=@To_ID) 
			or (MemberId=@To_ID and IdentityToRender=@From_ID);

			--IF THEY DON'T EXIST
			if(@Member = '')
				begin
					--CREATE A NEW PRIVATE CHATROOM 
					Insert into ChatRoom
					(
					 ChatRoomID,
					 ChatRoomName,
					 ChatRoomType,
					 DateCreated
					)
					values
					(
					 @ChatRoomID,
					 'Private Chatroom',
					 'Private',
					 GETDATE()
					);

					--CREATE TWO NEW CHATROOM MEMBERS
					Insert into ChatRoomMembers
					(
					 MemberId,
					 IdentityToRender,
					 ChatRoomID,
					 ChatRoomRole
					)
					values
					(
					 @From_ID,
					 @To_ID,
					 @ChatRoomID,
					 'Member'
					)

					Insert into ChatRoomMembers
					(
					 MemberId,
					 IdentityToRender,
					 ChatRoomID,
					 ChatRoomRole
					)
					values
					(
					 @To_ID,
					 @From_ID,
					 @ChatRoomID,
					 'Member'
					)

					--DELETE REQUEST FROM DATABASE
					Delete from Requests where id=@ID;
				end;

			--ELSE IF THEY EXIST
			else
				begin
					return 0;
				end;
		end;

	--ELSE IF YOU AREN'T LOGGED IN
	else
		begin
			return 0;
		end;
end;
GO

