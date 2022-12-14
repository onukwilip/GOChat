USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[Ignore_Fella]    Script Date: 9/29/2022 3:07:53 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER Procedure [dbo].[Ignore_Fella]
(
	@UserID varchar(max),
	@IPAddress varchar(max),
	@RecipientID varchar(max)
)
as
begin
	declare 
	@IPExists int=(select dbo.CheckIPExists(@IPAddress, @UserID));
	
	if(@IPExists = 1)
		begin
			Insert into IgnoredFellas
			(
			 MemberID,
			 IdentityToRender,
			 ChatRoomID,
			 DateIgnored
			)
			select 
			MemberID,
			IdentityToRender,
			ChatRoomID,
			GETDATE()
			from ChatRoomMembers
			where MemberId=@UserID and IdentityToRender=@RecipientID;
			
			Delete from ChatRoomMembers
			where MemberId=@UserID and IdentityToRender=@RecipientID;
		end;
end;

select * from ChatRoom
select * from ChatRoomMembers
select * from IgnoredFellas