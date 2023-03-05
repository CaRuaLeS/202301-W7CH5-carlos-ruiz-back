/* eslint-disable max-nested-callbacks */
import { UserModel } from './user.mongo.model';
import { UserMongoRepo } from './user.mongo.repo';

jest.mock('./user.mongo.model');

describe('Given UserMongoRepo', () => {
  const repo = new UserMongoRepo();

  describe('When iinstance the class', () => {
    const repoInstance = UserMongoRepo.getInstance();
    test('Then it should be an instance of the class', async () => {
      expect(repoInstance).toBeInstanceOf(UserMongoRepo);
    });
  });

  describe('When i use query', () => {
    test('Then should return the data', async () => {
      const mockPopulate = [{ id: '1' }, { id: '2' }];
      (UserModel.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          populate: jest.fn().mockResolvedValue(mockPopulate),
        })),
      }));
      const result = await repo.query();

      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
    });
  });
  describe('When you use queryId()', () => {
    test('Then it should return the data', async () => {
      // Arrange
      const mockPopulate = [{ id: '1' }];
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          populate: jest.fn().mockResolvedValue(mockPopulate),
        })),
      }));
      // Act
      const id = '1';
      const result = await repo.queryId(id);
      // Assert
      expect(UserModel.findById).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1' }]);
    });
    test('Then should throw an error', () => {
      // Arrange
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          populate: jest.fn().mockResolvedValue(null),
        })),
      }));
      // Act
      // Assert
      expect(async () => repo.queryId('')).rejects.toThrow();
    });
  });
  describe('When you use create()', () => {
    test('Then it should return the data', async () => {
      // Arrange
      const mockNewItem = { id: '2' };
      (UserModel.create as jest.Mock).mockResolvedValue({ id: '1' });
      // Act
      const result = await repo.create(mockNewItem);
      // Assert
      const resultId = result.id;
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual({ id: resultId });
    });
  });

  describe('When i use search', () => {
    test('Then it should return what i searched for', async () => {
      const mockPopulate = [{ id: '1' }];
      (UserModel.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          populate: jest.fn().mockResolvedValue(mockPopulate),
        })),
      }));

      const result = await repo.search({ key: 'some', value: 'oso' });
      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1' }]);
    });
  });

  describe('When you use update()', () => {
    const mockNewUser = { email: '12345' };
    test('Then it should return the data', async () => {
      // Arrange
      const mockPopulate = [{ id: '1' }];
      (UserModel.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          populate: jest.fn().mockResolvedValue(mockPopulate),
        })),
      }));
      // Act
      const result = await repo.update(mockNewUser);
      // Assert
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual([{ id: '1' }]);
    });
    test('Then should throw an error', () => {
      // Arrange
      (UserModel.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          populate: jest.fn().mockResolvedValue(null),
        })),
      }));
      // Act
      // Assert
      expect(async () => repo.update(mockNewUser)).rejects.toThrow();
    });
  });
});
