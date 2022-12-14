USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[GetUserRequests_Group_User]    Script Date: 9/29/2022 3:07:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[GetUserRequests_Group_User]
(
	@ID int
)
as
begin
			 select
			 req.From_ID,
			 req.To_ID,
			 req.id,
			 req._Message,
			 req.From_Type,
			 req.To_Type,
			 fr.ChatRoomID as From_UserID,
			 fr.ChatRoomName as From_UserName,
			 fr.ChatRoomName as From_Email,
			 fr.ChatRoomPicture as From_ProfilePicture,
			 fr.ChatRoomName as From_IsOnline,
			 fr.ChatRoomName as From_Description,
			 fr.ChatRoomName as From_Authenticated,
			 fr.ChatRoomType as From_ChatRoomType,
			 _to.UserID as To_UserID,
			 _to.UserName as To_UserName,
			 _to.Email as To_Email,
			 _to.ProfilePicture as To_ProfilePicture,
			 _to.IsOnline as To_IsOnline,
			 _to.Description as To_Description,
			 _to.Authenticated as To_Authenticated,
			 _to.LastSeen as To_Lastseen
			 from Requests req
			 inner join ChatRoom fr
			 on req.From_ID=fr.ChatRoomID
			 inner join Users _to
			 on req.To_ID=_to.UserID
			 and req.id=@ID
			 --and req.From_ID=@UserID
			 --and fr.UserID=@UserID
end;