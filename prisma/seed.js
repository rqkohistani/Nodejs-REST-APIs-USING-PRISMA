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

    console.log('Create 1 author with 2 quotes: ', newCustomer);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

addNewCustomerWithPost();
