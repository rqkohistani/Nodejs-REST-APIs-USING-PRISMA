BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[customers] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] VARCHAR(50) NOT NULL,
    [username] VARCHAR(50) NOT NULL,
    [email] VARCHAR(50),
    [password] VARCHAR(255),
    [createdAt] DATETIME NOT NULL CONSTRAINT [customers_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [customers_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [customers_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [username] UNIQUE NONCLUSTERED ([username]),
    CONSTRAINT [email] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[posts] (
    [id] INT NOT NULL IDENTITY(1,1),
    [customerId] INT NOT NULL,
    [title] VARCHAR(255) NOT NULL,
    [body] TEXT NOT NULL,
    [published] BIT CONSTRAINT [posts_published_df] DEFAULT 0,
    [createdAt] DATETIME NOT NULL CONSTRAINT [posts_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [posts_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [posts_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[user] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fullName] NVARCHAR(100) NOT NULL,
    [email] VARCHAR(50) NOT NULL,
    [password] VARCHAR(255) NOT NULL,
    [createdAt] DATETIME NOT NULL CONSTRAINT [user_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [user_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [user_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [user_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [customerId] ON [dbo].[posts]([customerId]);

-- AddForeignKey
ALTER TABLE [dbo].[posts] ADD CONSTRAINT [posts_ibfk_1] FOREIGN KEY ([customerId]) REFERENCES [dbo].[customers]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
