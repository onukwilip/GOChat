USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[CheckUserLogin]    Script Date: 9/29/2022 1:58:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER proc [dbo].[CheckUserLogin](
@Email varchar(max)
)
as
begin
	select * from Users where Email=@Email;
end;
