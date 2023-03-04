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
      (UserModel.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue([]),
      }));
      const result = await repo.query();

      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
  describe('When you use queryId()', () => {
    test('Then it should return the data', async () => {
      // Arrange
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue([]),
      }));
      // Act
      const id = '1';
      const result = await repo.queryId(id);
      // Assert
      expect(UserModel.findById).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
    test('Then should throw an error', () => {
      // Arrange
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(null),
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
  describe('When you use update()', () => {
    test('Then it should return the data', async () => {
      // Arrange
      const mockNewItem = { id: '1', test: 3 };
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        id: '1',
        test: 3,
      });
      // Act
      const result = await repo.update(mockNewItem);
      // Assert
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({ id: '1', test: 3 });
    });
    test('Then should throw an error', () => {
      // Arrange
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);
      // Act
      const mockNewItem = { id: '1', test: 3 };

      // Assert
      expect(async () => repo.update(mockNewItem)).rejects.toThrow();
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });
  describe('When i use search', () => {
    test('Then it should return what i serched for', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue([
        {
          key: 'some',
          value: 'fruit',
        },
      ]);

      const result = await repo.search({ key: 'some', value: 'oso' });
      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual([
        {
          key: 'some',
          value: 'fruit',
        },
      ]);
    });
  });
});
