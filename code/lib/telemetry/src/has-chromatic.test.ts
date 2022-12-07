import { hasChromatic } from './has-chromatic';

it('works for dependencies', () => {
  expect(hasChromatic({ dependencies: { chromatic: '^6.11.4' } })).toBe(true);
});

it('works for scripts', () => {
  expect(hasChromatic({ scripts: { chromatic: 'npx chromatic -t abc123' } })).toBe(true);
});

it('fails otherwise', () => {
  expect(hasChromatic({})).toBe(false);
});
