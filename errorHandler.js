/* eslint-disable no-console */
import { DEFAULT_ERROR } from './constants';
import { capitalizeFirstLetter, indexOfEnd } from './utils/helper.util';

const dbErrors = {
  P2002: (tableName, prismaMetaData) => ({
    status: 409,
    message: `${capitalizeFirstLetter(tableName)} with provided ${prismaMetaData?.target} already exists.`,
  }),
  P2003: (tableName, prismaMetaData) => ({
    status: 409,
    message: `${capitalizeFirstLetter(tableName)} with provided ${prismaMetaData?.field_name} not found.`,
  }),
  P2025: (tableName) => ({
    status: 404,
    message: `${capitalizeFirstLetter(tableName)} not found.`,
  }),
};

const getTableNameFromPrismaErrorMessage = (message) => {
  /* 
    If the item (fx a user) already exists in db,
    message will contain the string 
      "Invalid `prisma.user.create()` invocation".
    The name of the variable after "prisma." is the table name. 
  */
  const tableNameIndex = indexOfEnd(message, 'prisma.');
  if (tableNameIndex < 0) return null;

  const [tableName] = message.substring(tableNameIndex).split(/[. (]/);
  return tableName;
};

const getDbError = (error) => {
  // Prisma errors contains a "code" key
  if (!Object.keys(dbErrors).includes(error?.code)) return null;

  const { message } = error;
  if (typeof message !== 'string') return null;

  const tableName = getTableNameFromPrismaErrorMessage(message);
  if (typeof tableName !== 'string') return null;

  return dbErrors[error.code](tableName, error.meta);
};

/**
 * Returns custom message based on known errors.
 * @param {} error
 * @returns
 */
const getDerivedError = (error) => {
  if (error.type === 'entity.parse.failed') return { status: 400, message: 'Request body contains invalid JSON' };

  const dbError = getDbError(error);
  if (dbError) return dbError;

  return DEFAULT_ERROR;
};

const logError = (error, errorData) => {
  if (Object.prototype.hasOwnProperty.call(errorData, 'validationErrors')) {
    console.error(`status: ${errorData.status}, validationErrors:`);
    console.dir(errorData.validationErrors);
  } else {
    console.error(error);
  }
};

const errorHandler = (error, req, res, next) => {
  if (!error) return next();

  let errorData = error?.data;

  // Non-custom errors will not contain error.data
  if (!errorData) errorData = getDerivedError(error);

  if (process.env.NODE_ENV !== 'production') {
    logError(error, errorData);
  }

  return res?.status(errorData.status || 500).send(errorData);
};

export default errorHandler;
