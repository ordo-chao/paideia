import { jest } from '@jest/globals';

// =============================================================
// 1. Mock sequelize + DataTypes BEFORE importing the model
// =============================================================

// Manual call recorder — immune to Jest's clearMocks:true
const defineCalls = [];

const defineImpl = (name, attributes, options) => {
  const model = { __fakeModel: true, name, attributes, options };
  defineCalls.push({ name, attributes, options, model });
  return model;
};

const mockSequelize = { define: defineImpl };

// Fake DataTypes — identity values for assertions
const DataTypes = {
  UUID: 'UUID',
  UUIDV4: 'UUIDV4',
  STRING: 'STRING',
  ENUM: (...values) => ({ __enum: values }),
  BOOLEAN: 'BOOLEAN',
  DATE: 'DATE',
  NOW: 'NOW',
};

jest.unstable_mockModule('../../Utils/db.js', () => ({
  default: mockSequelize,
}));

jest.unstable_mockModule('sequelize', () => ({
  DataTypes,
}));

// =============================================================
// 2. Import the model AFTER mocking
// =============================================================
const modelModule = await import('../../Models/Users.model.js');
const Users = modelModule.default;

// =============================================================
// 3. Fail fast if the mock didn't fire
// =============================================================
if (defineCalls.length !== 1) {
  throw new Error(
    `Expected sequelize.define to be called exactly once, got ${defineCalls.length}. ` +
    `Mock likely not applied — check the path in jest.unstable_mockModule.`
  );
}

// Extract what was actually passed to sequelize.define
const { name: tableName, attributes, options } = defineCalls[0];

// =============================================================
// 4. Sanity checks
// =============================================================
test('model is defined via sequelize.define', () => {
  expect(defineCalls).toHaveLength(1);
  expect(Users.__fakeModel).toBe(true);
  expect(Users.name).toBe('users');
});

test('model is wired to the mocked sequelize instance', async () => {
  const db = await import('../../Utils/db.js');
  expect(db.default).toBe(mockSequelize);
});

// =============================================================
// 5. Table-level options
// =============================================================
describe('Model definition options', () => {
  it('uses "users" as the table name (no pluralization)', () => {
    expect(tableName).toBe('users');
  });

  it('enables timestamps and renames them to snake_case', () => {
    expect(options.timestamps).toBe(true);
    expect(options.createdAt).toBe('created_at');
    expect(options.updatedAt).toBe('updated_at');
  });

  it('enables paranoid soft-delete on deleted_at', () => {
    expect(options.paranoid).toBe(true);
    expect(options.deletedAt).toBe('deleted_at');
  });

  it('freezes the table name', () => {
    expect(options.freezeTableName).toBe(true);
  });

  it('excludes password from the default scope', () => {
    expect(options.defaultScope).toEqual({
      attributes: { exclude: ['password'] },
    });
  });

  it('defines a withPassword scope that includes password', () => {
    expect(options.scopes).toHaveProperty('withPassword');
    expect(options.scopes.withPassword).toEqual({
      attributes: { include: ['password'] },
    });
  });
});

// =============================================================
// 6. Column-level assertions
// =============================================================
describe('Column: id', () => {
  it('is a UUID primary key with a UUIDV4 default', () => {
    expect(attributes.id.type).toBe('UUID');
    expect(attributes.id.primaryKey).toBe(true);
    expect(attributes.id.defaultValue).toBe('UUIDV4');
  });
});

describe('Column: email', () => {
  it('is unique and validated as an email', () => {
    expect(attributes.email.type).toBe('STRING');
    expect(attributes.email.unique).toBe(true);
    expect(attributes.email.validate).toEqual({ isEmail: true });
  });
});

describe('Column: gender', () => {
  it('is a required ENUM of male/female with default male', () => {
    expect(attributes.gender.type.__enum).toEqual(['male', 'female']);
    expect(attributes.gender.allowNull).toBe(false);
    expect(attributes.gender.defaultValue).toBe('male');
  });

  it('also enforces values at the Sequelize layer via validate.isIn', () => {
    expect(attributes.gender.validate).toEqual({
      isIn: {
        args: [['male', 'female']],
        msg: 'gender must be male or female',
      },
    });
  });
});

describe('Column: role', () => {
  it('is a required ENUM with the expected values and default student', () => {
    expect(attributes.role.type.__enum).toEqual([
      'admin',
      'teacher',
      'student',
      'parent',
      'staff',
    ]);
    expect(attributes.role.allowNull).toBe(false);
    expect(attributes.role.defaultValue).toBe('student');
  });

  it('also enforces values at the Sequelize layer via validate.isIn', () => {
    expect(attributes.role.validate).toEqual({
      isIn: {
        args: [['admin', 'teacher', 'student', 'parent', 'staff']],
        msg: 'invalid role',
      },
    });
  });
});

describe('Column: phone', () => {
  it('is a required STRING', () => {
    expect(attributes.phone.type).toBe('STRING');
    expect(attributes.phone.allowNull).toBe(false);
  });
});

describe('Column: password', () => {
  it('is a required STRING', () => {
    expect(attributes.password.type).toBe('STRING');
    expect(attributes.password.allowNull).toBe(false);
  });
});

describe('Column: is_active', () => {
  it('is a required BOOLEAN defaulting to true', () => {
    expect(attributes.is_active.type).toBe('BOOLEAN');
    expect(attributes.is_active.allowNull).toBe(false);
    expect(attributes.is_active.defaultValue).toBe(true);
  });
});

describe('Column: last_seen', () => {
  it('is an optional DATE', () => {
    expect(attributes.last_seen.type).toBe('DATE');
    expect(attributes.last_seen.allowNull).toBe(true);
  });
});

describe('Column: created_at / updated_at / deleted_at', () => {
  it('created_at is a required DATE defaulting to now', () => {
    expect(attributes.created_at.type).toBe('DATE');
    expect(attributes.created_at.allowNull).toBe(false);
    expect(attributes.created_at.defaultValue).toBe('NOW');
  });

  it('updated_at is an optional DATE', () => {
    expect(attributes.updated_at.type).toBe('DATE');
    expect(attributes.updated_at.allowNull).toBe(true);
  });

  it('deleted_at is an optional DATE', () => {
    expect(attributes.deleted_at.type).toBe('DATE');
    expect(attributes.deleted_at.allowNull).toBe(true);
  });
});

describe('Column: first_name / last_name', () => {
  it('are optional STRINGs', () => {
    expect(attributes.first_name.type).toBe('STRING');
    expect(attributes.first_name.allowNull).toBe(true);
    expect(attributes.last_name.type).toBe('STRING');
    expect(attributes.last_name.allowNull).toBe(true);
  });
});

// =============================================================
// 7. Full column inventory — catches accidental additions/removals
// =============================================================
describe('Column inventory', () => {
  it('contains exactly the expected columns', () => {
    expect(Object.keys(attributes).sort()).toEqual(
      [
        'id',
        'first_name',
        'last_name',
        'email',
        'gender',
        'phone',
        'password',
        'role',
        'is_active',
        'last_seen',
        'created_at',
        'updated_at',
        'deleted_at',
      ].sort()
    );
  });
});