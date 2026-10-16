import { jest } from '@jest/globals';
import { Op } from 'sequelize';

// ---- 1. Declare the mock object OUTSIDE so we can grab it after import ----
const mockUsers = {
  create: jest.fn(),
  findByPk: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  scope: jest.fn(),
  unscoped: jest.fn(),
};

// ---- 2. Register the mock BEFORE any import of the modules under test ----
jest.unstable_mockModule('../../Models/index.js', () => ({
  Users: mockUsers,
}));

// ---- 3. Dynamic imports AFTER mocking (order matters in ESM) ----
const { Users: User } = await import('../../Models/index.js');

const {
  createUserRepository,
  getUserByIdRepository,
  updateUserRepository,
  getUsersRepository,
  deleteUserRepository,
  getUserPasswordRepository,
  searchuserRepository,
  checkDeletedUserRepository,
} = await import('../../Repositories/User.repository.js');

// Silence the console.log inside createUserRepository
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterAll(() => {
  console.log.mockRestore();
});

// Sanity check: the repository should be using our mocked model
test('repository is wired to the mocked model', () => {
  expect(User).toBe(mockUsers);
});

// ---------------------------------------------------------------
// createUserRepository
// ---------------------------------------------------------------
describe('createUserRepository', () => {
  it('creates a user and returns it', async () => {
    const payload = { first_name: 'Alice', email: 'alice@test.com' };
    const created = { id: 1, ...payload };
    User.create.mockResolvedValue(created);

    const result = await createUserRepository(payload);

    expect(User.create).toHaveBeenCalledWith(payload);
    expect(result).toEqual(created);
  });

  it('rethrows when the model throws', async () => {
    User.create.mockRejectedValue(new Error('DB down'));
    await expect(createUserRepository({})).rejects.toThrow('DB down');
  });
});

// ---------------------------------------------------------------
// getUserByIdRepository
// ---------------------------------------------------------------
describe('getUserByIdRepository', () => {
  it('returns a user by primary key', async () => {
    const user = { id: 5, first_name: 'Bob' };
    User.findByPk.mockResolvedValue(user);

    const result = await getUserByIdRepository(5);

    expect(User.findByPk).toHaveBeenCalledWith(5);
    expect(result).toBe(user);
  });

  it('returns null when user does not exist', async () => {
    User.findByPk.mockResolvedValue(null);
    expect(await getUserByIdRepository(999)).toBeNull();
  });

  it('propagates errors', async () => {
    User.findByPk.mockRejectedValue(new Error('boom'));
    await expect(getUserByIdRepository(1)).rejects.toThrow('boom');
  });
});

// ---------------------------------------------------------------
// updateUserRepository
// ---------------------------------------------------------------
describe('updateUserRepository', () => {
  it('updates and returns the user', async () => {
    const existing = {
      id: 1,
      first_name: 'Old',
      update: jest.fn().mockResolvedValue(undefined),
    };
    User.findByPk.mockResolvedValue(existing);

    const result = await updateUserRepository(1, { first_name: 'New' });

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(existing.update).toHaveBeenCalledWith({ first_name: 'New' });
    expect(result).toBe(existing);
  });

  it('throws when the user is not found', async () => {
    User.findByPk.mockResolvedValue(null);
    await expect(updateUserRepository(1, {})).rejects.toThrow('User not found');
  });
});

// ---------------------------------------------------------------
// getUsersRepository
// ---------------------------------------------------------------
describe('getUsersRepository', () => {
  it('returns all users', async () => {
    const users = [{ id: 1 }, { id: 2 }];
    User.findAll.mockResolvedValue(users);

    const result = await getUsersRepository();

    expect(User.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(users);
  });
});

// ---------------------------------------------------------------
// deleteUserRepository
// ---------------------------------------------------------------
describe('deleteUserRepository', () => {
  it('destroys an existing user', async () => {
    const user = { id: 1, destroy: jest.fn().mockResolvedValue(undefined) };
    User.findByPk.mockResolvedValue(user);

    const result = await deleteUserRepository(1);

    expect(user.destroy).toHaveBeenCalled();
    expect(result).toBe(user);
  });

  it('throws when the user is not found', async () => {
    User.findByPk.mockResolvedValue(null);
    await expect(deleteUserRepository(1)).rejects.toThrow('User not found');
  });
});

// ---------------------------------------------------------------
// getUserPasswordRepository
// ---------------------------------------------------------------
describe('getUserPasswordRepository', () => {
  it('queries via the withPassword scope', async () => {
    const user = { id: 1, email: 'a@test.com', password: 'hashed' };
    const findOne = jest.fn().mockResolvedValue(user);
    User.scope.mockReturnValue({ findOne });

    const result = await getUserPasswordRepository('a@test.com');

    expect(User.scope).toHaveBeenCalledWith('withPassword');
    expect(findOne).toHaveBeenCalledWith({ where: { email: 'a@test.com' } });
    expect(result).toBe(user);
  });
});

// ---------------------------------------------------------------
// searchuserRepository
// ---------------------------------------------------------------
describe('searchuserRepository', () => {
  it('throws 400 when no query is provided', async () => {
    await expect(searchuserRepository('')).rejects.toMatchObject({
      message: 'Search query is required',
      statusCode: 400,
    });
  });

  it('searches across first_name, last_name, and email', async () => {
    const users = [{ id: 1 }];
    User.findAll.mockResolvedValue(users);

    const result = await searchuserRepository('ali');

    expect(User.findAll).toHaveBeenCalledWith({
      where: {
        [Op.or]: [
          { first_name: { [Op.iLike]: '%ali%' } },
          { last_name:  { [Op.iLike]: '%ali%' } },
          { email:      { [Op.iLike]: '%ali%' } },
        ],
      },
    });
    expect(result).toBe(users);
  });
});

// ---------------------------------------------------------------
// checkDeletedUserRepository
// ---------------------------------------------------------------
describe('checkDeletedUserRepository', () => {
  it('uses unscoped, includes password, and disables paranoid', async () => {
    const user = { id: 1, email: 'a@test.com', deletedAt: new Date() };
    const findOne = jest.fn().mockResolvedValue(user);
    User.unscoped.mockReturnValue({ findOne });

    const result = await checkDeletedUserRepository('a@test.com');

    expect(User.unscoped).toHaveBeenCalled();
    expect(findOne).toHaveBeenCalledWith({
      where: { email: 'a@test.com' },
      attributes: { include: ['password'] },
      paranoid: false,
    });
    expect(result).toBe(user);
  });

  it('rethrows errors from the model', async () => {
    const findOne = jest.fn().mockRejectedValue(new Error('query failed'));
    User.unscoped.mockReturnValue({ findOne });

    await expect(checkDeletedUserRepository('a@test.com'))
      .rejects.toThrow('query failed');
  });
});