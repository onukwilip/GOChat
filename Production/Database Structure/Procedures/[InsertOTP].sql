USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[InsertOTP]    Script Date: 9/29/2022 3:07:57 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER proc [dbo].[InsertOTP](@ConfirmCode varchar(max), @Email varchar(max))
as
begin
	Update Users set ConfirmCode=@ConfirmCode where Email=@Email;
end;
