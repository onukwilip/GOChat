USE [GOChat]
GO
/****** Object:  StoredProcedure [dbo].[GetRequestByID]    Script Date: 9/29/2022 1:59:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER procedure [dbo].[GetRequestByID](@ID int)
as 
	begin
		Select top(1) * from Requests where @ID=id;
	end;