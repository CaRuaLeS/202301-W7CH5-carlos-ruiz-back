import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { dbConnect } from '../db/db.connect';
import { UserModel } from '../repository/user.mongo.model';
import { Auth } from '../services/auth';
import { PayloadToken } from '../services/token-info';

// Mock raiz de usuarios
const setCollection = async () => {
  const userMock = [
    {
      email: 'sample@mail.com',
      password: '12345',
      friends: [],
      enemies: [],
    },
    {
      email: 'foo@sample.com',
      password: '12345',
      friends: [],
      enemies: [],
    },
  ];
  await UserModel.deleteMany();
  await UserModel.insertMany(userMock);
  const data = await UserModel.find();
  const testId = [data[0].id, data[1].id];

  return testId;
};

let ids: Array<string>;

describe.only('given app', () => {
  describe('when we connect to mongoDB', () => {
    let token: string;
    beforeEach(async () => {
      await dbConnect();
      ids = await setCollection();
      const payload: PayloadToken = {
        id: ids[0],
        email: 'sample@mail.com',
      };
      token = Auth.createJWT(payload);
    });
    afterEach(async () => {
      await mongoose.disconnect();
    });

    test('then the GET all should be OK and gives a status 200', async () => {
      await request(app)
        .get('/users')
        .set('Authorization', 'Bearer ' + token)
        .expect(200);
    });
    test('then the GET all OK and gives a status 200', async () => {
      await request(app)
        .get('/usrs')
        .set('Authorization', 'Bearer ' + token)
        .expect(404);
    });
    test('then if REGISTER is OK it should gives status 201 ', async () => {
      const simulateUser = {
        email: 'ej@mail.com',
        password: '1234',
      };
      await request(app).post('/users/register').send(simulateUser).expect(201);
    });
    test('then if REGISTER is NO OK it should gives status 401 ', async () => {
      const simulateUser = {
        password: '1234',
      };
      await request(app).post('/users/register').send(simulateUser).expect(401);
    });
  });
});
