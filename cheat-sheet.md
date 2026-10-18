# `package.json` Scripts — Cheat Sheet

## Universal rules

```bash
npm run <script>                 # run any script (except reserved names)
npm test | npm start             # reserved: run bare, no "run"
npm run <script> -- <args>       # pass args through to the underlying command
```

**Reserved bare-runnable names:** `start`, `test`, `stop`, `restart`

---

## Test scripts

### `test` — all tests
```bash
npm test                                        # full suite
npm test -- tests/Models/User.model.test.js     # one file
npm test -- --watch                             # watch mode
npm test -- -t "gender"                         # filter by test name
npm test -- -t "gender" tests/Models/User.model.test.js   # filter + file
```

### `test:unit` — unit tests only
```bash
npm run test:unit
npm run test:unit -- --watch
npm run test:unit -- -t "email"
```

Runs: `tests/Models/User.model.test.js` + `tests/Controllers` + `tests/Services` + `tests/Repositories` + `tests/Routes`

### `test:integration` — integration tests only
```bash
npm run test:integration
npm run test:integration -- --watch
```

Runs: `tests/Integration`

---

## Run scripts

### `start` — production server
```bash
npm start                       # node index.js
```

### `dev` — dev server with hot reload
```bash
npm run dev                     # nodemon index.js
```

---

## Migration scripts

### `migrate:create` — new migration file (⚠️ needs name)
```bash
npm run migrate:create -- add-users-table
```

### `migrate:up` — apply pending
```bash
npm run migrate:up
```

### `migrate:down` — roll back last
```bash
npm run migrate:down
npm run migrate:down -- 3       # N steps (if supported)
```

### `migrate:redo` — down then up (⚠️ POSIX-only `&&`)
```bash
npm run migrate:redo
```

### `migrate` — raw passthrough
```bash
npm run migrate -- up
npm run migrate -- create my-migration
npm run migrate -- --help
```

---

## Database scripts

### `db:reset` — ⚠️ destructive, dev only
```bash
npm run db:reset
```

---

## Quick reference

| Command | Effect |
|---|---|
| `npm test` | all tests |
| `npm test -- <file>` | one file |
| `npm test -- -t "<name>"` | one test by name |
| `npm run test:unit` | unit suite |
| `npm run test:integration` | integration suite |
| `npm start` | prod server |
| `npm run dev` | dev server (nodemon) |
| `npm run migrate:create -- <name>` | new migration |
| `npm run migrate:up` | apply migrations |
| `npm run migrate:down` | rollback one |
| `npm run migrate:redo` | re-apply last |
| `npm run db:reset` | reset DB (destructive) |

---

## Gotchas to remember

- **`--` is mandatory** when passing args to a script.
- **`migrate:create` fails without a name** — always pass `-- <name>`.
- **`migrate:redo`** uses `&&` — breaks on Windows `cmd.exe`.
- **`db:reset`** drops data — never on production.
- **`test:unit`** explicitly lists dirs — new test dirs are **not** auto-included.
- **`test`** picks up everything Jest's `testMatch` finds — add `--testPathIgnorePatterns` to exclude, e.g. `npm test -- --testPathIgnorePatterns=Integration`.