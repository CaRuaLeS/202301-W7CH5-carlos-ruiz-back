import { Router as router } from 'express';
import { UserController } from '../controller/user.controller.js';
import { logged } from '../interceptors/logged.js';
import { UserMongoRepo } from '../repository/user.mongo.repo.js';

export const usersRouter = router();
const repo = new UserMongoRepo();
const controller = new UserController(repo);

usersRouter.post('/register', controller.register.bind(controller));
usersRouter.post('/login', controller.login.bind(controller));

usersRouter.patch(
  '/remove_friend/:id',
  logged,
  controller.removeFriends.bind(controller)
);
usersRouter.patch(
  '/add_friend/:id',
  logged,
  controller.addFriend.bind(controller)
);
usersRouter.get('/', logged, controller.getAll.bind(controller));
