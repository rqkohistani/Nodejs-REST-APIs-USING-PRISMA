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
