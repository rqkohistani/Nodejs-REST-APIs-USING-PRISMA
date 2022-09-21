/* eslint-disable import/no-named-as-default-member */
import express from 'express';
import { getAllCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from './customer.controller';
import customerValidators from './customer.validation';
import securityMiddleware from '../../middleware/security';

const routes = () => {
  const customerRouter = express.Router();
  customerRouter.get('/', getAllCustomers);
  // customerRouter.get('/', securityMiddleware, getAllCustomers);
  customerRouter.get('/:id', getCustomer);
  // customerRouter.get('/:id', securityMiddleware, getCustomer);
  customerRouter.post('/', createCustomer);
  // customerRouter.post('/', securityMiddleware, customerValidators.createCustomer, createCustomer);
  customerRouter.patch('/:id', updateCustomer);
  // customerRouter.patch('/:id', securityMiddleware, customerValidators.updateCustomer, updateCustomer);
  customerRouter.delete('/:id', deleteCustomer);
  // customerRouter.delete('/:id', securityMiddleware, customerValidators.deleteCustomer, deleteCustomer);

  return customerRouter;
};
export default routes;
