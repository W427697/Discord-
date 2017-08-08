import React from 'react';
import ReactDOMServer from 'react-dom/server';
import addons from '@storybook/addons';
import deprecate from 'util-deprecate';
import Story from './components/Story';
import { EVENT_ID } from './config';
import { H1, H2, H3, H4, H5, H6, Code, P, UL, A, LI } from './components/markdown';

const defaultOptions = {
  inline: false,
  header: true,
  source: true,
  propTables: [],
  maxPropsIntoLine: 3,
  maxPropObjectKeys: 3,
  maxPropArrayLength: 3,
  maxPropStringLength: 50,
  hideInfoButton: true,
  sendToPanel: true,
};

const defaultMarksyConf = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  code: Code,
  p: P,
  a: A,
  li: LI,
  ul: UL,
};

function addInfo(storyFn, context, infoOptions) {
  const options = {
    ...defaultOptions,
    ...infoOptions,
  };

  // props.propTables can only be either an array of components or null
  // propTables option is allowed to be set to 'false' (a boolean)
  // if the option is false, replace it with null to avoid react warnings
  if (!options.propTables) {
    options.propTables = null;
  }

  const marksyConf = { ...defaultMarksyConf };
  if (options && options.marksyConf) {
    Object.assign(marksyConf, options.marksyConf);
  }
  const props = {
    info: options.text,
    context,
    showInline: Boolean(options.inline),
    showHeader: Boolean(options.header),
    showSource: Boolean(options.source),
    hideInfoButton: Boolean(options.hideInfoButton),
    propTables: options.propTables,
    propTablesExclude: options.propTablesExclude,
    styles: typeof options.styles === 'function' ? options.styles : s => s,
    marksyConf,
    maxPropObjectKeys: options.maxPropObjectKeys,
    maxPropArrayLength: options.maxPropArrayLength,
    maxPropsIntoLine: options.maxPropsIntoLine,
    maxPropStringLength: options.maxPropStringLength,
  };

  const infoContent = (
    <Story {...props}>
      {storyFn(context)}
    </Story>
  );
  if (options.sendToPanel) {
    const infoString = ReactDOMServer.renderToString(infoContent);
    sendToPanel(infoString);
    return storyFn(context);
  }
  return infoContent;
}

export const withInfo = textOrOptions => {
  const options = typeof textOrOptions === 'string' ? { text: textOrOptions } : textOrOptions;
  return storyFn => context => addInfo(storyFn, context, options);
};
const panelOptions = options => ({
  ...options,
  sendToPanel: true,
  hideInfoButton: true,
});
const decoratorOptions = options => ({

  ...options,
  sendToPanel: false,
  hideInfoButton: false,

});

export { Story };

export default {
  addWithInfo: deprecate(function addWithInfo(storyName, text, storyFn, options) {
    if (typeof storyFn !== 'function') {
      if (typeof text === 'function') {
        options = storyFn; // eslint-disable-line
        storyFn = text; // eslint-disable-line
        text = ''; // eslint-disable-line
      } else {
        throw new Error('No story defining function has been specified');
      }
    }
    return this.add(storyName, withInfo({ text, ...options })(storyFn));
  }, '@storybook/addon-info .addWithInfo() addon is deprecated, use withInfo() from the same package instead. \nSee https://github.com/storybooks/storybook/tree/master/addons/info'),
};

export function setDefaults(newDefaults) {
  return Object.assign(defaultOptions, newDefaults);
}
