USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[selectOTP]    Script Date: 9/29/2022 3:08:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER proc [dbo].[selectOTP](@Email varchar(max))
as
begin
	Select ConfirmCode from Users where Email=@Email;
end;