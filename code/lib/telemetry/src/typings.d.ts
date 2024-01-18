// TODO remove as https://github.com/egoist/detect-package-manager/pull/15 is merged, released and updated
declare module 'detect-package-manager' {
  declare type PM = 'npm' | 'yarn' | 'pnpm';
  declare const detect: ({ cwd }?: { cwd?: string | undefined }) => Promise<PM>;

  declare function getNpmVersion(pm: PM): Promise<string>;
  declare function clearCache(): void;

  export { PM, clearCache, detect, getNpmVersion };
}
