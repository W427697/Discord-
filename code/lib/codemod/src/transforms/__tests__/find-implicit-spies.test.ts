import { beforeEach, expect, test, vi } from 'vitest';
import transform from '../find-implicit-spies';
import dedent from 'ts-dedent';
import ansiRegex from 'ansi-regex';

expect.addSnapshotSerializer({
  print: (val, print) => print((val as string).replace(ansiRegex(), '')),
  test: (value) => typeof value === 'string' && ansiRegex().test(value),
});

const tsTransform = async (source: string) => transform({ source, path: 'Component.stories.tsx' });

const warn = vi.spyOn(console, 'warn');

beforeEach(() => {
  warn.mockImplementation(() => {});
});

test('replace jest and testing-library with the test package', async () => {
  const input = dedent`
    Interactions.play = async ({ args }) => {
      await userEvent.click(screen.getByRole("button"));
      await expect(args.onButtonIconClick).toHaveBeenCalled();
    };

  `;

  await tsTransform(input);

  expect(warn.mock.calls).toMatchInlineSnapshot(`
    [
      [
        "Component.stories.tsx Possible implicit spy found
      1 | Interactions.play = async ({ args }) => {
      2 |   await userEvent.click(screen.getByRole("button"));
    > 3 |   await expect(args.onButtonIconClick).toHaveBeenCalled();
        |                     ^^^^^^^^^^^^^^^^^
      4 | };
      5 |",
      ],
    ]
  `);
});
