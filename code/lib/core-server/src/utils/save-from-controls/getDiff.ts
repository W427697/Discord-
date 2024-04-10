import { diffLines } from 'diff';

/**
 * Get a diff between two strings
 * @param before The original string
 * @param after The new string
 * @returns The diff as a string
 * @example
 * ```ts
 * const before = 'foo\nbar\nbaz';
 * const after = 'foo\nbaz';
 * const diff = getDiff(before, after);
 * console.log(diff);
 * //   foo
 * // - bar
 * //   baz
 * ```
 */
export function getDiff(before: string, after: string): string {
  const context = 4;
  return diffLines(before, after, { newlineIsToken: true })
    .map((r, index, l) => {
      if (r.removed) {
        return r.value
          .split('\n')
          .map((v) => `- ${v}`)
          .join('\n');
      }
      if (r.added) {
        return r.value
          .split('\n')
          .map((v) => `+ ${v}`)
          .join('\n');
      }

      if (index === 0) {
        return (
          `...\n` +
          r.value
            .split('\n')
            .slice(0 - context)
            .map((v) => `  ${v}`)
            .join('\n')
        );
      }

      if (index === l.length - 1) {
        return (
          r.value
            .split('\n')
            .slice(0, context)
            .map((v) => `  ${v}`)
            .join('\n') + `\n...`
        );
      }

      const all = r.value.split('\n').map((v) => `  ${v}`);
      return [
        //
        ...all.slice(0, context),
        '...',
        ...all.slice(0 - context),
      ].join('\n');
    })
    .join('\n');
}
