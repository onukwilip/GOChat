USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[GetUserRequests_User_Group]    Script Date: 9/29/2022 3:07:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[GetUserRequests_User_Group]
(
	@UserID varchar(max),
	@IPAddress varchar(max),
	@ID int
)
as
begin

	declare @IP varchar(max);
	declare @IPExists int=(select dbo.CheckIPExists(@IPAddress, @UserID));
	
	if(@IPExists = 1)
		begin
			 select
			 req.From_ID,
			 req.To_ID,
			 req.id,
			 req._Message,
			 req.Type,
			 fr.UserID as From_UserID,
			 fr.UserName as From_UserName,
			 fr.Email as From_Email,
			 fr.ProfilePicture as From_ProfilePicture,
			 fr.IsOnline as From_IsOnline,
			 fr.Description as From_Description,
			 fr.Authenticated as From_Authenticated,
			 fr.LastSeen as From_Lastseen,
			 _to.ChatRoomID as To_UserID,
			 _to.ChatRoomName as To_UserName,
			 _to.ChatRoomName as To_Email,
			 _to.ChatRoomPicture as To_ProfilePicture,
			 _to.ChatRoomName as To_IsOnline,
			 _to.ChatRoomName as To_Description,
			 _to.ChatRoomName as To_Authenticated,
			 _to.ChatRoomName as To_Lastseen
			 from Requests req
			 inner join Users fr
			 on req.From_ID=fr.UserID
			 inner join ChatRoom _to
			 on req.To_ID=_to.ChatRoomID
			 and req.id=@ID
			 --and req.From_ID=@UserID
			 --and fr.UserID=@UserID
		end;

	else
		begin
			return 0;
		end;
end;