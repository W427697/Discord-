/* eslint-disable no-underscore-dangle, @typescript-eslint/naming-convention */
declare var __STORYBOOK_ADDONS_MANAGER: any;

declare var CONFIG_TYPE: string;
declare var FEATURES: import('@storybook/types').StorybookConfig['features'];
declare var SB_CORE_CONFIG: Pick<
  import('@storybook/types').StorybookConfig['core'],
  'disableWhatsNewNotifications'
>;
declare var REFS: any;
declare var VERSIONCHECK: any;
declare var LOGLEVEL: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent' | undefined;
