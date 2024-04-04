import { it, vi, expect, beforeEach } from 'vitest';
import { fn, onMockCalled } from './spy';

const vitestSpy = vi.fn();

beforeEach(() => {
  const unsubscribe = onMockCalled(vitestSpy);
  return () => unsubscribe();
});

it('mocks are reactive', () => {
  const storybookSpy = fn();
  storybookSpy(1);
  expect(vitestSpy).toHaveBeenCalledWith(storybookSpy, [1]);
});
