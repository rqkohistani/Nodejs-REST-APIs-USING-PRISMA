# PRISMA GUIDE

1. Prepair Database for Prisma
1. install the Prisma CLI as a development dependency in the project:

    ```bash
    npm install prisma --save-dev
    ```

1. Finally, set up Prisma with the init command of the Prisma CLI:
  
      ```bash
      npx prisma init
      ```

1. The init command will create a new prisma folder with the following files:
    - prisma/schema.prisma
    - prisma/.env
1. The schema.prisma file contains the database connection URL and the database schema. The .env file contains the database connection URL. The .env file is used by the Prisma Client to connect to the database.
1. The Prisma CLI will ask you to choose a database connector. For this guide, you will use the SQLite database connector. The Prisma CLI will then create a SQLite database file called dev.db in the prisma folder.
1. The Prisma CLI will also create a new Prisma Client instance in the node_modules/@prisma/client folder. The Prisma Client is a type-safe database client that you will use in your application code.

1. Change **DATABASE_URL in .env with new db name (nodejsPart3Prisma)**

```js
APPSETTING_DATABASE_URL="sqlserver://localhost:1433;database=nodejsPart3Prisma;initialCatalog=sample;integratedSecurity=true;trustServerCertificate=true;"
```

1. npx prisma db pull is used to introspect your database and update your Prisma schema. This command will create a new migration file in the prisma/migrations folder. The migration file will contain the changes that need to be applied to the database schema to match the Prisma schema.

     ```bash
    npx prisma db pull
    Introspected number of models: xx in xxms...
      ```

1. Lets add a table via Prisma

    ```prisma
    model User {
    id    Int     @id @default(autoincrement())
    email String  @unique
    name  String?
    posts Post[]
    }

    model Post {
      id        Int     @id @default(autoincrement())
      title     String
      content   String?
      published Boolean @default(false)
      author    User    @relation(fields: [authorId],   references: [id])
      authorId  Int
    }
    ```

1. Run a migration to create your database tables with Prisma Migrate
At this point, the database will be overwritten with the new schema. All data will be erased. To create the database tables, run the following command:

    ```bash
    npx prisma migrate dev --name init
    ```

### Seeding the database

1. Create a new file called seed.js in the prisma folder. This file will contain the seeding logic.
1. Open the package.json of your project
1. Add the following example to it:

    ```json
    "prisma": {
    "seed": "node prisma/seed.js"
    ```

### seed.js

```js
    import { PrismaClient } from '@prisma/client';

    const prisma = new PrismaClient();

    async function addNewCustomerWithPost() {
      try {
        const newCustomer = await prisma.customers.upsert({
          where: { username: 'Johndoe1' },
          update: {},
          create: {
            name: 'John Doe',
            username: 'Johndoe1',
            email: 'john1@example.com',
            password: 'password',
            createdAt: new Date(),
            updatedAt: new Date(),
            posts: {
              create: {
                title: 'Hello World',
                body: 'This is my first post',
              },
            },
          },
        });

        console.log('Create 1 customer with 1 post: ', newCustomer);
      } catch (error) {
        console.error(error);
        process.exit(1);
      } finally {
        await prisma.$disconnect();
      }
    }

addNewCustomerWithPost();
//  It should output the created customer with the post.
```

***

## Prepair Database for Prisma

Have db ready on azure database for sql server

1. Create a new connection to the database
1. Create a new database
1. Create a new table
1. Insert data into the table
1. Select data from the table

## Create a new connection to the database

```sql
USE master
GO
IF NOT EXISTS (
 SELECT name
 FROM sys.databases
 WHERE name = N'nodejsPart3Prisma'
)
 CREATE DATABASE [nodejsPart3Prisma];
GO
IF SERVERPROPERTY('ProductVersion') > '12'
 ALTER DATABASE [nodejsPart3Prisma] SET QUERY_STORE=ON;
GO

USE [nodejsPart3Prisma]
GO

```

### Insert data into the table

```sql
-- Create a new table called 'Customers' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.Customers', 'U') IS NOT NULL
 DROP TABLE dbo.Customers;
GO
-- Create the table in the specified schema
CREATE TABLE dbo.Customers
(
 CustomerId int NOT NULL PRIMARY KEY, -- primary key column
 Name nvarchar(50) NOT NULL,
 Location nvarchar(50) NOT NULL,
 Email nvarchar(50) NOT NULL
);
GO


-- Insert rows into table 'Customers'
INSERT INTO dbo.Customers
 ([CustomerId], [Name], [Location], [Email])
VALUES
 ( 1, N'Ram', N'Nepal', N'ram@hotmail.com'),
 ( 2, N'Sita', N'United States', N'sita@charpcorner.com'),
 ( 3, N'Hari', N'Nepal', N'hari@gmail.com'),
 ( 4, N'Geeta', N'India', N'geeta@hotmail.com'),
 ( 5, N'Chiu', N'Indonesia', N'chiu@hotmail.com')
GO


-- Select rows from table 'Customers'
SELECT * FROM dbo.Customers;

-- DROP TABLE dbo.Customers;

```
