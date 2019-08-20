/* global document */

import { makeDecorator } from '@storybook/addons';
import styles from './styles';
import parameters from './parameters';

const createStyled = (style: Partial<CSSStyleDeclaration>) => () => {
  const element = document.createElement('div') as HTMLDivElement;
  Object.assign(element.style, style);
  return element;
};

const createInner = createStyled(styles.innerStyle);

const createOuter = createStyled(styles.style);

// domWrappers allows to decorate the mounting point with direct DOM manipulation,
// without the need to provide a specific Svelte component
const centered = (storyFn: () => any) => {
  const { domWrappers = [], ...story } = storyFn();
  const centeredDomWrapper = (target: HTMLElement) => {
    const outer = createOuter();
    const inner = createInner();
    target.appendChild(outer);
    outer.appendChild(inner);
    return inner;
  };
  return { ...story, domWrappers: [...domWrappers, centeredDomWrapper] };
};

export default makeDecorator({
  ...parameters,
  wrapper: getStory => centered(getStory as any),
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
