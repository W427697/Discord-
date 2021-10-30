import global from 'global';

import './angular-polyfills';
import '@angular/compiler';

const { window: globalWindow } = global;

globalWindow.STORYBOOK_ENV = 'angular';
