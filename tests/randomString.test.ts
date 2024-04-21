import { expect, test } from 'bun:test'
import { randomString } from '@/lib/utils'

// Random string generálás tesztek
test('10 karakter hosszú random string', () => {
  const str = randomString(10);
  expect(str.length).toBe(10);
});

test('50 karakter hosszú csak számokat tartalmazó string', () => {
  const str = randomString(50, /[A-z]/g);
  expect(str.length).toBe(50);
  expect(str).toMatch(/[0-9]/g);
});

test('20 karakter hosszú, csak kisbetűs karaktereket tartalmazó string', () => {
  const str = randomString(20, /[A-Z0-9]/g);
  expect(str.length).toBe(20);
  expect(str).toMatch(/[a-z]/g)
});