/* eslint-disable no-param-reassign */
import chalk from 'chalk';
import { dedent } from 'ts-dedent';
import * as t from '@babel/types';
import type { ConfigFile } from '@storybook/csf-tools';
import { readConfig } from '@storybook/csf-tools';
import type { Fix } from '../types';
import { detectPnp } from '../../detect';
import { updateMainConfig } from '../helpers/mainConfigFile';

interface WrapRequireRunOptions {
  storybookVersion: string;
  isStorybookInMonorepo: boolean;
  isPnp: boolean;
}

/**
 * Check if the node needs to be wrapped with require wrapper.
 */
const isRequireWrapperNecessary = (
  node: t.Node,
  cb: (node: t.StringLiteral | t.ObjectProperty) => void = () => {}
) => {
  if (t.isStringLiteral(node)) {
    // value will be converted from StringLiteral to CallExpression.
    cb(node);
    return true;
  }

  if (t.isObjectExpression(node)) {
    const nameProperty = node.properties.find(
      (property) =>
        t.isObjectProperty(property) && t.isIdentifier(property.key) && property.key.name === 'name'
    ) as t.ObjectProperty;

    if (nameProperty && t.isStringLiteral(nameProperty.value)) {
      cb(nameProperty);
      return true;
    }
  }

  return false;
};

/**
 * Get all fields that need to be wrapped with require wrapper.
 * @returns Array of fields that need to be wrapped with require wrapper.
 */
const getFieldsForRequireWrapper = (config: ConfigFile) => {
  const frameworkNode = config.getFieldNode(['framework']);
  const builderNode = config.getFieldNode(['core', 'builder']);
  const addons = config.getFieldNode(['addons']);

  const fieldsWithRequireWrapper = [
    ...(frameworkNode ? [frameworkNode] : []),
    ...(builderNode ? [builderNode] : []),
    ...(addons && t.isArrayExpression(addons) ? addons.elements : []),
  ];

  return fieldsWithRequireWrapper;
};

export const wrapRequire: Fix<WrapRequireRunOptions> = {
  id: 'wrap-require',

  async check({ packageManager, storybookVersion, mainConfigPath }) {
    const isStorybookInMonorepo = await packageManager.isStorybookInMonorepo();
    const isPnp = await detectPnp();

    const config = await readConfig(mainConfigPath);

    if (!isStorybookInMonorepo && !isPnp) {
      return null;
    }

    if (!getFieldsForRequireWrapper(config).some((node) => isRequireWrapperNecessary(node))) {
      return null;
    }

    return { storybookVersion, isStorybookInMonorepo, isPnp };
  },

  prompt({ storybookVersion, isStorybookInMonorepo }) {
    const sbFormatted = chalk.cyan(`Storybook ${storybookVersion}`);

    return dedent`We have detected that you're using ${sbFormatted} in a ${
      isStorybookInMonorepo ? 'monorepo' : 'PnP'
    } project. We will apply some tweaks in your main config file to make it work in this special environment.`;
  },

  async run({ dryRun, mainConfigPath }) {
    updateMainConfig({ dryRun, mainConfigPath }, (mainConfig) => {
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
        isRequireWrapperNecessary(node, (n) => {
          if (t.isStringLiteral(n)) {
            n.value = getRequireWrapperAsCallExpression(n.value) as any;
          }

          if (t.isObjectProperty(n) && t.isStringLiteral(n.value)) {
            n.value = getRequireWrapperAsCallExpression(n.value.value) as any;
          }
        });
      };

      getFieldsForRequireWrapper(mainConfig).forEach((node) => {
        wrapValueWithRequireWrapper(node);
      });

      mainConfig.setImport(['dirname, join'], 'path');
    });
  },
};
