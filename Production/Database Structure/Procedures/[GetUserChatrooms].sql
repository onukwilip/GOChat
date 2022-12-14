USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[GetUserChatrooms]    Script Date: 9/29/2022 3:40:16 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[GetUserChatrooms]
(
	@UserID varchar(max),
	@IPAddress varchar(max)
)
as
	begin
		Declare 
		@IPExists int=(select dbo.CheckIPExists(@IPAddress, @UserID)),
		@minCount int=0,
		@maxCount int=0;

		Declare 
		@Chatrooms Table
		(
		 ID int not null primary key identity(1000,1),
		 MemberID varchar(max),
		 IdentityToRender varchar(max),
		 ChatRoomID varchar(max),
		 ChatRoomName varchar(max),
		 ChatRoomPicture varbinary(max),
		 IsOnline varchar(max),
		 LastSeen datetime,
		 _Description varchar(max)
		);
	
		if(@IPExists = 1)
			begin
				--MAIN CODE
				Declare 
				@Type varchar(max)='';
				
				Select 
				@minCount=min(Id),
				@maxCount=max(Id) 
				from ChatRoomMembers 
				where MemberId=@UserID;

				While(@minCount <= @maxCount)
					begin
						Select top(1)
						@Type=ChatRoomType
						from ChatRoomMembers chm
						inner join ChatRoom ch
						on chm.ChatRoomID=ch.ChatRoomID
						and chm.Id=@minCount;

						if(@Type='Private')
							begin
								Insert into @Chatrooms
								(
								 MemberID,
								 IdentityToRender,
								 ChatRoomID,
								 ChatRoomName,
								 ChatRoomPicture,
								 _Description,
								 IsOnline,
								 LastSeen
								)
								Select
								chm.MemberId,
								chm.IdentityToRender,
								u.UserID,
								u.UserName,
								u.ProfilePicture,
								u.Description,
								u.IsOnline,
								u.LastSeen
								from ChatRoomMembers chm
								inner join Users u
								on chm.IdentityToRender=u.UserID
								and chm.Id=@minCount;
							end;

						if(@Type='Group')
							begin
								Insert into @Chatrooms
								(
								 MemberID,
								 IdentityToRender,
								 ChatRoomID,
								 ChatRoomName,
								 ChatRoomPicture,
								 _Description,
								 IsOnline,
								 LastSeen
								)
								Select
								chm.MemberId,
								chm.IdentityToRender,
								ch.ChatRoomID,
								ch.ChatRoomName,
								ch.ChatRoomPicture,
								'Group',
								'true',
								GETDATE()
								from ChatRoomMembers chm
								inner join ChatRoom ch
								on chm.IdentityToRender=ch.ChatRoomID
								and chm.Id=@minCount;
							end;

						set @minCount=@minCount+1;
					end;

				Select * from @Chatrooms;
				--END OF MAIN CODE
			end;
		else
			begin
				Select * from @Chatrooms;
			end;
	end;