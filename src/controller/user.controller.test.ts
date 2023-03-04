import { UserMongoRepo } from '../repository/user.mongo.repo';
import { Response } from 'express';
import { RequestPlus } from '../services/requestPlus';
import { UserController } from './user.controller';
import { Auth } from '../services/auth';
import { Repo } from '../repository/repo.interface';
import { User } from '../entities/user';
import { PayloadToken } from '../services/payloadToken';

describe('Given the register constroller', () => {
  // Arrange

  const mockRepo = {
    create: jest.fn(),
    search: jest.fn(),
  } as unknown as Repo<User>;

  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  const controller = new UserController(mockRepo);

  describe('When se use the register', () => {
    test('Then it calls correctly', async () => {
      const req = {
        body: {
          email: 'pepe',
          password: 'test',
        },
      } as unknown as RequestPlus;

      await controller.register(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then it should call next if theres NO email and password', async () => {
      const req = {
        body: {},
      } as unknown as RequestPlus;
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});

describe('Given the login controller', () => {
  const mockRepo = {
    create: jest.fn(),
    search: jest.fn(),
  } as unknown as Repo<User>;

  const req = {
    body: {
      email: 'foo',
      password: 'test',
    },
  } as unknown as RequestPlus;
  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  const controller = new UserController(mockRepo);

  Auth.createJWT = jest.fn();
  describe('When we use the login', () => {
    (mockRepo.search as jest.Mock).mockResolvedValue(['test']);
    test('Then when all is OK', async () => {
      Auth.compare = jest.fn().mockResolvedValue(true);
      await controller.login(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then it theres no password it should call next', async () => {
      const req = {
        body: {
          email: 'pepe',
          password: '',
        },
      } as unknown as RequestPlus;
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then when the auth is false it should catch next', async () => {
      Auth.compare = jest.fn().mockResolvedValue(false);

      (mockRepo.search as jest.Mock).mockResolvedValue(['test']);
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then when the data is false it should catch next', async () => {
      Auth.compare = jest.fn().mockResolvedValue(true);

      (mockRepo.search as jest.Mock).mockResolvedValue([]);
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});

describe('Given the rest of the user controller functions', () => {
  // Arrange
  const repo: UserMongoRepo = {
    create: jest.fn(),
    query: jest.fn(),
    queryId: jest.fn(),
    search: jest.fn(),
    update: jest.fn(),
  };
  const req = {
    body: {},
    params: {
      id: '',
    },
  } as unknown as RequestPlus;
  const resp = {
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  const controller = new UserController(repo);

  describe('When the getAll in called', () => {
    test('Then it should be instance', async () => {
      await controller.getAll(req, resp, next);
      expect(repo.query).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then it should if there are errors', async () => {
      (repo.query as jest.Mock).mockRejectedValue(new Error());
      await controller.getAll(req, resp, next);
      expect(repo.query).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When the get in called', () => {
    test('Then it should be instance', async () => {
      await controller.get(req, resp, next);
      expect(repo.queryId).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then it should if there are errors', async () => {
      (repo.queryId as jest.Mock).mockRejectedValue(new Error());
      await controller.get(req, resp, next);
      expect(repo.queryId).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When the addFriend in called', () => {
    test('Then it should be instance', async () => {
      const req = {
        dataPlus: {
          id: 'asdk',
        } as unknown as PayloadToken,
        body: {},
        params: {
          id: '12345',
        },
      } as unknown as RequestPlus;
      (repo.queryId as jest.Mock).mockResolvedValue({ friends: [] });
      await controller.addFriend(req, resp, next);
      expect(repo.queryId).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then with no userId it should throw error', async () => {
      const req = {
        dataPlus: null as unknown as PayloadToken,
        body: {},
        params: {
          id: '1234',
        },
      } as unknown as RequestPlus;
      (repo.queryId as jest.Mock).mockRejectedValue(new Error());
      await controller.addFriend(req, resp, next);
      expect(repo.queryId).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    test('Then with no params id it should throw an error', async () => {
      const req = {
        dataPlus: '12345' as unknown as PayloadToken,
        body: {},
        params: {},
      } as unknown as RequestPlus;
      (repo.queryId as jest.Mock).mockRejectedValue(new Error());
      await controller.addFriend(req, resp, next);
      expect(repo.queryId).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
