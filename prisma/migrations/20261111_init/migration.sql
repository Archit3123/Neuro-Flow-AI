BEGIN TRY

BEGIN TRAN;

-- CreateSchema
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'dbo') EXEC sp_executesql N'CREATE SCHEMA [dbo];';

-- CreateTable
CREATE TABLE [dbo].[Task] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(max) NOT NULL CONSTRAINT [Task_description_df] DEFAULT '',
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Task_status_df] DEFAULT 'todo',
    [priority] NVARCHAR(1000) NOT NULL CONSTRAINT [Task_priority_df] DEFAULT 'medium',
    [duration] INT NOT NULL CONSTRAINT [Task_duration_df] DEFAULT 30,
    [dueDate] DATETIME2,
    [scheduledAt] DATETIME2,
    [tags] NVARCHAR(1000) NOT NULL CONSTRAINT [Task_tags_df] DEFAULT '[]',
    [source] NVARCHAR(1000) NOT NULL CONSTRAINT [Task_source_df] DEFAULT 'manual',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Task_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Task_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Meeting] (
    [id] NVARCHAR(1000) NOT NULL,
    [transcript] NVARCHAR(max) NOT NULL,
    [summary] NVARCHAR(max) NOT NULL,
    [keyPoints] NVARCHAR(max) NOT NULL CONSTRAINT [Meeting_keyPoints_df] DEFAULT '[]',
    [actionItems] NVARCHAR(max) NOT NULL CONSTRAINT [Meeting_actionItems_df] DEFAULT '[]',
    [sourceName] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Meeting_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Meeting_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
