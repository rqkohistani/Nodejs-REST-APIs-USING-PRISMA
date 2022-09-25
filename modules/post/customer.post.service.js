import { PrismaClient } from '@prisma/client';
import customerService from '../customer/customer.service';

const prisma = new PrismaClient();

const selectors = {
  id: true,
  title: true,
  body: true,
  createdAt: true,
  updatedAt: true,
  customers: {
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};
const getAllPostsOrGetPostById = async (queryParams) => {
  const { postId } = queryParams;
  const postIdFilter =
    typeof postId === 'undefined'
      ? undefined
      : {
          id: postId,
        };

  const posts = await prisma.posts.findMany({
    where: {
      ...postIdFilter,
    },
    select: selectors,
  });

  return posts;
};

const getPostById = async (postId) => {
  const post = await prisma.posts.findUnique({
    where: {
      id: postId,
    },
    select: selectors,
  });
  return post;
};

const getPostsByCustomerId = async (customerId) => {
  const postFilter =
    typeof customerId === 'undefined'
      ? undefined
      : {
          customers: {
            id: customerId,
          },
        };

  const posts = await prisma.posts.findMany({
    where: {
      ...postFilter,
    },
    select: selectors,
  });
  return posts;
};

const createPostByCustomerId = async (customerId, postData) => {
  const post = await prisma.posts.create({
    data: {
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
      customers: {
        connect: {
          id: customerId,
        },
      },
    },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      updatedAt: true,
      customers: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return post;
};

const deletePost = async (customerId, postId) => {
  const getCustomer = await customerService.getCustomer(customerId);
  const getPost = await getPostById(postId);
  const checkAll = Promise.all([getCustomer, getPost]);
  const [customer, post] = await checkAll;
  if (customer && post) {
    const deletedPost = await prisma.posts.delete({
      where: {
        id: postId,
      },
    });
    return deletedPost;
  }
  return null;
};

const updatePost = async (customerId, postId, postData) => {
  const getCustomer = await customerService.getCustomer(customerId);
  const getPost = await getPostById(postId);
  const checkAll = Promise.all([getCustomer, getPost]);
  const [customer, post] = await checkAll;
  if (customer && post) {
    const post = await prisma.posts.update({
      where: {
        id: postId,
      },
      data: {
        ...postData,
        updatedAt: new Date(),
      },
    });
    return post;
  }
  return null;
};

const customerPostService = {
  getAllPostsOrGetPostById,
  getPostById,
  getPostsByCustomerId,
  createPostByCustomerId,
  deletePost,
  updatePost,
};

export default customerPostService;
