USE [GOChat]
GO

/****** Object:  Table [dbo].[Users]    Script Date: 9/29/2022 3:15:25 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Users](
	[ID] [int] IDENTITY(1000,1) NOT NULL,
	[UserID] [varchar](max) NULL,
	[UserName] [varchar](max) NULL,
	[PWord] [varchar](max) NULL,
	[Email] [varchar](max) NULL,
	[Authenticated] [varchar](max) NULL,
	[ConfirmCode] [varchar](max) NULL,
	[DateCreated] [datetime] NULL,
	[IsOnline] [varchar](50) NULL,
	[LastSeen] [datetime] NULL,
	[ProfilePicture] [varbinary](max) NULL,
	[Description] [nvarchar](max) NULL,
 CONSTRAINT [PK__tmp_ms_x__3214EC27B45A870F] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


