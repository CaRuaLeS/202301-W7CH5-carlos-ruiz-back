import { Response, Request, NextFunction } from 'express';
import { User } from '../entities/user';
import { Repo } from '../repository/repo.interface';
import createDebug from 'debug';
import { HTTPError } from '../errors/errors';
import { Auth } from '../services/auth';
import { PayloadToken } from '../services/payloadToken';
import { RequestPlus } from '../services/requestPlus';
const debug = createDebug('RS:controller');

export class UserController {
  constructor(public repo: Repo<User>) {
    debug('Instantiated');
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      req.body.passwd = await Auth.hash(req.body.passwd);
      req.body.things = [];
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
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      if (!(await Auth.compare(req.body.passwd, data[0].password)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');
      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: 'admin',
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
      const userId = req.dataPlus?.id;
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
}
