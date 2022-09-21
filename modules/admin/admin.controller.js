import { HttpError } from '../../errors';
import adminService from './admin.service';

const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await adminService.getAllAdmins();
    return res.status(200).json(admins);
  } catch (error) {
    return next(error);
  }
};

const getAdmin = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const admin = await adminService.getAdmin(id);
    if (!admin) {
      throw new HttpError(404, 'Admin not found');
    }
    return res.status(200).json(admin);
  } catch (error) {
    return next(error);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.createAdmin(req.body);
    return res.status(201).json({ message: `${admin.userRole} created`, database: admin });
  } catch (error) {
    return next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const admin = await adminService.deleteAdmin(id);
    return res.status(200).json({ message: `${admin.userRole} deleted`, database: admin });
  } catch (error) {
    return next(error);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const admin = await adminService.updateAdmin(id, req.body);
    if (!admin) {
      throw new HttpError(404, `user with ${id} not found`);
    }
    return res.status(200).json({ message: `${admin.userRole} updated`, database: admin });
  } catch (error) {
    return next(error);
  }
};

const adminController = {
  getAllAdmins,
  getAdmin,
  createAdmin,
  deleteAdmin,
  updateAdmin,
};

export default adminController;

export { getAllAdmins, getAdmin, createAdmin, deleteAdmin, updateAdmin };
