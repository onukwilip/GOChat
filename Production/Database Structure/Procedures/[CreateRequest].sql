USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[CreateRequest]    Script Date: 9/29/2022 1:58:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[CreateRequest]
(
	@From_ID varchar(max),
	@To_ID varchar(max),
	@Message varchar(max),
	@From_Type varchar(max),
	@To_Type varchar(max)
)
as
begin
	declare 
	@CheckRequestExists varchar(max)='', 
	@CheckChatRoomMember varchar(max)='';

	select 
	@CheckRequestExists=@CheckRequestExists+From_ID+', ' 
	from Requests 
	where From_ID=@From_ID 
	and To_ID=@To_ID;

	select
	@CheckChatRoomMember=@CheckChatRoomMember+ MemberId + ', '
	from ChatRoomMembers
	where (MemberId=@From_ID and IdentityToRender=@To_ID) 
	or (MemberId=@To_ID and IdentityToRender=@From_ID);

	if(@CheckRequestExists='' and @CheckChatRoomMember='')
		begin
			insert into Requests(From_ID, To_ID, _Message, From_Type, To_Type) values(@From_ID, @To_ID, @Message, @From_Type, @To_Type);
		end
	else
		begin
			return 0;
		end
end;