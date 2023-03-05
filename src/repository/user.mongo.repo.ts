import { User } from '../entities/user';
import { Repo } from './repo.interface';
import createDebug from 'debug';
import { UserModel } from './user.mongo.model.js';
import { HTTPError } from '../errors/errors.js';
const debug = createDebug('RS:App:RepUser');

export class UserMongoRepo implements Repo<User> {
  private static instance: UserMongoRepo;

  public static getInstance(): UserMongoRepo {
    if (!UserMongoRepo.instance) {
      UserMongoRepo.instance = new UserMongoRepo();
    }

    return UserMongoRepo.instance;
  }

  async query(): Promise<User[]> {
    debug('query');
    const data = await UserModel.find()
      .populate('friends', {
        friends: 0,
        enemies: 0,
      })
      .populate('enemies', { friends: 0, enemies: 0 });
    return data;
  }

  async queryId(id: string): Promise<User> {
    debug('queryId');
    const data = await UserModel.findById(id)
      .populate('friends', {
        friends: 0,
        enemies: 0,
      })
      .populate('enemies', { friends: 0, enemies: 0 });
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in queryId');
    return data;
  }

  async create(info: Partial<User>): Promise<User> {
    debug('create');
    const data = await UserModel.create(info);
    return data;
  }

  async search(query: { key: string; value: unknown }): Promise<User[]> {
    debug('update');
    const data = await UserModel.find({ [query.key]: query.value })
      .populate('friends', {
        friends: 0,
        enemies: 0,
      })
      .populate('enemies', { friends: 0, enemies: 0 });
    return data;
  }

  async update(info: Partial<User>): Promise<User> {
    debug('update');
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    })
      .populate('friends', {
        friends: 0,
        enemies: 0,
      })
      .populate('enemies', { friends: 0, enemies: 0 });
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found in update');
    return data;
  }
}
