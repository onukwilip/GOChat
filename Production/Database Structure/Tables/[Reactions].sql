USE [GOChat]
GO

/****** Object:  Table [dbo].[Reactions]    Script Date: 9/29/2022 3:15:10 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Reactions](
	[ReactionID] [int] IDENTITY(1000,1) NOT NULL,
	[ReactionGroup] [varchar](max) NULL,
	[Reaction] [varchar](max) NULL,
	[UserID] [varchar](max) NULL,
	[CommentID] [varchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[ReactionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


