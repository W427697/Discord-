import React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import { Button } from '@storybook/react/demo';

import Story from '../Story';
import Node from '../Node';
import Props from '../Props';
import PropTable from '../PropTable';
import PropVal from '../PropVal';
import { Code, Pre, Blockquote } from '../markdown/code';

import { defaultOptions, defaultMarksyConf } from '../../defaults';

/*
Add info after moving info addon to panel
*/
addDecorator((story, context) =>
  withInfo({
    summary: null,
    inline: false,
    header: false,
    source: false,
  })(story)(context)
);

const customOptions = {
  summary: `
  ### Story component
  
  default options with custom summary
  
  wraps itself
  `,
  propTables: [Story, Node, Props, PropTable, PropVal],
};
const context = {
  kind: 'Info Component: <Story />',
  story: 'default settings',
};

const options = {
  ...defaultOptions,
  ...customOptions,
};

const marksyConf = {
  ...defaultMarksyConf,
  ...options.marksyConf,
};

const props = {
  summary: options.summary,
  context,
  showInline: Boolean(options.inline),
  showHeader: Boolean(options.header),
  showSource: Boolean(options.source),
  hideInfoButton: Boolean(!options.infoButton),
  propTables: options.propTables || null,
  propTablesExclude: options.propTablesExclude,
  styles: typeof options.styles === 'function' && options.styles,
  marksyConf,
  maxPropObjectKeys: options.maxPropObjectKeys,
  maxPropArrayLength: options.maxPropArrayLength,
  maxPropsIntoLine: options.maxPropsIntoLine,
  maxPropStringLength: options.maxPropStringLength,
};

storiesOf('Root Component (Story.js)', module)
  .addDecorator(withKnobs)
  .add('default options wraps itself', () =>
    <Story {...props}>
      <Story {...props} />
    </Story>
  )
  .add('default options wraps button', () =>
    <Story {...props}>
      <button>Press me</button>
    </Story>
  );

storiesOf('Node', module)
  .add('default with Story', () =>
    <Node
      node={<Story {...props} />}
      depth={0}
      maxPropsIntoLine={props.maxPropsIntoLine}
      maxPropObjectKeys={props.maxPropObjectKeys}
      maxPropArrayLength={props.maxPropArrayLength}
      maxPropStringLength={props.maxPropStringLength}
    />
  )
  .add('default with button', () =>
    <Node
      node={<button>Press Me</button>}
      depth={0}
      maxPropsIntoLine={props.maxPropsIntoLine}
      maxPropObjectKeys={props.maxPropObjectKeys}
      maxPropArrayLength={props.maxPropArrayLength}
      maxPropStringLength={props.maxPropStringLength}
    />
  );

storiesOf('Props', module)
  .add('default with Story', () =>
    <Props
      node={<Story {...props} />}
      singleLine
      maxPropsIntoLine={props.maxPropsIntoLine}
      maxPropObjectKeys={props.maxPropObjectKeys}
      maxPropArrayLength={props.maxPropArrayLength}
      maxPropStringLength={props.maxPropStringLength}
    />
  )
  .add('default with button', () =>
    <Props
      node={<button>Press Me</button>}
      singleLine
      maxPropsIntoLine={props.maxPropsIntoLine}
      maxPropObjectKeys={props.maxPropObjectKeys}
      maxPropArrayLength={props.maxPropArrayLength}
      maxPropStringLength={props.maxPropStringLength}
    />
  );

storiesOf('PropTable', module)
  .add('default with Story', () =>
    <PropTable
      type={Story}
      maxPropObjectKeys={props.maxPropObjectKeys}
      maxPropArrayLength={props.maxPropArrayLength}
      maxPropStringLength={props.maxPropStringLength}
    />
  )
  .add('default with Button', () =>
    <PropTable
      type={Button}
      maxPropObjectKeys={props.maxPropObjectKeys}
      maxPropArrayLength={props.maxPropArrayLength}
      maxPropStringLength={props.maxPropStringLength}
    />
  );

storiesOf('PropVal', module).add('default with Story', () =>
  <PropVal
    val={
      'Ipsaque parte summo, et paravi admotas te demum castique nostri, audit metuunt inquit: vestigia? Formae potius Tritonidos et pars, iungat tum, gestare, *ardore cum*, ausum inscribenda incingitur digitis umbram. Aello electarumque huic et cunctatusque et verba alto atque et ignibus'
    }
    maxPropObjectKeys={props.maxPropObjectKeys}
    maxPropArrayLength={props.maxPropArrayLength}
    maxPropStringLength={props.maxPropStringLength}
  />
);

storiesOf('Markdown/Code', module)
  .add('example 1', () => <Code code={<div>const A = 10;</div>} language="javascript" />)
  .add('example 2', () => <Code code={<code>const A = 10;</code>} language="javascript" />);

storiesOf('Markdown/Pre', module)
  .add('example 1', () =>
    <Pre>
      <div>const A = 10;</div>
    </Pre>
  )
  .add('example 2', () =>
    <Pre>
      {'const A = 10;'}
    </Pre>
  );

storiesOf('Markdown/Blockquote', module)
  .add('example 1', () =>
    <Blockquote>
      <div>const A = 10;</div>
    </Blockquote>
  )
  .add('example 2', () =>
    <Blockquote>
      {'const A = 10;'}
    </Blockquote>
  );
