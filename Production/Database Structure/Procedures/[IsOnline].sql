USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[IsOnline]    Script Date: 9/29/2022 3:08:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER proc [dbo].[IsOnline](
@UserID varchar(max),
@IsOnline varchar(max)
)
as
begin
	update Users set IsOnline=@IsOnline where UserID=@UserID;
end;