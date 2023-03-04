import { Response, Request, NextFunction } from 'express';
import { User } from '../entities/user';
import { Repo } from '../repository/repo.interface.js';
import createDebug from 'debug';
import { HTTPError } from '../errors/errors.js';
import { Auth } from '../services/auth.js';
import { PayloadToken } from '../services/token-info';
import { RequestPlus } from '../services/request-plus';
const debug = createDebug('RS:App:controller');

export class UserController {
  constructor(public repo: Repo<User>) {
    debug('Instantiated');
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      req.body.password = await Auth.hash(req.body.password);
      req.body.friends = [];
      req.body.enemies = [];
      const data = await this.repo.create(req.body);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login:post');
      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      if (!(await Auth.compare(req.body.password, data[0].password)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');
      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
      };
      const token = Auth.createJWT(payload);
      resp.status(202);
      resp.json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getAll');
      const data = await this.repo.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('get');
      const data = await this.repo.queryId(req.params.id);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async addFriend(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('add friend');
      const userId = req.info?.id;
      debug(req.info?.id, req.params.id);
      if (!userId) throw new HTTPError(404, 'Not found', 'Not found user id');
      const actualUser = await this.repo.queryId(userId); // Repo throw error if not found
      const data = await this.repo.queryId(req.params.id);
      if (!data) throw new HTTPError(404, 'Not found', 'Not found params id');
      actualUser.friends.push(data);
      this.repo.update(actualUser);
      resp.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }

  async removeFriends(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('removeFriend');
      const userId = req.info?.id;
      if (!userId) throw new HTTPError(404, 'Not found', 'Not found user ID');
      const actualUser = await this.repo.queryId(userId);

      const friendUser = await this.repo.queryId(req.params.id);
      if (!friendUser)
        throw new HTTPError(404, 'Not found', 'Not found user ID');
      actualUser.friends = actualUser.friends.filter(
        (item) => item.id !== friendUser.id
      );

      this.repo.update(actualUser);
      resp.json({
        results: [actualUser],
      });
    } catch (error) {
      next(error);
    }
  }
}
