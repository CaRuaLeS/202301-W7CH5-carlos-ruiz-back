import { Router as router } from 'express';
import { UserController } from '../controller/user.controller.js';
import { UserMongoRepo } from '../repository/user.mongo.repo.js';

export const usersRouter = router();
const repo = new UserMongoRepo();
const controller = new UserController(repo);

usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));
usersRouter.patch('/add_friend/:id', controller.addFriend.bind(controller));
