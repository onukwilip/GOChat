alter function CheckIPExists(@IPAddress varchar(max), @UserID varchar(max))
returns int
as
begin
	declare @IP varchar(max), @ReturnValue int;
	set @IP='';
	select @IP = @IP + IPAddress + ', ' from LogUser where IPAddress=@IPAddress and UserId=@UserID;
	
	if(@IP = '')
		begin
			set @ReturnValue= 0;
		end;

	else
		begin 
			set @ReturnValue=1;
		end;

		return @ReturnValue;
end;
