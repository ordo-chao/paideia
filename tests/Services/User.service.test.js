import { jest } from '@jest/globals';

// ---- Mock the repository and bcrypt BEFORE importing the service ----
const mockUserRepo = {
  createUserRepository: jest.fn(),
  getUserByIdRepository: jest.fn(),
  updateUserRepository: jest.fn(),
  deleteUserRepository: jest.fn(),
  getUserPasswordRepository: jest.fn(),
  checkDeletedUserRepository: jest.fn(),
  searchuserRepository: jest.fn(),
  getUsersRepository: jest.fn(),
};

const mockComparePassword = jest.fn();
const mockHashPassword = jest.fn();

jest.unstable_mockModule('../../Repositories/User.repository.js', () => mockUserRepo);
jest.unstable_mockModule('../../Utils/bcrypt.js', () => ({
  comparePassword: mockComparePassword,
  hashPassword: mockHashPassword,
}));

// ---- Import the service AFTER mocking ----
const {
  createUserService,
  updateUserService,
  deleteUserService,
  loginUserService,
  searchUserService,
  getUserService,
  getUsersService,
} = await import('../../Services/User.service.js');

// Silence console.log inside createUserService
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterAll(() => {
  console.log.mockRestore();
});

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------
const validPayload = {
  email: 'alice@test.com',
  first_name: 'Alice',
  last_name: 'Smith',
  phone: '0700000000',
  password: 'plainpw',
  role: 'student',
  gender: 'female',
};

// A minimal object that mimics a Sequelize instance for the service.
// toJSON() returns the plain data so the service can destructure & strip password.
const makeUserInstance = (data) => ({
  ...data,
  toJSON: () => ({ ...data }),
  save: jest.fn().mockResolvedValue(undefined),
});

// Sanity check: service is wired to mocks
test('service is wired to the mocked repository', async () => {
  const repo = await import('../../Repositories/User.repository.js');
  expect(repo.createUserRepository).toBe(mockUserRepo.createUserRepository);
});

// ---------------------------------------------------------------
// createUserService
// ---------------------------------------------------------------
describe('createUserService', () => {
  it('creates a user, hashes password, and strips password from result', async () => {
    mockUserRepo.checkDeletedUserRepository.mockResolvedValue(null);
    mockHashPassword.mockResolvedValue('hashed-pw');
    const created = makeUserInstance({ id: 1, ...validPayload, password: 'hashed-pw' });
    mockUserRepo.createUserRepository.mockResolvedValue(created);

    const result = await createUserService(validPayload);

    expect(mockUserRepo.checkDeletedUserRepository).toHaveBeenCalledWith('alice@test.com');
    expect(mockHashPassword).toHaveBeenCalledWith('plainpw');
    expect(mockUserRepo.createUserRepository).toHaveBeenCalledWith({
      email: 'alice@test.com',
      first_name: 'Alice',
      last_name: 'Smith',
      phone: '0700000000',
      password: 'hashed-pw', // hashed, NOT plain
      role: 'student',
      gender: 'female',
    });
    expect(result).not.toHaveProperty('password');
    expect(result).toEqual({
      id: 1,
      email: 'alice@test.com',
      first_name: 'Alice',
      last_name: 'Smith',
      phone: '0700000000',
      role: 'student',
      gender: 'female',
    });
  });

  it('rejects invalid email', async () => {
    await expect(
      createUserService({ ...validPayload, email: 'not-an-email' })
    ).rejects.toMatchObject({ message: 'Invalid email', statusCode: 400 });

    expect(mockUserRepo.checkDeletedUserRepository).not.toHaveBeenCalled();
  });

  it('rejects missing email', async () => {
    await expect(
      createUserService({ ...validPayload, email: undefined })
    ).rejects.toMatchObject({ message: 'Invalid email', statusCode: 400 });
  });

  it('rejects invalid gender', async () => {
    await expect(
      createUserService({ ...validPayload, gender: 'other' })
    ).rejects.toMatchObject({ message: 'Invalid gender', statusCode: 400 });
  });

  it('rejects invalid role', async () => {
    await expect(
      createUserService({ ...validPayload, role: 'wizard' })
    ).rejects.toMatchObject({ message: 'Invalid role', statusCode: 400 });
  });

  it('rejects when email belongs to an active user', async () => {
    mockUserRepo.checkDeletedUserRepository.mockResolvedValue({
      id: 1,
      email: 'alice@test.com',
      deleted_at: null,
    });

    await expect(createUserService(validPayload)).rejects.toMatchObject({
      message: 'User already exists',
      statusCode: 400,
    });

    expect(mockHashPassword).not.toHaveBeenCalled();
    expect(mockUserRepo.createUserRepository).not.toHaveBeenCalled();
  });

  it('rejects when email belongs to a soft-deleted user', async () => {
    mockUserRepo.checkDeletedUserRepository.mockResolvedValue({
      id: 1,
      email: 'alice@test.com',
      deleted_at: new Date(),
    });

    await expect(createUserService(validPayload)).rejects.toMatchObject({
      message: 'This email belongs to a deactivated account. Contact support.',
      statusCode: 409,
    });
  });

  it('accepts every valid role', async () => {
    for (const role of ['admin', 'teacher', 'student', 'parent', 'staff']) {
      mockUserRepo.checkDeletedUserRepository.mockResolvedValue(null);
      mockHashPassword.mockResolvedValue('hashed');
      mockUserRepo.createUserRepository.mockResolvedValue(
        makeUserInstance({ id: 1, ...validPayload, role, password: 'hashed' })
      );

      await expect(
        createUserService({ ...validPayload, role })
      ).resolves.toBeDefined();
    }
  });
});

// ---------------------------------------------------------------
// updateUserService
// ---------------------------------------------------------------
describe('updateUserService', () => {
  const updateData = {
    email: 'new@test.com',
    first_name: 'New',
    last_name: 'Name',
    phone: '0711111111',
  };

  it('updates and returns the user when the user exists', async () => {
    mockUserRepo.getUserByIdRepository.mockResolvedValue({ id: '7' });
    const updated = { id: '7', ...updateData };
    mockUserRepo.updateUserRepository.mockResolvedValue(updated);

    const result = await updateUserService('7', updateData);

    expect(mockUserRepo.getUserByIdRepository).toHaveBeenCalledWith('7');
    expect(mockUserRepo.updateUserRepository).toHaveBeenCalledWith('7', updateData);
    expect(result).toBe(updated);
  });

  it('throws 400 when the user does not exist', async () => {
    mockUserRepo.getUserByIdRepository.mockResolvedValue(null);

    await expect(updateUserService('7', updateData)).rejects.toMatchObject({
      message: 'User not found',
      statusCode: 400,
    });

    expect(mockUserRepo.updateUserRepository).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------
// deleteUserService
// ---------------------------------------------------------------
describe('deleteUserService', () => {
  it('deletes an existing user', async () => {
    mockUserRepo.getUserByIdRepository.mockResolvedValue({ id: '7' });
    const deleted = { id: '7' };
    mockUserRepo.deleteUserRepository.mockResolvedValue(deleted);

    const result = await deleteUserService('7');

    expect(mockUserRepo.getUserByIdRepository).toHaveBeenCalledWith('7');
    expect(mockUserRepo.deleteUserRepository).toHaveBeenCalledWith('7');
    expect(result).toBe(deleted);
  });

  it('throws 400 when the user does not exist', async () => {
    mockUserRepo.getUserByIdRepository.mockResolvedValue(null);

    await expect(deleteUserService('7')).rejects.toMatchObject({
      message: 'User already deleted',
      statusCode: 400,
    });

    expect(mockUserRepo.deleteUserRepository).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------
// loginUserService
// ---------------------------------------------------------------
describe('loginUserService', () => {
  it('logs in an active user, updates last_seen, and strips password', async () => {
    const user = makeUserInstance({
      id: '1',
      email: 'a@test.com',
      password: 'hashed',
      active: true,
    });
    mockUserRepo.getUserPasswordRepository.mockResolvedValue(user);
    mockComparePassword.mockResolvedValue(true);

    const result = await loginUserService('a@test.com', 'plain');

    expect(mockUserRepo.getUserPasswordRepository).toHaveBeenCalledWith('a@test.com');
    expect(mockComparePassword).toHaveBeenCalledWith('plain', 'hashed');
    expect(user.save).toHaveBeenCalledWith({ hooks: false });
    expect(user.last_seen).toBeInstanceOf(Date);
    expect(result).not.toHaveProperty('password');
    expect(result.email).toBe('a@test.com');
  });

  it('activates a previously inactive user on login', async () => {
    const user = makeUserInstance({
      id: '1',
      email: 'a@test.com',
      password: 'hashed',
      active: false,
    });
    mockUserRepo.getUserPasswordRepository.mockResolvedValue(user);
    mockComparePassword.mockResolvedValue(true);

    await loginUserService('a@test.com', 'plain');

    expect(user.active).toBe(true);
    expect(user.save).toHaveBeenCalledWith({ hooks: false });
  });

  it('throws 404 when user is not found', async () => {
    mockUserRepo.getUserPasswordRepository.mockResolvedValue(null);

    await expect(loginUserService('x@test.com', 'pw')).rejects.toMatchObject({
      message: 'User not found',
      statusCode: 404,
    });

    expect(mockComparePassword).not.toHaveBeenCalled();
  });

  it('throws 400 when password is null and user is inactive', async () => {
    mockUserRepo.getUserPasswordRepository.mockResolvedValue(
      makeUserInstance({
        id: '1',
        email: 'a@test.com',
        password: null,
        active: false,
      })
    );

    await expect(loginUserService('a@test.com', 'pw')).rejects.toMatchObject({
      message: 'Password not set up',
      statusCode: 400,
    });

    expect(mockComparePassword).not.toHaveBeenCalled();
  });

  it('throws 401 when password does not match', async () => {
    const user = makeUserInstance({
      id: '1',
      email: 'a@test.com',
      password: 'hashed',
      active: true,
    });
    mockUserRepo.getUserPasswordRepository.mockResolvedValue(user);
    mockComparePassword.mockResolvedValue(false);

    await expect(loginUserService('a@test.com', 'wrong')).rejects.toMatchObject({
      message: 'Invalid credentials',
      statusCode: 401,
    });

    expect(user.save).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------
// searchUserService
// ---------------------------------------------------------------
describe('searchUserService', () => {
  it('throws 400 when query is not a string', async () => {
    await expect(searchUserService(123)).rejects.toMatchObject({
      message: 'Query must be a string',
      statusCode: 400,
    });

    expect(mockUserRepo.searchuserRepository).not.toHaveBeenCalled();
  });

  it('passes the query to the repository', async () => {
    const users = [{ id: 1 }, { id: 2 }];
    mockUserRepo.searchuserRepository.mockResolvedValue(users);

    const result = await searchUserService('ali');

    expect(mockUserRepo.searchuserRepository).toHaveBeenCalledWith('ali');
    expect(result).toBe(users);
  });
});

// ---------------------------------------------------------------
// getUserService & getUsersService
// ---------------------------------------------------------------
describe('getUserService', () => {
  it('returns the user from the repository', async () => {
    const user = { id: '5' };
    mockUserRepo.getUserByIdRepository.mockResolvedValue(user);

    const result = await getUserService('5');

    expect(mockUserRepo.getUserByIdRepository).toHaveBeenCalledWith('5');
    expect(result).toBe(user);
  });
});

describe('getUsersService', () => {
  it('returns all users', async () => {
    const users = [{ id: 1 }, { id: 2 }];
    mockUserRepo.getUsersRepository.mockResolvedValue(users);

    const result = await getUsersService();

    expect(mockUserRepo.getUsersRepository).toHaveBeenCalledTimes(1);
    expect(result).toBe(users);
  });
});