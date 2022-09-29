USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[LastSeen]    Script Date: 9/29/2022 3:08:20 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER proc [dbo].[LastSeen](@UserId varchar(max), @LastSeen datetime)
as
begin
	update Users set LastSeen=@LastSeen where UserID=@UserId;
end;