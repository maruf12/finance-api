import express from 'express';
import userController from '../controller/user-controller.js';
import groupController from '../controller/group-controller.js';
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


export {
  userRouter
}
