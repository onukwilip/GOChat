USE [GOChat]
GO

/****** Object:  Table [dbo].[Requests]    Script Date: 9/29/2022 3:15:17 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Requests](
	[id] [int] IDENTITY(1000,1) NOT FOR REPLICATION NOT NULL,
	[From_ID] [varchar](max) NOT NULL,
	[To_ID] [varchar](max) NOT NULL,
	[_Message] [varchar](max) NULL,
	[From_Type] [varchar](max) NULL,
	[To_Type] [varchar](max) NULL,
 CONSTRAINT [PK_Requests] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


