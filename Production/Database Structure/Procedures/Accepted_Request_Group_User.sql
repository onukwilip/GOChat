USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[Accepted_Requests_Group_User]    Script Date: 9/29/2022 1:56:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[Accepted_Requests_Group_User]
(
	@From_ID varchar(max),
	@ID int,
	@ChatRoomID varchar(max),
	@To_ID varchar(max)
)
as
begin
	Declare @Member varchar(max)='';

		--SELECTS IF CHATROOM_MEMBERS OF EITHER MEMBERS EXISTS
		Select 
		@Member=@Member + MemberId + ', ' 
		from ChatRoomMembers 
		where (MemberId=@To_ID and ChatRoomID=@ChatRoomID);

		if(@Member = '')
				begin
					--INSERT ONE MEMBER INTO THE CHATROOM_MEMBERS TABLE WITH CHATROOM ID AS THE GROUP/CHATROOM ID
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