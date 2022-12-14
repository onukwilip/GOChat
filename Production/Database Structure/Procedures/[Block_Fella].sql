USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[Block_Fella]    Script Date: 9/29/2022 1:58:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[Block_Fella]
(
	@From_ID varchar(max),
	@To_ID varchar(max),
	@UserID varchar(max),
	@IPAddress varchar(max)
)
as
begin
	declare 
	@IPExists int=(select dbo.CheckIPExists(@IPAddress, @UserID)),
	@ChatRoomID varchar(max)='',
	@Type varchar(max)='';
	
	if(@IPExists = 1)
		begin
			Select top(1)
			@ChatRoomID=ChatroomID
			from ChatRoomMembers
			where (MemberId=@From_ID and IdentityToRender=@To_ID) 
			or (MemberId=@To_ID and IdentityToRender=@From_ID);

			Select top(1) 
			@Type=ChatRoomType 
			from ChatRoom
			where ChatRoomID=@ChatRoomID

			if(@Type='Private')
				begin
					Delete from ChatRoom where ChatRoomID=@ChatRoomID;
					Delete from Chats where ChatRoomID=@ChatRoomID;
					Delete from ChatRoomMembers where ChatRoomID=@ChatRoomID;
					Delete from ChatFile where ChatRoomID=@ChatRoomID;
				end;
			else
				begin
					return 0;
				end;
		end;
	else
		begin
			return 0;
		end;
end;