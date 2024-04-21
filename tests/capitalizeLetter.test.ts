import { expect, test } from 'bun:test'
import { capitalizeLetter } from '@/lib/utils'

// Első karakter nagybetűssé alakítás tesztek
test('"teszt felhasználó" -> "Teszt felhasználó"', () => {
  const str = capitalizeLetter('teszt felhasználó', false);
  expect(str).toBe('Teszt felhasználó');
});

test('"teszt felhasználó" -> "Teszt Felhasználó"', () => {
  const str = capitalizeLetter('teszt felhasználó', true);
  expect(str).toBe('Teszt Felhasználó');
});