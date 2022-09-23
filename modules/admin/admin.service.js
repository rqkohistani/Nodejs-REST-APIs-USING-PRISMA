import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const getAllAdmins = async () => {
  const admins = await prisma.user.findMany();
  return admins;
};

const getAdmin = async (id) => {
  const admin = await prisma.user.findUnique({
    where: { id },
  });
  return admin;
};

const createAdmin = async (admin) => {
  const newUser = await prisma.user.create({
    data: {
      ...admin,
      password: bcrypt.hashSync(admin.password, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  if (!newUser) return null;
  return newUser;
};

const deleteAdmin = async (id) => {
  const deletedAdmin = await prisma.user.delete({
    where: { id },
  });
  return deletedAdmin;
};

const updateAdmin = async (adminId, updateAdmin) => {
  const oldAdmin = await getAdmin(adminId);
  if (!oldAdmin) return null;
  const updatedAdmin = await prisma.user.update({
    where: { id: adminId },
    data: {
      ...updateAdmin,
      password: bcrypt.hashSync(updateAdmin.password, 10),
      updatedAt: new Date(),
    },
  });
  return updatedAdmin;
};

const getAdminByEmail = async (email) => {
  const admin = await prisma.user.findUnique({
    where: { email },
  });
  return admin;
};

const adminService = {
  createAdmin,
  getAllAdmins,
  getAdmin,
  deleteAdmin,
  updateAdmin,
  getAdminByEmail,
};

export default adminService;
