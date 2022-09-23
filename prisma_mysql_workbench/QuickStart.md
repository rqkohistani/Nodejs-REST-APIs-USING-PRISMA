<!-- https://blog.appsignal.com/2021/07/21/how-to-get-started-with-prisma-orm-for-nodejs-and-postgresql.html -->

<!-- https://dev.to/inezabonte/setting-up-a-mysql-database-using-prisma-2869 -->
<!-- https://www.prisma.io/docs/concepts/components/prisma-client/crud -->
# Prisma

1. `npm init -y`
1. `npm i express`
1. `npm i nodemon --save`
1. `npm i dotenv`
1. `.env` file
1. `npm install @faker-js/faker`
1. Confingure mysql workbench
    1. `Create a new connection "mysql_prisma"`
    1. `Create a new database "mysql_prisma"`

    1. ```sql
        CREATE DATABASE IF NOT EXISTS mysql_prisma;
        USE mysql_prisma;

        CREATE TABLE IF NOT EXISTS `customers` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `name` VARCHAR(50) NOT NULL,
        `username` VARCHAR(50) NOT NULL UNIQUE,
        `email` VARCHAR(50) UNIQUE,
        `password` VARCHAR(255)  ,
        `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP);

        CREATE TABLE IF NOT EXISTS `posts` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `customerId` int NOT NULL,
        `title` VARCHAR(255) NOT NULL,
        `body` TEXT NOT NULL,
        `published` BOOLEAN  DEFAULT false,
        `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updatedAt` TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,   
        FOREIGN KEY (customerId) REFERENCES customers(id));

        INSERT INTO `customers` (`name`,`username`,`email`,`password`) VALUES
        ('Quincy','Ewell42','Kristy.Kirlin54@hotmail.com','password'), 
        ('Richie', 'Josiane.Okuneva', 'Bobby65@yahoo.com','ZVSzQtsi6hww9t4'),
        ('Brad', 'Hugh.Huel', 'Javier.Aufderhar@gmail.com','E9RWbXUc8DrVbhq');


        INSERT INTO `posts` (`customerId`,`title`,`body`) VALUES 
        ( 1,'title1','body of title 1'),(1, 'title2','body of title 2'),
        (1,'eaque debitis labore', 'id quia tenetur magni consequatur minus       tempora voluptatem'),
        (1,'ipsa quibusdam deserunt', 'voluptate ad explicabo rerum quasi       temporibus consequatur numquam'),
        (2,'nam ut libero', 'qui laboriosam cum porro nihil adipisci iusto      veniam'),
        (3,'qui est itaque', 'voluptate illum tempore quae veniam amet      quisquam omnis'),
        (3,'id sint quia', 'neque delectus quo repellendus nisi ducimus alias       odio');
  
        SELECT * FROM customers;
        SELECT * FROM posts;

        ```

1. `npm i prisma --save`
    1. It will install Prisma as a dev dependency
1. `npx prisma init`
    1. This will initialize the Prisma schema file
1. Go to schema.prisma and replace the following:

```js
datasource db {
provider = "mysql"
url      = env("DATABASE_URL")
}

```

1. Go to .env file and add the following:

```js
DATABASE_URL="mysql://root:password@localhost:3mysql_prisma"

```

1. Run `npx prisma db pull` to turn your database schema into a Prisma schema. Database schema is converted into Prisma schema
It will create a new file called `schema.prisma` with all the tables and columns from your database.
1. Add the following table into `schema.prisma` file:

```sql
model admin {
id        Int      @id @default(autoincrement())
name      String   @db.VarChar(50)
email     String?  @unique(map: "email") @db.VarChar(50)
password  String?  @db.VarChar(255)
createdAt DateTime @default(now()) @db.Timestamp(0)
updatedAt DateTime @default(now()) @db.Timestamp(0)
}

```

1. To convert these models into mysql database tables, run the following command:
1. Run `npx prisma migrate dev --name init` to push the Prisma schema to the database
1. Run `npx prisma studio` to open the Prisma Studio GUI
1. **All data has been erased from the database**.
1. [Mysql quick setup link](https://www.prisma.io/docs/concepts/database-connectors/mysql).

## Seeding script

1. Create a `seed.js` file in the prisma directory

1. Open the package.json of your project
1. Add the following example to it:

```js
  "prisma": {
    "seed": "node prisma/seed.js"
  },
```

## Add the following code to the seed.js file

```js
// import faker
const { faker } = require('@faker-js/faker');
// https://fakerjs.dev/guide/

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
// Seeding the database
async function addNewCustomer() {
  try {
    const newCustomer = await prisma.customers.upsert({
      where: { username: 'Johndoe' },
      update: {},
      create: {
        name: 'John Doe',
        username: 'Johndoe',
        email: 'john@example.com',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Create 1 author with 2 quotes: ', newCustomer);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// addNewCustomer()

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

    console.log('Create 1 author with 2 quotes: ', newCustomer);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// addNewCustomerWithPost()

async function addNewCustomersWithPosts() {
  try {
    const username = faker.internet.userName();
    const newCustomer = await prisma.customers.upsert({
      where: { username },
      update: {},
      create: {
        name: faker.name.fullName(),
        username,
        email: faker.internet.email(),
        password: faker.internet.password(),
        createdAt: new Date(),
        updatedAt: new Date(),
        posts: {
          create: {
            title: faker.lorem.sentence(3),
            body: faker.lorem.sentence(8),
          },
        },
      },
    });

    console.log('Create 1 author with 1 quote: ', newCustomer);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addNewCustomersWithPosts();

```

## `npx prisma db seed`

This will seed the database with the data from the seed.js file

```js
Create 1 author with 1 quote:  {
id: 1,
name: 'Mrs. Morris Green',
username: 'Juwan.Rodriguez',
email: 'Verna_Gibson@hotmail.com',
password: 'syKvCcircNUCto0',
createdAt: 2022-09-20T08:44:57.000Z,
updatedAt: 2022-09-20T08:44:57.000Z
}

```

## Create customer and post via Postman

### No validation yet make sure correct data is sent to the server username and email must be unique

1. Create index.js file in the root directory and add the following code:

```js
   /* eslint-disable no-console */
const express = require('express');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

app.get('/', (req, res) => {
  res.json({ message: 'alive' });
});

app.get('/customers', async (req, res) => {
  const allCustomers = await prisma.customers.findMany({
    include: { posts: true },
  });
  res.json(allCustomers);
});

app.get('/posts', async (req, res) => {
  const allPosts = await prisma.posts.findMany({
    // include: { customers: true },
  });

  res.json(allPosts);
});

app.post('/customers', async (req, res) => {
  const { name, username, email, password } = req.body;
  const newCustomer = await prisma.customers.create({
    data: {
      name,
      username,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log(newCustomer);
  res.json(newCustomer);
});

app.post('/posts', async (req, res) => {
  const { posts } = req.body;
  const id = parseInt(req.body.id, 10);

  if (!id || !posts) {
    return res.status(400).json({ message: 'Either id or post   is missing' });
  }

  try {
    const message = 'Post created successfully';
    // get the customer with the id
    const customer = await prisma.customers.findUnique({
      where: { id },
    });

    console.log('customer:', customer);

    if (!customer) {
      return res.status(400).json({ message: 'Customer does not exist' });
    }

    // create a new post with an existing customer
    await prisma.posts.create({
      data: {
        title: posts.title,
        body: posts.body,
        customers: {
          connect: { id },
        },
      },
    });

    return res.json({ message });
  } catch (error) {
    console.log('error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Listening to requests on port ${port}`);
});


```

1. Add the following code to the package.json file

```js
  "scripts": {
    "start": "nodemon index.js",
  },
```

1. Run `npm start` to start the server
1. Open Postman
1. Get: `http://localhost:3000/customers`
1. Get: `http://localhost:3000/posts`
1. Post: `http://localhost:3000/posts`
  
  ```json
 {
    "id": "2",
    "posts": {
        "title": "Title 1 postman",
        "body": "body 1 postman"
    }
}
  ```

  ```js
  customer: {
  id: 2,
  name: 'Ms. Lowell VonRueden',
  username: 'Hillary.Streich',
  email: 'Kristofer_Larkin41@gmail.com',
  password: '1pIlIhjb8JG7yrZ',
  createdAt: 2022-09-20T09:13:51.000Z,
  updatedAt: 2022-09-20T09:13:51.000Z
}
  ```

  ```json
  {
    "message": "Post created successfully"
}
  ```

1. post: `http://localhost:3000/customers`
  
  ```json
  {
    "name": "PostMan Customer",
    "username": "postmanCustomer1",
    "email": "postmanCustomer1@gmail.com",
    "password": "password",
   
}
  ```

  ```json
  {
    "message": "Post created successfully"
}
  ```
