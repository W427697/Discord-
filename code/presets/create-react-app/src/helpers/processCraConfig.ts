import { resolve } from 'path';
import type { Configuration, RuleSetCondition, RuleSetRule } from 'webpack';
import semver from 'semver';
import type { PluginOptions } from '../types';

type RuleSetConditions = RuleSetCondition[];

const isRegExp = (value: RegExp | unknown): value is RegExp => value instanceof RegExp;

// This handles arrays in Webpack rule tests.
const testMatch = (rule: RuleSetRule, string: string): boolean => {
  if (!rule.test) return false;
  return Array.isArray(rule.test)
    ? rule.test.some((test) => isRegExp(test) && test.test(string))
    : isRegExp(rule.test) && rule.test.test(string);
};

export const processCraConfig = (
  craWebpackConfig: Configuration,
  options: PluginOptions
): RuleSetRule[] => {
  const configDir = resolve(options.configDir);

  /*
   * NOTE: As of version 5.3.0 of Storybook, Storybook's default loaders are no
   * longer appended when using this preset, meaning less customization is
   * needed when used alongside that version.
   *
   * When loaders were appended in previous Storybook versions, some CRA loaders
   * had to be disabled or modified to avoid conflicts.
   *
   * See: https://github.com/storybookjs/storybook/pull/9157
   */
  const storybookVersion = semver.coerce(options.packageJson.version) || '';
  const isStorybook530 = semver.gte(storybookVersion, '5.3.0');

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return craWebpackConfig.module!.rules.reduce((rules, rule): RuleSetRule[] => {
    const { oneOf, include } = rule as RuleSetRule;

    // Add our `configDir` to support JSX and TypeScript in that folder.
    if (testMatch(rule as RuleSetRule, '.jsx')) {
      const newRule = {
        ...(rule as RuleSetRule),
        include: [include as string, configDir].filter(Boolean),
      };
      return [...rules, newRule];
    }

    /*
     * CRA makes use of Webpack's `oneOf` feature.
     * https://webpack.js.org/configuration/module/#ruleoneof
     *
     * Here, we map over those rules and add our `configDir` as above.
     */
    if (oneOf) {
      return [
        ...rules,
        {
          oneOf: oneOf.map((oneOfRule: RuleSetRule): RuleSetRule => {
            if (oneOfRule.type === 'asset/resource') {
              if (isStorybook530) {
                const excludes = [
                  'ejs', // Used within Storybook.
                  'md', // Used with Storybook Notes.
                  'mdx', // Used with Storybook Docs.
                  'cjs', // Used for CommonJS modules.
                  ...(options.craOverrides?.fileLoaderExcludes || []),
                ];
                const excludeRegex = new RegExp(`\\.(${excludes.join('|')})$`);
                return {
                  ...oneOfRule,

                  exclude: [...(oneOfRule.exclude as RuleSetConditions), excludeRegex],
                };
              }
              return {};
            }

            // This rule causes conflicts with Storybook addons like `addon-info`.
            if (testMatch(oneOfRule, '.css')) {
              return {
                ...oneOfRule,
                include: isStorybook530 ? undefined : [configDir],
                exclude: [oneOfRule.exclude as RegExp, /@storybook/],
              };
            }

            return oneOfRule;
          }),
        },
      ];
    }

    return [...rules, rule as RuleSetRule];
  }, [] as RuleSetRule[]);
};
