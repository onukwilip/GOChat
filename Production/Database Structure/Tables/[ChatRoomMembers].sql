USE [GOChat]
GO

/****** Object:  Table [dbo].[ChatRoomMembers]    Script Date: 9/29/2022 3:14:36 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ChatRoomMembers](
	[Id] [int] IDENTITY(1000,1) NOT NULL,
	[MemberId] [varchar](max) NULL,
	[IdentityToRender] [varchar](max) NULL,
	[ChatRoomID] [varchar](max) NULL,
	[ChatRoomRole] [varchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


