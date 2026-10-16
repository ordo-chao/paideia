import { jest } from '@jest/globals';
import { Sequelize } from 'sequelize';

// =============================================================
// 1. Real in-memory SQLite, wired into Utils/db.js via mock
// =============================================================
const testSequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
});

jest.unstable_mockModule('../../Utils/db.js', () => ({
  default: testSequelize,
}));

// =============================================================
// 2. Import the real model AFTER swapping the DB
// ⚠️ Same path as the config test
// =============================================================
const Users = (await import('../../Models/Users.model.js')).default;

// =============================================================
// 3. Lifecycle
// =============================================================
beforeAll(async () => {
  await testSequelize.sync({ force: true });
});

afterAll(async () => {
  await testSequelize.close();
});

beforeEach(async () => {
  // force:true bypasses paranoid so soft-deleted rows are removed too
  await Users.destroy({ where: {}, force: true });
});

// =============================================================
// 4. Helpers
// =============================================================
const validUser = {
  email: 'alice@test.com',
  first_name: 'Alice',
  last_name: 'Smith',
  phone: '0700000000',
  password: 'hashed-pw',
  role: 'student',
  gender: 'female',
};

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// =============================================================
// 5. Sanity — the model is using OUR test DB
// =============================================================
test('model is bound to the test sequelize instance', () => {
  expect(Users.sequelize).toBe(testSequelize);
});

// =============================================================
// 6. Persistence
// =============================================================
describe('Users model — persistence', () => {
  it('creates a user and assigns a UUID v4 id', async () => {
    const user = await Users.create(validUser);

    expect(user.id).toMatch(UUID_V4);
    expect(user.email).toBe('alice@test.com');
    expect(user.role).toBe('student');
  });

  it('applies default values', async () => {
    const user = await Users.create(validUser);

    expect(user.is_active).toBe(true);
    expect(user.gender).toBe('female');
    expect(user.role).toBe('student');
    expect(user.created_at).toBeInstanceOf(Date);
  });

  it('applies default gender=male when gender omitted', async () => {
    const { gender, ...noGender } = validUser;
    const user = await Users.create(noGender);
    expect(user.gender).toBe('male');
  });

  it('applies default role=student when role omitted', async () => {
    const { role, ...noRole } = validUser;
    const user = await Users.create(noRole);
    expect(user.role).toBe('student');
  });

  it('enforces uniqueness on email', async () => {
    await Users.create(validUser);
    await expect(Users.create(validUser)).rejects.toThrow();
  });

  it('allows different emails', async () => {
    await Users.create(validUser);
    await expect(
      Users.create({ ...validUser, email: 'bob@test.com' })
    ).resolves.toBeDefined();
  });

  it('accepts every valid role', async () => {
    for (const role of ['admin', 'teacher', 'student', 'parent', 'staff']) {
      const user = await Users.create({
        ...validUser,
        email: `${role}@test.com`,
        role,
      });
      expect(user.role).toBe(role);
    }
  });
});

// =============================================================
// 7. Validation
// =============================================================
describe('Users model — validation', () => {
  it('rejects an invalid email', async () => {
    await expect(
      Users.create({ ...validUser, email: 'not-an-email' })
    ).rejects.toThrow();
  });

  it('rejects a missing required field (phone)', async () => {
    const { phone, ...noPhone } = validUser;
    await expect(Users.create(noPhone)).rejects.toThrow();
  });

  it('rejects a missing required field (password)', async () => {
    const { password, ...noPassword } = validUser;
    await expect(Users.create(noPassword)).rejects.toThrow();
  });

  it('rejects an invalid gender (validate.isIn)', async () => {
    await expect(
      Users.create({ ...validUser, gender: 'other' })
    ).rejects.toThrow(/gender must be male or female/);
  });

  it('rejects an invalid role (validate.isIn)', async () => {
    await expect(
      Users.create({ ...validUser, role: 'wizard' })
    ).rejects.toThrow(/invalid role/);
  });

  it('rejects a null gender', async () => {
    await expect(
      Users.create({ ...validUser, gender: null })
    ).rejects.toThrow();
  });

  it('rejects a null role', async () => {
    await expect(
      Users.create({ ...validUser, role: null })
    ).rejects.toThrow();
  });
});

// =============================================================
// 8. Default scope — password hidden from reads
// =============================================================
describe('Default scope', () => {
  it('excludes password from findOne', async () => {
    await Users.create(validUser);

    const found = await Users.findOne({ where: { email: 'alice@test.com' } });

    expect(found).not.toBeNull();
    expect(found.password).toBeUndefined();
  });

  it('excludes password from findAll', async () => {
    await Users.create(validUser);

    const [found] = await Users.findAll();

    expect(found.password).toBeUndefined();
  });

  it('excludes password from findByPk', async () => {
    const created = await Users.create(validUser);

    const found = await Users.findByPk(created.id);

    expect(found.password).toBeUndefined();
  });

  it('still exposes password on the create() result instance', async () => {
    const created = await Users.create(validUser);
    expect(created.password).toBe('hashed-pw');
  });
});

// =============================================================
// 9. withPassword scope
// =============================================================
describe('withPassword scope', () => {
  it('includes password when requested', async () => {
    await Users.create(validUser);

    const found = await Users.scope('withPassword').findOne({
      where: { email: 'alice@test.com' },
    });

    expect(found.password).toBe('hashed-pw');
  });

  it('includes password when chained with findByPk', async () => {
    const created = await Users.create(validUser);

    const found = await Users.scope('withPassword').findByPk(created.id);

    expect(found.password).toBe('hashed-pw');
  });
});

// =============================================================
// 10. Paranoid soft-delete
// =============================================================
describe('Paranoid soft-delete', () => {
  it('hides soft-deleted rows from default queries', async () => {
    const user = await Users.create(validUser);
    await user.destroy();

    const found = await Users.findOne({ where: { email: 'alice@test.com' } });
    expect(found).toBeNull();
  });

  it('sets deleted_at on destroy', async () => {
    const user = await Users.create(validUser);
    await user.destroy();

    const raw = await Users.unscoped().findOne({
      where: { email: 'alice@test.com' },
      paranoid: false,
    });

    expect(raw.deleted_at).toBeInstanceOf(Date);
  });

  it('exposes soft-deleted rows via unscoped + paranoid:false', async () => {
    const user = await Users.create(validUser);
    await user.destroy();

    const found = await Users.unscoped().findOne({
      where: { email: 'alice@test.com' },
      paranoid: false,
    });

    expect(found).not.toBeNull();
  });

  it('unscoped() alone does NOT reveal soft-deleted rows', async () => {
    // unscoped() removes the defaultScope, but paranoid filtering still applies.
    const user = await Users.create(validUser);
    await user.destroy();

    const found = await Users.unscoped().findOne({
      where: { email: 'alice@test.com' },
    });

    expect(found).toBeNull();
  });

  it('restores a soft-deleted row with restore()', async () => {
    const user = await Users.create(validUser);
    await user.destroy();

    const restored = await Users.unscoped().findOne({
      where: { email: 'alice@test.com' },
      paranoid: false,
    });
    await restored.restore();

    const found = await Users.findOne({ where: { email: 'alice@test.com' } });
    expect(found).not.toBeNull();
    expect(found.deleted_at).toBeNull();
  });

  it('permanently deletes with force:true', async () => {
    const user = await Users.create(validUser);
    await user.destroy({ force: true });

    const raw = await Users.unscoped().findOne({
      where: { email: 'alice@test.com' },
      paranoid: false,
    });
    expect(raw).toBeNull();
  });
});

// =============================================================
// 11. Email uniqueness + paranoid interaction
// =============================================================
describe('Email uniqueness with soft deletes', () => {
  it('documents whether a soft-deleted email can be reused', async () => {
    // ⚠️ This behavior differs between databases:
    //    - Postgres: unique index still applies to soft-deleted rows → reuse blocked
    //    - SQLite : same here (unique index applies regardless of deleted_at)
    // If your intent is to allow reuse, this test will fail — see the note at the
    // bottom of this file about partial unique indexes.
    const u = await Users.create(validUser);
    await u.destroy();

    await expect(Users.create(validUser)).rejects.toThrow();
  });
});

// =============================================================
// 12. Timestamps
// =============================================================
describe('Timestamps', () => {
  it('sets created_at and updated_at on create', async () => {
    const user = await Users.create(validUser);

    expect(user.created_at).toBeInstanceOf(Date);
    expect(user.updated_at).toBeInstanceOf(Date);
  });

  it('bumps updated_at on save', async () => {
    const user = await Users.create(validUser);
    const initialUpdated = user.updated_at;

    await new Promise((r) => setTimeout(r, 5));
    user.first_name = 'Alicia';
    await user.save();

    expect(user.updated_at.getTime()).toBeGreaterThan(initialUpdated.getTime());
  });

  it('bumps updated_at on update()', async () => {
    const user = await Users.create(validUser);
    const initialUpdated = user.updated_at;

    await new Promise((r) => setTimeout(r, 5));
    await user.update({ first_name: 'Alicia' });

    expect(user.updated_at.getTime()).toBeGreaterThan(initialUpdated.getTime());
  });
});

// =============================================================
// 13. Direct query interface
// =============================================================
describe('Query interface', () => {
  it('findOrCreate returns the existing row', async () => {
    await Users.create(validUser);

    const [user, created] = await Users.findOrCreate({
      where: { email: 'alice@test.com' },
      defaults: validUser,
    });

    expect(created).toBe(false);
    expect(user.email).toBe('alice@test.com');
  });

  it('findOrCreate creates when missing', async () => {
    const [user, created] = await Users.findOrCreate({
      where: { email: 'new@test.com' },
      defaults: { ...validUser, email: 'new@test.com' },
    });

    expect(created).toBe(true);
    expect(user.email).toBe('new@test.com');
  });

  it('count returns the number of users', async () => {
    await Users.create(validUser);
    await Users.create({ ...validUser, email: 'bob@test.com' });

    expect(await Users.count()).toBe(2);
  });

  it('findAll with where filters correctly', async () => {
    await Users.create(validUser);
    await Users.create({ ...validUser, email: 'bob@test.com', role: 'teacher' });

    const teachers = await Users.findAll({ where: { role: 'teacher' } });
    expect(teachers).toHaveLength(1);
    expect(teachers[0].email).toBe('bob@test.com');
  });
});

// =============================================================
// 14. What this test suite does NOT cover
// =============================================================
// - Postgres-specific behavior (real ENUM types, real UUID storage)
// - Real email deliverability (that's the service layer's TODO)
// - Password hashing (bcrypt) — mocked at service layer
// - Cascade deletes on related tables (add those when models are added)
//
// For Postgres behavior, run this suite against a real Postgres test DB:
//   const testSequelize = new Sequelize(process.env.TEST_DATABASE_URL, { logging: false });
// Everything else in this file stays the same.