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
      where: { username: 'Johndoe2' },
      update: {},
      create: {
        name: 'John Doe',
        username: 'Johndoe2',
        email: 'john2@example.com',
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

    console.log('Create 1 customer with 2 post: ', newCustomer);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// addNewCustomerWithPost();

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

createAdmin();
createUser();
addNewCustomersWithPosts();
