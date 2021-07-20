import {
  StoryFn as StoryFunction,
  StoryContext,
  useMemo,
  useEffect,
  useGlobals,
} from '@storybook/addons';

import { PARAM_KEY as BACKGROUNDS_PARAM_KEY } from '../constants';
import {
  clearStyles,
  addBackgroundStyle,
  getBackgroundColorByName,
  isReduceMotionEnabled,
} from '../helpers';

export const withBackground = (StoryFn: StoryFunction, context: StoryContext) => {
  const { globals, parameters } = context;
  const globalsBackgroundColor = globals[BACKGROUNDS_PARAM_KEY]?.value;
  const backgroundsConfig = parameters[BACKGROUNDS_PARAM_KEY];
  const [, updateGlobals] = useGlobals();

  const selectedBackgroundColor = useMemo(() => {
    if (backgroundsConfig.disable) {
      return 'transparent';
    }

    return getBackgroundColorByName(
      globalsBackgroundColor,
      backgroundsConfig.values,
      backgroundsConfig.default
    );
  }, [backgroundsConfig, globalsBackgroundColor]);

  const isActive = useMemo(
    () => selectedBackgroundColor && selectedBackgroundColor !== 'transparent',
    [selectedBackgroundColor]
  );

  const selector =
    context.viewMode === 'docs' ? `#anchor--${context.id} .docs-story` : '.sb-show-main';

  const backgroundStyles = useMemo(() => {
    const transitionStyle = 'transition: background-color 0.3s;';
    return `
      ${selector} {
        background: ${selectedBackgroundColor} !important;
        ${isReduceMotionEnabled() ? '' : transitionStyle}
      }
    `;
  }, [selectedBackgroundColor, selector]);

  useEffect(() => {
    if (selectedBackgroundColor !== globalsBackgroundColor) {
      updateGlobals({
        [BACKGROUNDS_PARAM_KEY]: {
          ...globals[BACKGROUNDS_PARAM_KEY],
          value: selectedBackgroundColor,
        },
      });
    }
  }, []);

  useEffect(() => {
    const selectorId =
      context.viewMode === 'docs'
        ? `addon-backgrounds-docs-${context.id}`
        : `addon-backgrounds-color`;

    if (!isActive) {
      clearStyles(selectorId);
      return;
    }

    addBackgroundStyle(
      selectorId,
      backgroundStyles,
      context.viewMode === 'docs' ? context.id : null
    );
  }, [isActive, backgroundStyles, context]);

  return StoryFn();
};
