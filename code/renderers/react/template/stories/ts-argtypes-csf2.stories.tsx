import React, { useState } from 'react';
import mapValues from 'lodash/mapValues.js';
import { PureArgsTable as ArgsTable } from '@storybook/blocks';
import type { Args, Parameters, StoryContext } from '@storybook/types';
import { inferControls } from '@storybook/preview-api';
import { ThemeProvider, themes, convert } from '@storybook/theming';

import { component as TsFunctionComponentComponent } from './docgen-components/ts-function-component/input';
import { component as TsFunctionComponentInlineDefaultsComponent } from './docgen-components/ts-function-component-inline-defaults/input';
import { component as TsReactFcGenericsComponent } from './docgen-components/8143-ts-react-fc-generics/input';

import { component as TsMultiPropsComponent } from './docgen-components/8740-ts-multi-props/input';
import { component as TsReactDefaultExportsComponent } from './docgen-components/9556-ts-react-default-exports/input';
import { component as TsImportTypesComponent } from './docgen-components/9591-ts-import-types/input';
import { component as TsDeprecatedJsdocComponent } from './docgen-components/9721-ts-deprecated-jsdoc/input';
import { component as TsDefaultValuesComponent } from './docgen-components/9827-ts-default-values/input';
import { component as TsCamelCaseComponent } from './docgen-components/9575-ts-camel-case/input';
import { component as TsDisplayNameComponent } from './docgen-components/9493-ts-display-name/input';
import { component as TsForwardRefComponent } from './docgen-components/8894-9511-ts-forward-ref/input';
import { component as TsTypePropsComponent } from './docgen-components/9465-ts-type-props/input';
import { component as TsExtendPropsComponent } from './docgen-components/9764-ts-extend-props/input';
import { component as TsComponentPropsComponent } from './docgen-components/9922-ts-component-props/input';
import { component as TsJsdocComponent } from './docgen-components/ts-jsdoc/input';
import { component as TsTypesComponent } from './docgen-components/ts-types/input';
import { component as TsHtmlComponent } from './docgen-components/ts-html/input';

export default {
  component: {},
};

const ArgsStory = ({ parameters }: { parameters: Parameters }) => {
  const argTypes = parameters.docs.extractArgTypes(parameters.component);
  const rows = inferControls({ argTypes, parameters: { __isArgsStory: true } } as any);
  const initialArgs = mapValues(rows, (argType) => argType.defaultValue);
  const [args, setArgs] = useState(initialArgs);

  return (
    <ThemeProvider theme={convert(themes.light)}>
      <ArgsTable rows={rows} args={args} updateArgs={(val) => setArgs({ ...args, ...val })} />
    </ThemeProvider>
  );
};

export const TsFunctionComponent = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsFunctionComponent.parameters = { component: TsFunctionComponentComponent };

export const TsFunctionComponentInlineDefaults = TsFunctionComponent;
TsFunctionComponentInlineDefaults.parameters = {
  component: TsFunctionComponentInlineDefaultsComponent,
};

export const TsReactFcGenerics = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsReactFcGenerics.parameters = { component: TsReactFcGenericsComponent };

export const TsMultiProps = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsMultiProps.parameters = { component: TsMultiPropsComponent };

export const TsReactDefaultExports = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsReactDefaultExports.parameters = { component: TsReactDefaultExportsComponent };

export const TsImportTypes = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsImportTypes.parameters = { component: TsImportTypesComponent };

export const TsDeprecatedJsdoc = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsDeprecatedJsdoc.parameters = { component: TsDeprecatedJsdocComponent };

export const TsDefaultValues = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsDefaultValues.parameters = { component: TsDefaultValuesComponent };

export const TsCamelCase = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsCamelCase.parameters = { component: TsCamelCaseComponent };

export const TsDisplayName = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsDisplayName.parameters = { component: TsDisplayNameComponent };

export const TsForwardRef = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsForwardRef.parameters = { component: TsForwardRefComponent };

export const TsTypeProps = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsTypeProps.parameters = { component: TsTypePropsComponent };

export const TsExtendProps = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsExtendProps.parameters = { component: TsExtendPropsComponent };

export const TsComponentProps = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsComponentProps.parameters = { component: TsComponentPropsComponent };

export const TsJsdoc = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsJsdoc.parameters = { component: TsJsdocComponent };

export const TsTypes = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsTypes.parameters = { component: TsTypesComponent };

export const TsHtml = (_: Args, { parameters }: StoryContext) => (
  <ArgsStory parameters={parameters} />
);
TsHtml.parameters = { component: TsHtmlComponent };
