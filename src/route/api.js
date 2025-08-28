import expenseController from '../controller/expense-controller.js';
import express from 'express';
import userController from '../controller/user-controller.js';
import groupController from '../controller/group-controller.js';
import categoryController from '../controller/category-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';

const userRouter = new express.Router();
userRouter.use(authMiddleware);
// Users routes
userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/current', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

// Groups routes
userRouter.post('/api/groups', groupController.create);
userRouter.get('/api/groups/:groupId', groupController.get);
userRouter.put('/api/groups/:groupId', groupController.update);
userRouter.delete('/api/groups/:groupId', groupController.remove);
userRouter.get('/api/groups/', groupController.list);

// Categories routes
userRouter.post('/api/groups/:groupId/categories', categoryController.create);
userRouter.get('/api/groups/:groupId/categories/:categoryId', categoryController.get);
userRouter.put('/api/groups/:groupId/categories/:categoryId', categoryController.update);
userRouter.delete('/api/groups/:groupId/categories/:categoryId', categoryController.remove);
userRouter.get('/api/groups/:groupId/categories', categoryController.list);

// Expenses routes
userRouter.post('/api/expenses', expenseController.create);
userRouter.get('/api/expenses/:expenseId', expenseController.get);

export {
  userRouter
}
