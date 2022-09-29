USE [GOChat]
GO

/****** Object:  Table [dbo].[IgnoredFellas]    Script Date: 9/29/2022 3:14:53 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[IgnoredFellas](
	[ID] [int] IDENTITY(1000,1) NOT NULL,
	[MemberID] [varchar](max) NULL,
	[IdentityToRender] [varchar](max) NULL,
	[ChatRoomID] [varchar](max) NULL,
	[DateIgnored] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


