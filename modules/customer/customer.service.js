import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getAllCustomers = async () => {
  const customers = await prisma.customers.findMany();
  return customers;
};

const getCustomer = async (id) => {
  const customer = await prisma.customers.findUnique({
    where: { id },
  });
  return customer;
};

const getCustomerByEmail = async (email) => {
  const customer = await prisma.customers.findUnique({
    where: { email },
  });
  return customer;
};

const createCustomer = async (customer) => {
  const newCustomer = await prisma.customers.create({
    data: {
      ...customer,
      password: bcrypt.hashSync(customer.password, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  if (!newCustomer) return null;
  return newCustomer;
};

const updateCustomer = async (customerId, upadateCustomer) => {
  const oldCustomer = await getCustomer(customerId);
  if (!oldCustomer) return null;
  const updatedCustomer = await prisma.customers.update({
    where: { id: customerId },
    data: {
      ...upadateCustomer,
      password: bcrypt.hashSync(upadateCustomer.password, 10),
      updatedAt: new Date(),
    },
  });
  return updatedCustomer;
};

const deleteCustomer = async (customerId) => {
  const deletedCustomer = await prisma.customers.delete({
    where: { id: customerId },
  });
  return deletedCustomer;
};

const customerService = {
  getAllCustomers,
  getCustomer,
  getCustomerByEmail,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};

export default customerService;
