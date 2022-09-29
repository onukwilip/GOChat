USE [GOChat]
GO

/****** Object:  Table [dbo].[ChatFile]    Script Date: 9/29/2022 3:13:51 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ChatFile](
	[FileName] [varchar](max) NULL,
	[FilePath] [varbinary](max) NOT NULL,
	[FileSize] [float] NOT NULL,
	[ID] [int] IDENTITY(1000,1) NOT NULL,
	[ChatID] [varchar](max) NOT NULL,
	[ChatRoomID] [varchar](max) NOT NULL,
 CONSTRAINT [PK_ChatFile] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


