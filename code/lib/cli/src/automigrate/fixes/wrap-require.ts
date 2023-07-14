/* eslint-disable no-param-reassign */
import chalk from 'chalk';
import { dedent } from 'ts-dedent';
import * as t from '@babel/types';
import type { Fix } from '../types';
import { detectPnp } from '../../detect';
import { updateMainConfig } from '../helpers/mainConfigFile';

interface WrapRequireRunOptions {
  storybookVersion: string;
}

export const wrapRequire: Fix<WrapRequireRunOptions> = {
  id: 'wrap-require',

  async check({ packageManager, storybookVersion }) {
    const isStorybookInMonorepo = await packageManager.isStorybookInMonorepo();
    const isPnp = await detectPnp();

    if (!isStorybookInMonorepo && !isPnp) {
      return null;
    }

    return { storybookVersion };
  },

  prompt({ storybookVersion }) {
    const sbFormatted = chalk.cyan(`Storybook ${storybookVersion}`);

    return dedent`We've have detected, that you're using ${sbFormatted} in a monorepo or with PnP enabled. 
    We will apply some tweaks in your main config file to make it work in this special environment.`;
  },

  async run({ dryRun, mainConfigPath }) {
    updateMainConfig({ dryRun, mainConfigPath }, (mainConfig) => {
      const frameworkNode = mainConfig.getFieldNode(['framework']);
      const builderNode = mainConfig.getFieldNode(['core', 'builder']);
      const addons = mainConfig.getFieldNode(['addons']);

      const getRequireWrapperAsCallExpression = (value: string) => {
        // callExpression for "dirname(require.resolve(join(value, 'package.json')))""
        return t.callExpression(t.identifier('dirname'), [
          t.callExpression(t.memberExpression(t.identifier('require'), t.identifier('resolve')), [
            t.callExpression(t.identifier('join'), [
              t.stringLiteral(value),
              t.stringLiteral('package.json'),
            ]),
          ]),
        ]);
      };

      const wrapValueWithRequireWrapper = (node: t.Node) => {
        if (t.isStringLiteral(node)) {
          // value will be converted from StringLiteral to CallExpression.
          node.value = getRequireWrapperAsCallExpression(node.value) as any;
        } else if (t.isObjectExpression(node)) {
          const nameProperty = node.properties.find(
            (property) =>
              t.isObjectProperty(property) &&
              t.isIdentifier(property.key) &&
              property.key.name === 'name'
          ) as t.ObjectProperty;

          if (nameProperty && t.isStringLiteral(nameProperty.value)) {
            nameProperty.value = getRequireWrapperAsCallExpression(nameProperty.value.value);
          }
        }
      };

      if (frameworkNode) {
        wrapValueWithRequireWrapper(frameworkNode);
      }

      if (builderNode) {
        wrapValueWithRequireWrapper(builderNode);
      }

      if (addons && t.isArrayExpression(addons)) {
        addons.elements.forEach(wrapValueWithRequireWrapper);
      }

      mainConfig.setImport(['dirname, join'], 'path');
    });
  },
};
