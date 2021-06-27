import root from 'window-or-global';
import { AugmentedWindow } from '../types';

const rootProxy = root as AugmentedWindow;

rootProxy.__STORYBOOK_CLIENT_API__ = undefined;
rootProxy.__STORYBOOK_STORY_STORE__ = undefined;
rootProxy.__STORYBOOK_ADDONS_CHANNEL__ = undefined;
rootProxy.STORYBOOK_REACT_CLASSES = {};
rootProxy.FEATURES = { previewCsfV3: false };
