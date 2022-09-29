 select
 ad.UserID,
 ad.UserName,
 lu.IPAddress,
 lu.Country_code
 from Users ad
 inner join 
 LogUser lu
 on ad.UserID=lu.UserId;

 select
 req.From_ID,
 req.To_ID,
 req.id,
 req._Message,
 fr.UserID as from_UserID,
 fr.UserName as from_UserName,
 fr.Email as from_Email,
 fr.ProfilePicture as from_ProfilePicture,
 fr.IsOnline as from_IsOnline,
 fr.Description as from_Description,
 fr.Authenticated as from_Authenticated,
 fr.LastSeen as from_Lastseen,
 _to.UserID as to_UserID,
 _to.UserName as to_UserName,
 _to.Email as to_Email,
 _to.ProfilePicture as to_ProfilePicture,
 _to.IsOnline as to_IsOnline,
 _to.Description as to_Description,
 _to.Authenticated as to_Authenticated,
 _to.LastSeen as to_Lastseen
 from Requests req
 inner join Users fr
 on req.From_ID=fr.UserID
 inner join Users _to
 on req.To_ID=_to.UserID

 insert into Requests(From_ID, To_ID) values('5f15cd52-75b4-4bfa-8797-0975756eccc1','be10982c-06bb-42f1-8a58-925b266a2317')