USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[GetChatRoom_Group]    Script Date: 9/29/2022 1:59:07 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[GetChatRoom_Group]
as
begin
	select * from ChatRoom where ChatRoomType='group';
end;