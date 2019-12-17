import fs from 'fs';
import { logger } from '@storybook/node-logger';

type PresetOptions = {
  actions?: any;
  backgrounds?: any;
  knobs?: any;
  links?: any;
  viewport?: any;
};

const makeAddon = (key: string) => `@storybook/addon-${key}`;
const addonsToRegister = ['actions', 'backgrounds', 'links', 'viewport'].map(makeAddon);
const presetsToRegister = ['knobs'].map(makeAddon);

export function presets(options: PresetOptions = {}) {
  const presetAddons = presetsToRegister
    .filter(key => (options as any)[key] !== false)
    .map(makeAddon)
    .map(addon => `${addon}/preset`);
  return presetAddons;
}

export function addons(entry: any[] = [], options: PresetOptions = {}) {
  const registerAddons = addonsToRegister
    .filter(key => (options as any)[key] !== false)
    .map(makeAddon)
    .map(addon => `${addon}/register`);

  return [...entry, ...registerAddons];
}

async function updatePackageDependencies() {
  const isInstalled = (packageJson: any, addon: string, version: string) => {
    const { dependencies, devDependencies } = packageJson;
    return (
      (dependencies && dependencies[addon] === version) ||
      (devDependencies && devDependencies[addon] === version)
    );
  };
  // eslint-disable-next-line global-require
  const { version: currentVersion } = require('../package.json');
  try {
    // FIXME: find-pkg-up
    const packageJson = JSON.parse(fs.readFileSync('./package.json').toString());
    const requiredPackages = [...addonsToRegister, ...presetsToRegister].map(makeAddon);
    let packageAdded = false;
    requiredPackages.forEach(addon => {
      if (!isInstalled(packageJson, addon, currentVersion)) {
        packageAdded = true;
        packageJson.devDependencies = {
          ...packageJson.devDependencies,
          [addon]: currentVersion,
        };
      }
    });
    if (packageAdded) {
      fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    }
  } catch (err) {
    logger.error(`Error reading package.json: ${err.message}`);
  }
}

updatePackageDependencies();
