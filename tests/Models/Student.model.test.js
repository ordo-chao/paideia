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
  TEXT: 'TEXT',
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
const modelModule = await import('../../Models/Students.model.js');
const Students = modelModule.default;

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
  expect(Students.__fakeModel).toBe(true);
  expect(Students.name).toBe('students');
});

test('model is wired to the mocked sequelize instance', async () => {
  const db = await import('../../Utils/db.js');
  expect(db.default).toBe(mockSequelize);
});

// NOTE: read from below

// =============================================================
// 5. Table-level options
// =============================================================
describe('Model definition options', () => {
  it('uses "users" as the table name (no pluralization)', () => {
    expect(tableName).toBe('students');
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

  it('excludes timestamp columns from the default scope', () => {
    expect(options.defaultScope).toEqual({
      attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
    });
  });

  it('defines a withDeleted scope that includes deleted_at', () => {
    expect(options.scopes).toHaveProperty('withDeleted');
    expect(options.scopes.withDeleted).toEqual({
      attributes: { include: ['deleted_at'] },
    });
  });
});

// =============================================================
// 6. Column-level assertions
// =============================================================
describe('Column: user_id', () => {
  it('is a UUID primary key with a UUIDV4 default', () => {
    expect(attributes.user_id.type).toBe('UUID');
    expect(attributes.user_id.primaryKey).toBe(true);
  });
});

describe('Column: birth date', () => {
  it('is a required DATE and not nullable', () => {
    expect(attributes.birth_date.type).toBe('DATE');
    expect(attributes.birth_date.allowNull).toBe(false);
  });
});

describe('Column: nationality', () => {
  it('is a required STRING and not nullable', () => {
    expect(attributes.nationality.type).toBe('STRING');
    expect(attributes.nationality.allowNull).toBe(false);
  });
});

describe('Column: address', () => {
  it('is a required STRING and not nullable', () => {
    expect(attributes.address.type).toBe('STRING');
    expect(attributes.address.allowNull).toBe(false);
  });
});

describe('Column: photo_url', () => {
  it('is a required STRING and not nullable', () => {
    expect(attributes.photo_url.type).toBe('STRING');
    expect(attributes.photo_url.allowNull).toBe(true);
  });
});

describe('Column: enrollment date', () => {
  it('is a required DATE and not nullable', () => {
    expect(attributes.enrollment_date.type).toBe('DATE');
    expect(attributes.enrollment_date.allowNull).toBe(false);
    expect(attributes.enrollment_date.defaultValue).toBe('NOW');
  });
});

describe('Column: current_grade', () => {
  it('is a required STRING and not nullable', () => {
    expect(attributes.current_grade.type).toBe('STRING');
    expect(attributes.current_grade.allowNull).toBe(false);
  });
});


describe('Column: status', () => {
  it('is a required ENUM with the expected values and default active', () => {
    expect(attributes.status.type.__enum).toEqual([
      'active', 'suspended' , 'graduated' , 'transferred' , 'dropped'
    ]);
    expect(attributes.status.allowNull).toBe(false);
    expect(attributes.status.defaultValue).toBe('active');
  });

  it('also enforces values at the Sequelize layer via validate.isIn', () => {
    expect(attributes.status.validate).toEqual({
      isIn: {
        args: [['active', 'suspended' , 'graduated' , 'transferred' , 'dropped']],
        msg: 'invalid status',
      },
    });
  });
});

describe('Column: allergies', () => {
  it('is a required STRING', () => {
    expect(attributes.allergies.type).toBe('TEXT');
    expect(attributes.allergies.allowNull).toBe(true);
  });
});

describe('Column: medical notes', () => {
  it('is a required STRING', () => {
    expect(attributes.medical_notes.type).toBe('TEXT');
    expect(attributes.medical_notes.allowNull).toBe(true);
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


// =============================================================
// 7. Full column inventory — catches accidental additions/removals
// =============================================================
describe('Column inventory', () => {
  it('contains exactly the expected columns', () => {
    expect(Object.keys(attributes).sort()).toEqual(
      [
        'user_id',
        'birth_date',
        'nationality',
        'address',
        'photo_url',
        'enrollment_date',
        'current_grade',
        'status',
        'allergies',
        'medical_notes',
        'created_at',
        'updated_at',
        'deleted_at',
      ].sort()
    );
  });
});