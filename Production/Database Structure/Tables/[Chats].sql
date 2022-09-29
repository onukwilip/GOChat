USE [GOChat]
GO

/****** Object:  Table [dbo].[Chats]    Script Date: 9/29/2022 3:14:44 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Chats](
	[ChatID] [int] IDENTITY(1000,1) NOT NULL,
	[ChatType] [varchar](max) NULL,
	[ChatMessage] [varchar](max) NULL,
	[ChatRoomID] [varchar](max) NULL,
	[AuthorID] [varchar](max) NULL,
	[ParentID] [varchar](max) NULL,
	[DateSent] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ChatID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


