/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
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
    console.log('Create 1 customer with 2 post: ', newCustomer);
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
