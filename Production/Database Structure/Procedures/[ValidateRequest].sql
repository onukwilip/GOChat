USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[ValidateRequest]    Script Date: 9/29/2022 3:08:46 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[ValidateRequest]
(
	@From_ID varchar(max),
	@To_ID varchar(max)
)
as
begin
	declare 
	@CheckRequestExists int, 
	@CheckChatRoomMember int;

	set @CheckRequestExists=
		(
			select 
			count(*) 
			from Requests 
			where From_ID=@From_ID 
			and To_ID=@To_ID
		);

	set @CheckChatRoomMember=
		(
			select
			count(*)
			from ChatRoomMembers
			where (MemberId=@From_ID and IdentityToRender=@To_ID) 
			or (MemberId=@To_ID and IdentityToRender=@From_ID)
		);

	

	if(@CheckRequestExists < 1 and @CheckChatRoomMember < 1)
		begin
			return 1;
		end

	if(@CheckRequestExists > 0)
		begin
			return 0;
		end

	if(@CheckChatRoomMember > 0)
		begin
			return -5;
		end
end;