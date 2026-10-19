import { jest } from '@jest/globals';

// ---- Mock controllers BEFORE importing the router ----
const mockControllers = {
  createUserController: jest.fn((req, res) => res.status(201).json({ ok: 'create' })),
  getUserByIdController: jest.fn((req, res) => res.status(200).json({ ok: 'getById' })),
  updateUserController: jest.fn((req, res) => res.status(200).json({ ok: 'update' })),
  deleteUserController: jest.fn((req, res) => res.status(200).json({ ok: 'delete' })),
  loginUserController: jest.fn((req, res) => res.status(200).json({ ok: 'login' })),
  getUserProfileController: jest.fn((req, res) => res.status(200).json({ ok: 'profile' })),
  getUsersController: jest.fn((req, res) => res.status(200).json({ ok: 'getAll' })),
};

// ---- Mock verifyToken middleware ----
const mockVerifyToken = jest.fn((req, res, next) => {
  req.user = { id: 'test-user-id' }; // pretend decoded payload
  next();
});

jest.unstable_mockModule('../../Controllers/User.controller.js', () => mockControllers);
jest.unstable_mockModule('../../Utils/JWT.js', () => ({
  verifyToken: mockVerifyToken,
  // If your JWT.js exports other things (generateToken, etc.), add them here
  // or the router import will fail.
  generateToken: jest.fn(),
}));

// ---- Import router AFTER mocking ----
const express = (await import('express')).default;
const router = (await import('../../Routes/User.route.js')).default;

// ---- Build a minimal Express app around the router ----
const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/users', router);
  return app;
};

// ---- supertest is CJS; import via default ----
const request = (await import('supertest')).default;

let app;

beforeEach(() => {
  jest.clearAllMocks();
  app = buildApp();
});

// Sanity check: router is using our mocked controllers
test('router is wired to mocked controllers', async () => {
  const ctrl = await import('../../Controllers/User.controller.js');
  expect(ctrl.createUserController).toBe(mockControllers.createUserController);
});

// ---------------------------------------------------------------
// POST /users/login — public
// ---------------------------------------------------------------
describe('POST /users/login', () => {
  it('calls loginUserController without auth', async () => {
    const res = await request(app).post('/users/login').send({
      email: 'a@test.com',
      password: 'pw',
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: 'login' });
    expect(mockControllers.loginUserController).toHaveBeenCalledTimes(1);
    expect(mockVerifyToken).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------
// POST /users/register — public
// ---------------------------------------------------------------
describe('POST /users/register', () => {
  it('calls createUserController without auth', async () => {
    const res = await request(app).post('/users/register').send({});

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: 'create' });
    expect(mockControllers.createUserController).toHaveBeenCalledTimes(1);
    expect(mockVerifyToken).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------
// GET /users/profile — protected
// ---------------------------------------------------------------
describe('GET /users/profile', () => {
  it('runs verifyToken then getUserProfileController', async () => {
    const res = await request(app).get('/users/profile');

    expect(mockVerifyToken).toHaveBeenCalledTimes(1);
    expect(mockControllers.getUserProfileController).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: 'profile' });
  });

  it('blocks the controller when verifyToken rejects', async () => {
    mockVerifyToken.mockImplementationOnce((req, res) =>
      res.status(401).json({ message: 'Unauthorized' })
    );

    const res = await request(app).get('/users/profile');

    expect(res.status).toBe(401);
    expect(mockControllers.getUserProfileController).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------
// GET /users/get/:id — protected + param
// ---------------------------------------------------------------
describe('GET /users/get/:id', () => {
  it('passes :id through to the controller', async () => {
    const res = await request(app).get('/users/get/42');

    expect(mockVerifyToken).toHaveBeenCalledTimes(1);
    expect(mockControllers.getUserByIdController).toHaveBeenCalledTimes(1);

    const [req] = mockControllers.getUserByIdController.mock.calls[0];
    expect(req.params.id).toBe('42');
    expect(res.status).toBe(200);
  });

  it('rejects when middleware rejects', async () => {
    mockVerifyToken.mockImplementationOnce((req, res) =>
      res.status(401).json({ message: 'Unauthorized' })
    );

    const res = await request(app).get('/users/get/42');

    expect(res.status).toBe(401);
    expect(mockControllers.getUserByIdController).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------
// PUT /users/ — protected
// ---------------------------------------------------------------
describe('PUT /users', () => {
  it('hits updateUserController with auth', async () => {
    const res = await request(app).put('/users').send({ first_name: 'X' });

    expect(mockVerifyToken).toHaveBeenCalledTimes(1);
    expect(mockControllers.updateUserController).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: 'update' });
  });
});

// ---------------------------------------------------------------
// DELETE /users/ — protected
// ---------------------------------------------------------------
describe('DELETE /users', () => {
  it('hits deleteUserController with auth', async () => {
    const res = await request(app).delete('/users');

    expect(mockVerifyToken).toHaveBeenCalledTimes(1);
    expect(mockControllers.deleteUserController).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: 'delete' });
  });
});

// ---------------------------------------------------------------
// GET /users/all — protected
// ---------------------------------------------------------------
describe('GET /users/all', () => {
  it('hits getUsersController with auth', async () => {
    const res = await request(app).get('/users/all');

    expect(mockVerifyToken).toHaveBeenCalledTimes(1);
    expect(mockControllers.getUsersController).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: 'getAll' });
  });
});

// ---------------------------------------------------------------
// Middleware ordering guard
// ---------------------------------------------------------------
describe('middleware ordering', () => {
  it('runs verifyToken BEFORE the controller on protected routes', async () => {
    const callOrder = [];
    mockVerifyToken.mockImplementationOnce((req, res, next) => {
      callOrder.push('verifyToken');
      next();
    });
    mockControllers.getUsersController.mockImplementationOnce((req, res) => {
      callOrder.push('getUsersController');
      res.status(200).json({ ok: true });
    });

    await request(app).get('/users/all');

    expect(callOrder).toEqual(['verifyToken', 'getUsersController']);
  });

  it('does NOT run verifyToken on public routes', async () => {
    await request(app).post('/users/login').send({});
    await request(app).post('/users/register').send({});

    expect(mockVerifyToken).not.toHaveBeenCalled();
  });
});