import { HttpError } from '../../errors';
import customerService from './customer.service';

const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.getAllCustomers();
    if (!customers.length > 0) {
      throw new HttpError(404, 'Customer list is empty');
    }
    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

const getCustomer = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const customer = await customerService.getCustomer(id);
    if (!customer) {
      throw new HttpError(404, `Customer with id ${id} not found`);
    }
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(200).json({ message: 'Customer created', database: customer });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const customer = await customerService.updateCustomer(id, req.body);
    if (!customer) {
      throw new HttpError(404, `Customer with id ${id} not found`);
    }
    res.status(200).json({ message: 'Customer updated', database: customer });
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const customer = await customerService.deleteCustomer(id);
    res.status(200).json({ message: 'Customer deleted', database: customer });
  } catch (error) {
    next(error);
  }
};

const CustomerController = {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};

export default CustomerController;
export { getAllCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer };
