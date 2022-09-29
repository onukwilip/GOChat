USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[eraseOTP]    Script Date: 9/29/2022 1:59:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER proc [dbo].[eraseOTP](@Email varchar(max))
as
begin
	Update Users set ConfirmCode=null where Email=@Email;
end;