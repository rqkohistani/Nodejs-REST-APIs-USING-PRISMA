/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Post] DROP CONSTRAINT [Post_authorId_fkey];

-- DropTable
DROP TABLE [dbo].[Post];

-- DropTable
DROP TABLE [dbo].[User];

-- CreateTable
CREATE TABLE [dbo].[Customers] (
    [CustomerId] INT NOT NULL,
    [Name] NVARCHAR(50) NOT NULL,
    [Location] NVARCHAR(50) NOT NULL,
    [Email] NVARCHAR(50) NOT NULL,
    CONSTRAINT [PK__Customer__A4AE64D87225A596] PRIMARY KEY CLUSTERED ([CustomerId])
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
