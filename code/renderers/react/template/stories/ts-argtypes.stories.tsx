import React, { useState } from 'react';
import mapValues from 'lodash/mapValues';
import { PureArgsTable as ArgsTable } from '@storybook/blocks';
import type { Args, Parameters, StoryContext } from '@storybook/csf';
import { inferControls } from '@storybook/store';
import { ThemeProvider, themes, convert } from '@storybook/theming';

import { component as TsFunctionComponentComponent } from './__testfixtures__/ts-function-component/input';
import { component as TsFunctionComponentInlineDefaultsComponent } from './__testfixtures__/ts-function-component-inline-defaults/input';
import { component as TsReactFcGenericsComponent } from './__testfixtures__/8143-ts-react-fc-generics/input';
import { component as TsImportedTypesComponent } from './__testfixtures__/8143-ts-imported-types/input';
import { component as TsMultiPropsComponent } from './__testfixtures__/8740-ts-multi-props/input';
import { component as TsReactDefaultExportsComponent } from './__testfixtures__/9556-ts-react-default-exports/input';
import { component as TsImportTypesComponent } from './__testfixtures__/9591-ts-import-types/input';
import { component as TsDeprecatedJsdocComponent } from './__testfixtures__/9721-ts-deprecated-jsdoc/input';
import { component as TsDefaultValuesComponent } from './__testfixtures__/9827-ts-default-values/input';
import { component as TsCamelCaseComponent } from './__testfixtures__/9575-ts-camel-case/input';
import { component as TsDisplayNameComponent } from './__testfixtures__/9493-ts-display-name/input';
import { component as TsForwardRefComponent } from './__testfixtures__/8894-9511-ts-forward-ref/input';
import { component as TsTypePropsComponent } from './__testfixtures__/9465-ts-type-props/input';
import { component as TsExtendPropsComponent } from './__testfixtures__/9764-ts-extend-props/input';
import { component as TsComponentPropsComponent } from './__testfixtures__/9922-ts-component-props/input';
import { component as TsJsdocComponent } from './__testfixtures__/ts-jsdoc/input';
import { component as TsTypesComponent } from './__testfixtures__/ts-types/input';
import { component as TsHtmlComponent } from './__testfixtures__/ts-html/input';

export default {
  component: {},
  render: (_: Args, context: StoryContext) => <ArgsStory parameters={context.parameters} />,
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

export const TsFunctionComponent = { parameters: { component: TsFunctionComponentComponent } };

export const TsFunctionComponentInlineDefaults = {
  parameters: { component: TsFunctionComponentInlineDefaultsComponent },
};

export const TsReactFcGenerics = { parameters: { component: TsReactFcGenericsComponent } };

export const TsImportedTypes = { parameters: { component: TsImportedTypesComponent } };

export const TsMultiProps = { parameters: { component: TsMultiPropsComponent } };

export const TsReactDefaultExports = { parameters: { component: TsReactDefaultExportsComponent } };

export const TsImportTypes = { parameters: { component: TsImportTypesComponent } };

export const TsDeprecatedJsdoc = { parameters: { component: TsDeprecatedJsdocComponent } };

export const TsDefaultValues = { parameters: { component: TsDefaultValuesComponent } };

export const TsCamelCase = { parameters: { component: TsCamelCaseComponent } };

export const TsDisplayName = { parameters: { component: TsDisplayNameComponent } };

export const TsForwardRef = { parameters: { component: TsForwardRefComponent } };

export const TsTypeProps = { parameters: { component: TsTypePropsComponent } };

export const TsExtendProps = { parameters: { component: TsExtendPropsComponent } };

export const TsComponentProps = { parameters: { component: TsComponentPropsComponent } };

export const TsJsdoc = { parameters: { component: TsJsdocComponent } };

export const TsTypes = { parameters: { component: TsTypesComponent } };

export const TsHtml = { parameters: { component: TsHtmlComponent } };
