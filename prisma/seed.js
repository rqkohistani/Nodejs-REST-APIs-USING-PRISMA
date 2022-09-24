/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addNewCustomerWithPost() {
  try {
    const newCustomer = await prisma.customers.upsert({
      where: { username: 'Johndoe' },
      update: {},
      create: {
        name: 'John Doe',
        username: 'Johndoe',
        email: 'john@example.com',
        password: bcrypt.hashSync('password', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
        posts: {
          create: [
            {
              title: 'Hello World',
              body: 'This is my first post',
            },
            {
              title: 'Hello World',
              body: 'This is my first post',
            },
          ],
        },
      },
    });

    console.log('Create 1 customer with 2 post: ', newCustomer);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const createAdmin = async () => {
  try {
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('password', 10),
        userRole: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Create 1 admin: ', admin);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createUser = async () => {
  try {
    const user = await prisma.user.create({
      data: {
        name: 'User',
        email: 'user@gmail.com',
        password: bcrypt.hashSync('password', 10),
        userRole: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Create 1 user: ', user);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createManyUsers = async () => {
  try {
    const users = await prisma.user.createMany({
      data: [
        {
          name: 'SuperAdmin',
          email: 'superadmin@gmail.com',
          password: bcrypt.hashSync('password', 10),
          userRole: 'superAdmin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Admin',
          email: 'admin@gmail.com',
          password: bcrypt.hashSync('password', 10),
          userRole: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'User',
          email: 'user@gmail.com',
          password: bcrypt.hashSync('password', 10),
          userRole: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });
    console.log('New user Created: ', users);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createManyCustomersAndPosts = async () => {
  try {
    const username = faker.internet.userName();
    const createNewCustomersAndPosts = await prisma.customers.upsert({
      where: { username: faker.internet.userName() },
      update: {},
      create: {
        name: faker.name.firstName(),
        username,
        email: faker.internet.email(),
        password: bcrypt.hashSync('password', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
        posts: {
          create: [
            {
              title: faker.lorem.sentence(3),
              body: faker.lorem.sentence(8),
            },
            {
              title: faker.lorem.sentence(3),
              body: faker.lorem.sentence(8),
            },
          ],
        },
      },
    });

    console.log('New customer with posts: ', createNewCustomersAndPosts);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

// createAdmin();
// createUser();
// createManyUsers();
// addNewCustomerWithPost();
// createManyCustomersAndPosts();

const seed = async () => {
  try {
    await createManyUsers();
    for (let i = 0; i < 20; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await createManyCustomersAndPosts();
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};
seed();
