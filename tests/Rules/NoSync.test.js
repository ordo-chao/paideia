import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git' || entry === 'migrations' || entry === 'tests') {
      continue;
    }
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else if (full.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

test('no source file calls sequelize.sync()', () => {
  const files = walk(process.cwd());
  const offenders = [];

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    if (/sequelize\.sync\s*\(/.test(content) || /\bdb\.sync\s*\(/.test(content)) {
      offenders.push(file);
    }
  }

  expect(offenders).toEqual([]);
});