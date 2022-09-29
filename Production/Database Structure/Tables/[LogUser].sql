USE [GOChat]
GO

/****** Object:  Table [dbo].[LogUser]    Script Date: 9/29/2022 3:15:00 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[LogUser](
	[Id] [int] IDENTITY(1000,1) NOT NULL,
	[IPAddress] [varchar](max) NOT NULL,
	[City] [varchar](max) NULL,
	[Country_code] [varchar](max) NULL,
	[Country_name] [varchar](max) NULL,
	[Latitude] [float] NULL,
	[Longitude] [float] NULL,
	[loginDate] [datetime] NULL,
	[logoutdate] [datetime] NULL,
	[_State] [varchar](max) NULL,
	[UserId] [varchar](max) NOT NULL,
 CONSTRAINT [PK__LogUser__3214EC07A48B904A] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


