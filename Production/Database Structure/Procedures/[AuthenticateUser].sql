USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[AuthenticateUser]    Script Date: 9/29/2022 1:58:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER proc [dbo].[AuthenticateUser](@Email varchar(max))
as
begin
	Update Users set ConfirmCode=null, Authenticated=1 where Email=@Email;
end;
