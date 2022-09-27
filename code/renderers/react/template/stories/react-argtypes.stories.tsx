import React, { useState } from 'react';
import mapValues from 'lodash/mapValues';
import { PureArgsTable as ArgsTable } from '@storybook/blocks';
import type { Args, Parameters } from '@storybook/csf';
import { inferControls } from '@storybook/store';
import { ThemeProvider, themes, convert } from '@storybook/theming';

import { component as JsClassComponentComponent } from './__testfixtures__/js-class-component/input.jsx';
import { component as JsFunctionComponentComponent } from './__testfixtures__/js-function-component/input.jsx';
import { component as JsFunctionComponentInlineDefaultsComponent } from './__testfixtures__/js-function-component-inline-defaults/input.jsx';
import { component as JsFunctionComponentInlineDefaultsNoPropTypesComponent } from './__testfixtures__/js-function-component-inline-defaults-no-propTypes/input.jsx';
import { component as TsFunctionComponentComponent } from './__testfixtures__/ts-function-component/input';
import { component as TsFunctionComponentInlineDefaultsComponent } from './__testfixtures__/ts-function-component-inline-defaults/input';
import { component as JsProptypesShapeComponent } from './__testfixtures__/9399-js-proptypes-shape/input.jsx';
// import { component as JsStyledComponentsComponent } from './__testfixtures__/8663-js-styled-components/input';
import { component as JsDefaultValuesComponent } from './__testfixtures__/9626-js-default-values/input.jsx';
import { component as JsProptypesNoJsdocComponent } from './__testfixtures__/9668-js-proptypes-no-jsdoc/input.jsx';
import { component as TsReactFcGenericsComponent } from './__testfixtures__/8143-ts-react-fc-generics/input';
import { component as TsImportedTypesComponent } from './__testfixtures__/8143-ts-imported-types/input';
// import { component as JsStyledDocgenComponent } from './__testfixtures__/8279-js-styled-docgen/input';
import { component as JsPropTypesOneofComponent } from './__testfixtures__/8140-js-prop-types-oneof/input.jsx';
import { component as JsHocComponent } from './__testfixtures__/9023-js-hoc/input.jsx';
import { component as TsMultiPropsComponent } from './__testfixtures__/8740-ts-multi-props/input';
import { component as TsReactDefaultExportsComponent } from './__testfixtures__/9556-ts-react-default-exports/input';
// import { component as TsStyledPropsComponent } from './__testfixtures__/9592-ts-styled-props/input';
import { component as TsImportTypesComponent } from './__testfixtures__/9591-ts-import-types/input';
import { component as TsDeprecatedJsdocComponent } from './__testfixtures__/9721-ts-deprecated-jsdoc/input';
import { component as TsDefaultValuesComponent } from './__testfixtures__/9827-ts-default-values/input';
import { component as JsReactMemoComponent } from './__testfixtures__/9586-js-react-memo/input.jsx';
import { component as TsCamelCaseComponent } from './__testfixtures__/9575-ts-camel-case/input';
// import { component as TsDisplayNameComponent } from './__testfixtures__/9493-ts-display-name/input';
import { component as TsForwardRefComponent } from './__testfixtures__/8894-9511-ts-forward-ref/input';
import { component as TsTypePropsComponent } from './__testfixtures__/9465-ts-type-props/input';
import { component as JsStaticPropTypesComponent } from './__testfixtures__/8428-js-static-prop-types/input.jsx';
import { component as TsExtendPropsComponent } from './__testfixtures__/9764-ts-extend-props/input';
import { component as TsComponentPropsComponent } from './__testfixtures__/9922-ts-component-props/input';

export default {
  component: {},
  render: (_: any, { parameters }: { parameters: Parameters }) => (
    <ThemeProvider theme={convert(themes.light)}>
      <ArgsStory parameters={parameters} />
    </ThemeProvider>
  ),
};

// FIXME
type Component = any;

const argsTableProps = (component: Component, { extractArgTypes }: Parameters) => {
  const argTypes = extractArgTypes(component);
  const parameters = { __isArgsStory: true };
  const rows = inferControls({ argTypes, parameters } as any);
  return { rows };
};

const ArgsStory = ({ parameters: { component, docs } }: any) => {
  const { rows } = argsTableProps(component, docs);
  const initialArgs = mapValues(rows, (argType) => argType.defaultValue) as Args;

  const [args, setArgs] = useState(initialArgs);
  return (
    <>
      <p>
        <b>NOTE:</b> these stories are to help visualise the snapshot tests in{' '}
        <code>./react-properties.test.js</code>.
      </p>
      <ArgsTable rows={rows} args={args} updateArgs={(val) => setArgs({ ...args, ...val })} />
      <table>
        <thead>
          <tr>
            <th>arg name</th>
            <th>argType</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(args).map(([key, val]) => (
            <tr key={key}>
              <td>
                <code>{key}</code>
              </td>
              <td>
                <pre>{JSON.stringify(rows[key])}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export const JsClassComponent = { parameters: { component: JsClassComponentComponent } };

export const JsFunctionComponent = { parameters: { component: JsFunctionComponentComponent } };

export const JsFunctionComponentInlineDefaults = {
  parameters: { component: JsFunctionComponentInlineDefaultsComponent },
};

export const JsFunctionComponentInlineDefaultsNoPropTypes = {
  parameters: { component: JsFunctionComponentInlineDefaultsNoPropTypesComponent },
};

export const TsFunctionComponent = { parameters: { component: TsFunctionComponentComponent } };

export const TsFunctionComponentInlineDefaults = {
  parameters: { component: TsFunctionComponentInlineDefaultsComponent },
};

export const JsProptypesShape = { parameters: { component: JsProptypesShapeComponent } };

// export const JsStyledComponents = { parameters: { component: JsStyledComponentsComponent } };

export const JsDefaultValues = { parameters: { component: JsDefaultValuesComponent } };

export const JsProptypesNoJsdoc = { parameters: { component: JsProptypesNoJsdocComponent } };

export const TsReactFcGenerics = { parameters: { component: TsReactFcGenericsComponent } };

export const TsImportedTypes = { parameters: { component: TsImportedTypesComponent } };

// export const JsStyledDocgen = { parameters: { component: JsStyledDocgenComponent } };

export const JsPropTypesOneof = { parameters: { component: JsPropTypesOneofComponent } };

export const JsHoc = { parameters: { component: JsHocComponent } };

export const TsMultiProps = { parameters: { component: TsMultiPropsComponent } };

export const TsReactDefaultExports = { parameters: { component: TsReactDefaultExportsComponent } };

// export const TsStyledProps = { parameters: { component: TsStyledPropsComponent } };

export const TsImportTypes = { parameters: { component: TsImportTypesComponent } };

export const TsDeprecatedJsdoc = { parameters: { component: TsDeprecatedJsdocComponent } };

export const TsDefaultValues = { parameters: { component: TsDefaultValuesComponent } };

export const JsReactMemo = { parameters: { component: JsReactMemoComponent } };

export const TsCamelCase = { parameters: { component: TsCamelCaseComponent } };

// export const TsDisplayName = { parameters: { component: TsDisplayNameComponent } };

export const TsForwardRef = { parameters: { component: TsForwardRefComponent } };

export const TsTypeProps = { parameters: { component: TsTypePropsComponent } };

export const JsStaticPropTypes = { parameters: { component: JsStaticPropTypesComponent } };

export const TsExtendProps = { parameters: { component: TsExtendPropsComponent } };

export const TsComponentProps = { parameters: { component: TsComponentPropsComponent } };
