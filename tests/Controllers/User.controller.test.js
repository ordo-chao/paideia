import { jest } from '@jest/globals';

// ---- Mock the service layer BEFORE importing the controller ----
const mockUserService = {
  createUserService: jest.fn(),
  updateUserService: jest.fn(),
  deleteUserService: jest.fn(),
  loginUserService: jest.fn(),
  getUserService: jest.fn(),
  getUsersService: jest.fn(),
};

const mockGenerateToken = jest.fn();

jest.unstable_mockModule('../../Services/User.service.js', () => mockUserService);
jest.unstable_mockModule('../../Utils/JWT.js', () => ({
  generateToken: mockGenerateToken,
}));

// ---- Import controller AFTER mocking ----
const {
  createUserController,
  getUserByIdController,
  getUserProfileController,
  updateUserController,
  deleteUserController,
  loginUserController,
  getUsersController,
} = await import('../../Controllers/User.controller.js');

// ---------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------
const makeReq = (overrides = {}) => ({
  body: {},
  params: {},
  user: {},
  log: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
  ...overrides,
});

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

// Sanity check: the controller must be wired to our mocks
test('controller is wired to the mocked service', async () => {
  const svc = await import('../../Services/User.service.js');
  expect(svc.createUserService).toBe(mockUserService.createUserService);
});

// ---------------------------------------------------------------
// createUserController
// ---------------------------------------------------------------
describe('createUserController', () => {
  it('responds 201 with the created user', async () => {
    const payload = { first_name: 'Alice', email: 'a@test.com' };
    const created = { id: 1, ...payload };
    mockUserService.createUserService.mockResolvedValue(created);

    const req = makeReq({ body: payload });
    const res = makeRes();

    await createUserController(req, res);

    expect(mockUserService.createUserService).toHaveBeenCalledWith(payload);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(created);
    expect(req.log.info).toHaveBeenCalled();
  });

  it('logs a warning and returns 400 for validation errors', async () => {
    const err = Object.assign(new Error('Invalid data'), { statusCode: 400 });
    mockUserService.createUserService.mockRejectedValue(err);

    const req = makeReq({ body: {} });
    const res = makeRes();

    await createUserController(req, res);

    expect(req.log.warn).toHaveBeenCalled();
    expect(req.log.error).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid data' });
  });

  it('logs a warning and returns 409 for conflict errors', async () => {
    const err = Object.assign(new Error('Email taken'), { statusCode: 409 });
    mockUserService.createUserService.mockRejectedValue(err);

    const req = makeReq({ body: {} });
    const res = makeRes();

    await createUserController(req, res);

    expect(req.log.warn).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('logs an error and returns 500 for unexpected errors', async () => {
    mockUserService.createUserService.mockRejectedValue(new Error('kaboom'));

    const req = makeReq({ body: {} });
    const res = makeRes();

    await createUserController(req, res);

    expect(req.log.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'kaboom' });
  });
});

// ---------------------------------------------------------------
// getUserByIdController
// ---------------------------------------------------------------
describe('getUserByIdController', () => {
  it('returns 200 with the user', async () => {
    const user = { id: '42', first_name: 'Bob' };
    mockUserService.getUserService.mockResolvedValue(user);

    const req = makeReq({ params: { id: '42' } });
    const res = makeRes();

    await getUserByIdController(req, res);

    expect(mockUserService.getUserService).toHaveBeenCalledWith('42');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('returns the error status when the service throws', async () => {
    const err = Object.assign(new Error('Not found'), { statusCode: 404 });
    mockUserService.getUserService.mockRejectedValue(err);

    const req = makeReq({ params: { id: '42' } });
    const res = makeRes();

    await getUserByIdController(req, res);

    expect(req.log.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
  });

  it('defaults to 500 when the error has no statusCode', async () => {
    mockUserService.getUserService.mockRejectedValue(new Error('boom'));

    const req = makeReq({ params: { id: '42' } });
    const res = makeRes();

    await getUserByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------
// getUserProfileController
// ---------------------------------------------------------------
describe('getUserProfileController', () => {
  it('uses req.user.id and returns 200', async () => {
    const user = { id: '7', first_name: 'Me' };
    mockUserService.getUserService.mockResolvedValue(user);

    const req = makeReq({ user: { id: '7' } });
    const res = makeRes();

    await getUserProfileController(req, res);

    expect(mockUserService.getUserService).toHaveBeenCalledWith('7');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('returns 500 on failure', async () => {
    mockUserService.getUserService.mockRejectedValue(new Error('fail'));

    const req = makeReq({ user: { id: '7' } });
    const res = makeRes();

    await getUserProfileController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ---------------------------------------------------------------
// updateUserController
// ---------------------------------------------------------------
describe('updateUserController', () => {
  it('updates using req.user.id and returns 200', async () => {
    const updated = { id: '7', first_name: 'New' };
    mockUserService.updateUserService.mockResolvedValue(updated);

    const req = makeReq({ user: { id: '7' }, body: { first_name: 'New' } });
    const res = makeRes();

    await updateUserController(req, res);

    expect(mockUserService.updateUserService).toHaveBeenCalledWith('7', {
      first_name: 'New',
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('propagates the error status', async () => {
    const err = Object.assign(new Error('User not found'), { statusCode: 404 });
    mockUserService.updateUserService.mockRejectedValue(err);

    const req = makeReq({ user: { id: '7' }, body: {} });
    const res = makeRes();

    await updateUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });
});

// ---------------------------------------------------------------
// deleteUserController
// ---------------------------------------------------------------
describe('deleteUserController', () => {
  it('deletes and returns a success message', async () => {
    mockUserService.deleteUserService.mockResolvedValue(undefined);

    const req = makeReq({ user: { id: '7' } });
    const res = makeRes();

    await deleteUserController(req, res);

    expect(mockUserService.deleteUserService).toHaveBeenCalledWith('7');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User deleted successfully',
    });
  });

  it('returns 500 on failure', async () => {
    mockUserService.deleteUserService.mockRejectedValue(new Error('nope'));

    const req = makeReq({ user: { id: '7' } });
    const res = makeRes();

    await deleteUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'nope' });
  });
});

// ---------------------------------------------------------------
// loginUserController
// ---------------------------------------------------------------
describe('loginUserController', () => {
  it('returns 200 with the user and a JWT token', async () => {
    const user = { id: '1', email: 'a@test.com' };
    const token = 'jwt.token.value';
    mockUserService.loginUserService.mockResolvedValue(user);
    mockGenerateToken.mockResolvedValue(token);

    const req = makeReq({ body: { email: 'a@test.com', password: 'pw' } });
    const res = makeRes();

    await loginUserController(req, res);

    expect(mockUserService.loginUserService).toHaveBeenCalledWith(
      'a@test.com',
      'pw'
    );
    expect(mockGenerateToken).toHaveBeenCalledWith(user);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ...user, token });
  });

  it('returns 401 for invalid credentials', async () => {
    const err = Object.assign(new Error('Invalid credentials'), {
      statusCode: 401,
    });
    mockUserService.loginUserService.mockRejectedValue(err);

    const req = makeReq({ body: { email: 'a@test.com', password: 'bad' } });
    const res = makeRes();

    await loginUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    expect(mockGenerateToken).not.toHaveBeenCalled();
  });

  it('returns 500 when token generation fails', async () => {
    mockUserService.loginUserService.mockResolvedValue({ id: '1' });
    mockGenerateToken.mockRejectedValue(new Error('jwt fail'));

    const req = makeReq({ body: { email: 'a@test.com', password: 'pw' } });
    const res = makeRes();

    await loginUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'jwt fail' });
  });
});

// ---------------------------------------------------------------
// getUsersController
// ---------------------------------------------------------------
describe('getUsersController', () => {
  it('returns 200 with all users', async () => {
    const users = [{ id: 1 }, { id: 2 }];
    mockUserService.getUsersService.mockResolvedValue(users);

    const req = makeReq();
    const res = makeRes();

    await getUsersController(req, res);

    expect(mockUserService.getUsersService).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  it('returns 500 on failure', async () => {
    mockUserService.getUsersService.mockRejectedValue(new Error('db down'));

    const req = makeReq();
    const res = makeRes();

    await getUsersController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});