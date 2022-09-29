USE [GOChat]
GO

/****** Object:  Table [dbo].[ChatRoom]    Script Date: 9/29/2022 3:14:03 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ChatRoom](
	[Id] [int] IDENTITY(1000,1) NOT NULL,
	[ChatRoomID] [varchar](max) NULL,
	[ChatRoomName] [varchar](max) NULL,
	[ChatRoomType] [varchar](max) NULL,
	[ChatRoomMembers] [varchar](max) NULL,
	[DateCreated] [datetime] NULL,
	[ChatRoomPicture] [varbinary](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


