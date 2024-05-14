```js filename=".storybook/main.js" renderer="angular" language="js"
export default {
  // ...
  framework: '@storybook/angular', // 👈 Add this
};
```

```js filename=".storybook/preview.js" renderer="angular" language="js"
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';

import '../src/polyfills';

setCompodocJson(docJson);

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: { story: { inline: true } },
  },
};
```

```js filename="Button.stories.js" renderer="common" language="js"
import { action } from '@storybook/addon-actions';

import Button from './Button';

export default {
  component: Button,
  args: {
    // 👇 Create an action that appears when the onClick event is fired
    onClick: action('on-click'),
  },
};
```

```js filename="your-addon-register-file.js" renderer="common" language="js"
import React, { useCallback } from 'react';

import { FORCE_RE_RENDER } from '@storybook/core-events';
import { useGlobals } from '@storybook/manager-api';

import { IconButton } from '@storybook/components';
import { OutlineIcon } from '@storybook/icons';

import { addons } from '@storybook/preview-api';

const ExampleToolbar = () => {
  const [globals, updateGlobals] = useGlobals();

  const isActive = globals['my-param-key'] || false;

  // Function that will update the global value and trigger a UI refresh.
  const refreshAndUpdateGlobal = () => {
    // Updates Storybook global value
    updateGlobals({
      ['my-param-key']: !isActive,
    }),
      // Invokes Storybook's addon API method (with the FORCE_RE_RENDER) event to trigger a UI refresh
      addons.getChannel().emit(FORCE_RE_RENDER);
  };

  const toggleOutline = useCallback(() => refreshAndUpdateGlobal(), [isActive]);

  return (
    <IconButton
      key="Example"
      active={isActive}
      title="Show a Storybook toolbar"
      onClick={toggleOutline}
    >
      <OutlineIcon />
    </IconButton>
  );
};
```

```js filename="your-addon-register-file.js" renderer="common" language="js"
import React from 'react';

import { useGlobals } from '@storybook/manager-api';

import { AddonPanel, Placeholder, Separator, Source, Spaced, Title } from '@storybook/components';

import { MyThemes } from '../my-theme-folder/my-theme-file';

// Function to obtain the intended theme
const getTheme = (themeName) => {
  return MyThemes[themeName];
};

const ThemePanel = (props) => {
  const [{ theme: themeName }] = useGlobals();

  const selectedTheme = getTheme(themeName);

  return (
    <AddonPanel {...props}>
      {selectedTheme ? (
        <Spaced row={3} outer={1}>
          <Title>{selectedTheme.name}</Title>
          <p>The full theme object</p>
          <Source
            code={JSON.stringify(selectedTheme, null, 2)}
            language="js"
            copyable
            padded
            showLineNumbers
          />
        </Spaced>
      ) : (
        <Placeholder>No theme selected</Placeholder>
      )}
    </AddonPanel>
  );
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  parameters: {
    docs: {
      controls: { exclude: ['style'] },
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
export const Basic {
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  parameters: {
    docs: {
      controls: { exclude: ['style'] },
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

/**
 * # Button stories
 * These stories showcase the button
 */
export default {
  component: Button
  parameters: {
    docs: {
      description: {
        component: 'Another description, overriding the comments'
      }
    }
  }
}

/**
 * # Primary Button
 * This is the primary button
 */
export const Primary = {
  parameters: {
    docs: {
      description: {
        story: 'Another description on the story, overriding the comments'
      }
    }
  }
}
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
export const Basic {
  parameters: {
    docs: {
      source: { language: 'jsx' },
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
export const Basic {
  parameters: {
    docs: {
      story: { autoplay: true },
    },
  },
};
```

```js filename="Example.stories.js|jsx" renderer="common" language="js"
import { Example } from './Example';

export default {
  component: Example,
  argTypes: {
    value: {
      control: {
        type: 'number',
        min: 0,
        max: 100,
        step: 10,
      },
    },
  },
};
```

```js filename="Example.stories.js|jsx" renderer="common" language="js"
import { Example } from './Example';

export default {
  component: Example,
  argTypes: {
    value: {
      // ⛔️ Deprecated, do not use
      defaultValue: 0,
    },
  },
  // ✅ Do this instead
  args: {
    value: 0,
  },
};
```

```js filename="Example.stories.js|jsx" renderer="common" language="js"
import { Example } from './Example';

export default {
  component: Example,
  argTypes: {
    value: {
      description: 'The value of the slider',
    },
  },
};
```

```js filename="Example.stories.js|jsx" renderer="common" language="js"
import { Example } from './Example';

export default {
  component: Example,
  argTypes: {
    parent: { control: 'select', options: ['one', 'two', 'three'] },

    // 👇 Only shown when `parent` arg exists
    parentExists: { if: { arg: 'parent', exists: true } },

    // 👇 Only shown when `parent` arg does not exist
    parentDoesNotExist: { if: { arg: 'parent', exists: false } },

    // 👇 Only shown when `parent` arg value is truthy
    parentIsTruthy: { if: { arg: 'parent' } },
    parentIsTruthyVerbose: { if: { arg: 'parent', truthy: true } },

    // 👇 Only shown when `parent` arg value is not truthy
    parentIsNotTruthy: { if: { arg: 'parent', truthy: false } },

    // 👇 Only shown when `parent` arg value is 'three'
    parentIsEqToValue: { if: { arg: 'parent', eq: 'three' } },

    // 👇 Only shown when `parent` arg value is not 'three'
    parentIsNotEqToValue: { if: { arg: 'parent', neq: 'three' } },

    // Each of the above can also be conditional on the value of a globalType, e.g.:

    // 👇 Only shown when `theme` global exists
    parentExists: { if: { global: 'theme', exists: true } },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  argTypes: {
    // 👇 All Button stories expect a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  argTypes: {
    // 👇 All stories expect a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Basic = {
  argTypes: {
    // 👇 This story expects a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
};
```

```js filename="Example.stories.js|jsx" renderer="common" language="js"
import { Example } from './Example';

export default {
  component: Example,
  argTypes: {
    label: {
      options: ['Normal', 'Bold', 'Italic'],
      mapping: {
        Bold: <b>Bold</b>,
        Italic: <i>Italic</i>,
      },
    },
  },
};
```

```js filename="Example.stories.js|jsx" renderer="common" language="js"
import { Example } from './Example';

export default {
  component: Example,
  argTypes: {
    actualArgName: {
      name: 'Friendly name',
    },
  },
};
```

```js filename="Example.stories.js|jsx" renderer="common" language="js"
import { Example } from './Example';

export default {
  component: Example,
  argTypes: {
    icon: {
      options: ['arrow-up', 'arrow-down', 'loading'],
    },
  },
};
```

```js filename="Example.stories.js|jsx" renderer="common" language="js"
import { Example } from './Example';

export default {
  component: Example,
  argTypes: {
    value: {
      table: {
        defaultValue: { summary: 0 },
        type: { summary: 'number' },
      },
    },
  },
};
```

```js filename="Example.stories.js|jsx" renderer="common" language="js"
import { Example } from './Example';

export default {
  component: Example,
  argTypes: {
    value: { type: 'number' },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  // The default value of the theme arg for all stories
  args: { theme: 'light' },
};
```

```js filename="my-addon/src/manager.js|ts" renderer="common" language="js"
import { useArgs } from '@storybook/manager-api';

const [args, updateArgs, resetArgs] = useArgs();

// To update one or more args:
updateArgs({ key: 'value' });

// To reset one (or more) args:
resetArgs((argNames: ['key']));

// To reset all args
resetArgs();
```

```js filename="Page.stories.js" renderer="common" language="js"
import MockDate from 'mockdate';

import { getUserFromSession } from '../../api/session.mock';
import { Page } from './Page';

export default {
  component: Page,
  // 👇 Set the value of Date for every story in the file
  async beforeEach() {
    MockDate.set('2024-02-14');

    // 👇 Reset the Date after each story
    return () => {
      MockDate.reset();
    };
  },
};

export const Default = {
  async play({ canvasElement }) {
    // ... This will run with the mocked Date
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

import { withActions } from '@storybook/addon-actions/decorator';

export default {
  component: Button,
  parameters: {
    actions: {
      handles: ['mouseover', 'click .btn'],
    },
  },
  decorators: [withActions],
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  argTypes: {
    // Assigns the argTypes to the Colors category
    backgroundColor: {
      control: 'color',
      table: {
        category: 'Colors',
      },
    },
    primary: {
      table: {
        category: 'Colors',
      },
    },
    // Assigns the argType to the Text category
    label: {
      table: {
        category: 'Text',
      },
    },
    // Assigns the argType to the Events category
    onClick: {
      table: {
        category: 'Events',
      },
    },
    // Assigns the argType to the Sizes category
    size: {
      table: {
        category: 'Sizes',
      },
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  argTypes: {
    // Assigns the argTypes to the Colors category
    backgroundColor: {
      control: 'color',
      table: {
        category: 'Colors',
        // Assigns the argTypes to a specific subcategory
        subcategory: 'Button colors',
      },
    },
    primary: {
      table: {
        category: 'Colors',
        subcategory: 'Button style',
      },
    },
    label: {
      table: {
        category: 'Text',
        subcategory: 'Button contents',
      },
    },
    // Assigns the argType to the Events category
    onClick: {
      table: {
        category: 'Events',
        subcategory: 'Button Events',
      },
    },
    // Assigns the argType to the Sizes category
    size: {
      table: {
        category: 'Sizes',
      },
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  args: {
    variant: 'primary',
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  argTypes: {
    variant: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  component: Button,
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  component: Button,
  parameters: {
    myAddon: { disable: true }, // Disables the addon
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Atoms/Button',
  component: Button,
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button as ButtonComponent } from './Button';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Atoms/Button',
  component: ButtonComponent,
};

// This is the only named export in the file, and it matches the component name
export const Button = {};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Sample = {
  render: () => ({
    template: '<button :label=label />',
    data: {
      label: 'hello button',
    },
  }),
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  parameters: { actions: { argTypesRegex: '^on.*' } },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { fn } from '@storybook/test';
import { Button } from './Button';

export default {
  component: Button,
  // 👇 Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked
  args: { onClick: fn() },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    ...Primary.args,
    primary: false,
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const PrimaryLongName = {
  args: {
    ...Primary.args,
    label: 'Primary with a really long name',
  },
};
```

```js filename="Button.stories.js|jsx|mjs|ts|tsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  component: Button,
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
      ],
    },
  },
};
```

```js filename="Checkbox.stories.js|jsx" renderer="common" language="js"
import { Checkbox } from './Checkbox';

export default {
  component: Checkbox,
};

export const Unchecked = {
  args: {
    label: 'Unchecked',
  },
};
```

```js filename="Checkbox.stories.js|jsx" renderer="common" language="js"
import { CheckBox } from './Checkbox';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Atoms/Checkbox',
  component: CheckBox,
};
```

```shell renderer="common" language="js"
# .github/workflows/chromatic.yml

# Workflow name
name: 'Chromatic Publish'

# Event for the workflow
on: push

# List of jobs
jobs:
  test:
    # Operating System
    runs-on: ubuntu-latest
    # Job steps
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'yarn'
      - run: yarn
      #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@v1
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken,
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

```js filename="/cypress/integration/Login.spec.js" renderer="common" language="js"
/// <reference types="cypress" />

describe('Login Form', () => {
  it('Should contain valid login information', () => {
    cy.visit('/iframe.html?id=components-login-form--example');
    cy.get('#login-form').within(() => {
      cy.log('**enter the email**');
      cy.get('#email').should('have.value', 'email@provider.com');
      cy.log('**enter password**');
      cy.get('#password').should('have.value', 'a-random-password');
    });
  });
});
```

```js filename="tests/login-form/login.spec.js" renderer="common" language="js"
const { test, expect } = require('@playwright/test');

test('Login Form inputs', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=components-login-form--example');
  const email = await page.inputValue('#email');
  const password = await page.inputValue('#password');
  await expect(email).toBe('email@provider.com');
  await expect(password).toBe('a-random-password');
});
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  argTypes: {
    // Button can be passed a label or an image, not both
    label: {
      control: 'text',
      if: { arg: 'image', truthy: false },
    },
    image: {
      control: { type: 'select', options: ['foo.jpg', 'bar.jpg'] },
      if: { arg: 'label', truthy: false },
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  argTypes: {
    label: { control: 'text' }, // Always shows the control
    advanced: { control: 'boolean' },
    // Only enabled if advanced is true
    margin: { control: 'number', if: { arg: 'advanced' } },
    padding: { control: 'number', if: { arg: 'advanced' } },
    cornerRadius: { control: 'number', if: { arg: 'advanced' } },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from './icons';

const arrows = { ArrowUp, ArrowDown, ArrowLeft, ArrowRight };

export default {
  component: Button,
  argTypes: {
    arrow: {
      options: Object.keys(arrows), // An array of serializable values
      mapping: arrows, // Maps serializable option values to complex arg values
      control: {
        type: 'select', // Type 'select' is automatically inferred when 'options' is defined
        labels: {
          // 'labels' maps option values to string labels
          ArrowUp: 'Up',
          ArrowDown: 'Down',
          ArrowLeft: 'Left',
          ArrowRight: 'Right',
        },
      },
    },
  },
};
```

```js filename="YourComponent.stories.js|jsx" renderer="common" language="js"
import { YourComponent } from './YourComponent';

export default {
  component: YourComponent,
  argTypes: {
    // foo is the property we want to remove from the UI
    foo: {
      control: false,
    },
  },
};
```

```js filename="YourComponent.stories.js|jsx" renderer="common" language="js"
import { YourComponent } from './YourComponent';

export default {
  component: YourComponent,
};

export const ArrayInclude = {
  parameters: {
    controls: { include: ['foo', 'bar'] },
  },
};

export const RegexInclude = {
  parameters: {
    controls: { include: /^hello*/ },
  },
};

export const ArrayExclude = {
  parameters: {
    controls: { exclude: ['foo', 'bar'] },
  },
};

export const RegexExclude = {
  parameters: {
    controls: { exclude: /^hello*/ },
  },
};
```

```js filename="YourComponent.stories.js|jsx" renderer="common" language="js"
import { YourComponent } from './YourComponent';

export default {
  component: YourComponent,
  argTypes: {
    // foo is the property we want to remove from the UI
    foo: {
      table: {
        disable: true,
      },
    },
  },
};
```

```js filename="YourComponent.stories.js|jsx" renderer="common" language="js"
import { YourComponent } from './your-component';

export default {
  component: YourComponent,
  parameters: { controls: { sort: 'requiredFirst' } },
};
```

```js filename="CSF 2" renderer="common" language="js"
export const PrimaryOnDark = Primary.bind({});
PrimaryOnDark.args = Primary.args;
PrimaryOnDark.parameters = { background: { default: 'dark' } };
```

```js filename="CSF 2" renderer="common" language="js"
export default {
  title: 'components/Button',
  component: Button,
};
```

```js filename="CSF 3" renderer="common" language="js"
export default { component: Button };
```

```js filename="CSF 3 - default render function" renderer="common" language="js"
export const Default = {};
```

```js filename="CSF 3" renderer="common" language="js"
export const PrimaryOnDark = {
  ...Primary,
  parameters: { background: { default: 'dark' } },
};
```

```js filename="CSF 3" renderer="common" language="js"
import { Button } from './Button';

export default { component: Button };

export const Primary = { args: { primary: true } };
```

```js filename="FooBar.stories.js|jsx" renderer="common" language="js"
import { Foo } from './Foo';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Foo/Bar',
  component: Foo,
};

export const Baz = {};
```

```js filename="Gizmo.stories.js|jsx" renderer="common" language="js"
import { Gizmo } from './Gizmo';

export default {
  component: Gizmo,
  argTypes: {
    canRotate: {
      control: 'boolean',
    },
    width: {
      control: { type: 'number', min: 400, max: 1200, step: 50 },
    },
    height: {
      control: { type: 'range', min: 200, max: 1500, step: 50 },
    },
    rawData: {
      control: 'object',
    },
    coordinates: {
      control: 'object',
    },
    texture: {
      control: {
        type: 'file',
        accept: '.png',
      },
    },
    position: {
      control: 'radio',
      options: ['left', 'right', 'center'],
    },
    rotationAxis: {
      control: 'check',
      options: ['x', 'y', 'z'],
    },
    scaling: {
      control: 'select',
      options: [10, 50, 75, 100, 200],
    },
    label: {
      control: 'text',
    },
    meshColors: {
      control: {
        type: 'color',
        presetColors: ['#ff0000', '#00ff00', '#0000ff'],
      },
    },
    revisionDate: {
      control: 'date',
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  implementation: require.resolve('postcss'),
                },
              },
            ],
          },
        ],
      },
    },
  ],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  async babel(config, { configType }) {
    if (configType === 'DEVELOPMENT') {
      // Your development configuration goes here
    }
    if (configType === 'PRODUCTION') {
      // Your production configuration goes here.
    }
    return config;
  },
};
```

```js filename=".storybook/main.js|ts" renderer="common" language="js"
export default {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: '../customVite.config.js',
      },
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: '../../../vite.config.js',
      },
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    crossOriginIsolated: true,
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    disableProjectJson: true,
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    disableTelemetry: true,
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    disableWhatsNewNotifications: true,
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    disableWebpackDefaults: true,
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    enableCrashReports: true, // 👈 Appends the crash reports to the telemetry events
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  docs: {
    autodocs: 'tag',
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  docs: {
    defaultName: 'Documentation',
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  docs: {
    docsMode: true,
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  /*
   * 👇 The `config` argument contains all the other existing environment variables.
   * Either configured in an `.env` file or configured on the command line.
   */
  env: (config) => ({
    ...config,
    EXAMPLE_VAR: 'An environment variable configured in Storybook',
  }),
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  features: {
    argTypeTargetsV7: true,
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  features: {
    legacyDecoratorFileOrder: true,
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  framework: {
    // Replace react-vite with the framework you are using (e.g., react-webpack5)
    name: '@storybook/react-vite',
    options: {
      legacyRootApi: true,
    },
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
import fs from 'fs/promises';

const jsonStoriesIndexer = {
  test: /stories\.json$/,
  createIndex: async (fileName) => {
    const content = JSON.parse(fs.readFileSync(fileName));

    const stories = generateStoryIndexesFromJson(content);

    return stories.map((story) => {
      type: 'story',
      importPath: `virtual:jsonstories--${fileName}--${story.componentName}`,
      exportName: story.name
    });
  },
};

const config = {
  framework: '@storybook/your-framework',
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // 👇 Make sure files to index are included in `stories`
    '../src/**/*.stories.json',
  ],
  experimental_indexers: async (existingIndexers) => [...existingIndexers, jsonStoriesIndexer];
};

export default config;
```

```js filename=".storybook/main.ts" renderer="common" language="js"
const combosIndexer = {
  test: /\.stories\.[tj]sx?$/,
  createIndex: async (fileName, { makeTitle }) => {
    // 👇 Grab title from fileName
    const title = fileName.match(/\/(.*)\.stories/)[1];

    // Read file and generate entries ...

    return entries.map((entry) => ({
      type: 'story',
      // 👇 Use makeTitle to format the title
      title: `${makeTitle(title)} Custom`,
      importPath: fileName,
      exportName: entry.name,
    }));
  },
};

const config = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  experimental_indexers: async (existingIndexers) => [...existingIndexers, combosIndexer];
};

export default config;
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    // 👇 Make sure files to index are included in `stories`
    '../src/**/*.custom-stories.@(js|jsx|ts|tsx)',
  ],
  experimental_indexers: async (existingIndexers) => {
    const customIndexer = {
      test: /\.custom-stories\.[tj]sx?$/,
      createIndex: // See API and examples below...
    };
    return [...existingIndexers, customIndexer];
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  logLevel: 'debug',
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  managerHead: (head) => `
    ${head}
    <link rel="preload" href="/fonts/my-custom-manager-font.woff2" />
  `,
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  previewBody: (body) => `
    ${body}
    ${
      process.env.ANALYTICS_ID ? '<script src="https://cdn.example.com/analytics.js"></script>' : ''
    }
  `,
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  previewHead: (head) => `
    ${head}
    ${
      process.env.ANALYTICS_ID ? '<script src="https://cdn.example.com/analytics.js"></script>' : ''
    }
  `,
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  refs: {
    'package-name': { disable: true },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  // 👇 Retrieve the current environment from the configType argument
  refs: (config, { configType }) => {
    if (configType === 'DEVELOPMENT') {
      return {
        react: {
          title: 'Composed React Storybook running in development mode',
          url: 'http://localhost:7007',
        },
        angular: {
          title: 'Composed Angular Storybook running in development mode',
          url: 'http://localhost:7008',
        },
      };
    }
    return {
      react: {
        title: 'Composed React Storybook running in production',
        url: 'https://your-production-react-storybook-url',
      },
      angular: {
        title: 'Composed Angular Storybook running in production',
        url: 'https://your-production-angular-storybook-url',
      },
    };
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  refs: {
    'design-system': {
      title: 'Storybook Design System',
      url: 'https://master--5ccbc373887ca40020446347.chromatic.com/',
      expanded: false, // Optional, true by default
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: [{ from: '../my-custom-assets/images', to: '/assets' }],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../public', '../static'],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: [
    '../src/**/*.mdx', // 👈 These will display first in the sidebar
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)', // 👈 Followed by these
  ],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
async function findStories() {
  // your custom logic returns a list of files
}

export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: async (list) => [
    ...list,
    // 👇 Add your found stories to the existing list of story files
    ...(await findStories()),
  ],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: [
    {
      // 👇 Sets the directory containing your stories
      directory: '../packages/components',
      // 👇 Storybook will load all files that match this glob
      files: '*.stories.*',
      // 👇 Used when generating automatic titles for your stories
      titlePrefix: 'MyComponents',
    },
  ],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  framework: {
    name: '@storybook/your-framework',
    options: {},
  },
  swc: (config, options) => ({
    jsc: {
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
    },
  }),
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  framework: {
    name: '@storybook/your-framework',
    options: {},
  },
  swc: (config, options) => {
    return {
      ...config,
      // Apply your custom SWC configuration
    };
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableAutoDocs: false,
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableBlocks: false,
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  build: {
    test: {
      disabledAddons: ['@storybook/addon-a11y'],
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableDocgen: false,
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableMDXEntries: false,
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableSourcemaps: false,
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableTreeShaking: false,
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
const config = {
  // Required
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  // Optional
  addons: ['@storybook/addon-essentials'],
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
};
export default config;
```

```js filename=".storybook/main.js|ts" renderer="common" language="js"
export default {
  stories: ['../src/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config, { configType }) {
    const { mergeConfig } = await import('vite');

    if (configType === 'DEVELOPMENT') {
      // Your development configuration goes here
    }
    if (configType === 'PRODUCTION') {
      // Your production configuration goes here.
    }
    return mergeConfig(config, {
      // Your environment configuration here
    });
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  async viteFinal(config, { configType }) {
    const { mergeConfig } = await import('vite');

    if (configType === 'DEVELOPMENT') {
      // Your development configuration goes here
    }
    if (configType === 'PRODUCTION') {
      // Your production configuration goes here.
    }
    return mergeConfig(config, {
      // Your environment configuration here
    });
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  webpackFinal: async (config, { configType }) => {
    if (configType === 'DEVELOPMENT') {
      // Modify config for development
    }
    if (configType === 'PRODUCTION') {
      // Modify config for production
    }
    return config;
  },
};
```

```js filename="YourPage.stories.js|jsx" renderer="common" language="js"
import { http, HttpResponse, delay } from 'msw';

import { DocumentScreen } from './YourPage';

export default {
  component: DocumentScreen,
};

// 👇 The mocked data that will be used in the story
const TestData = {
  user: {
    userID: 1,
    name: 'Someone',
  },
  document: {
    id: 1,
    userID: 1,
    title: 'Something',
    brief: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'approved',
  },
  subdocuments: [
    {
      id: 1,
      userID: 1,
      title: 'Something',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'approved',
    },
  ],
};

export const MockedSuccess = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://your-restful-endpoint/', () => {
          return new HttpResponse.json(TestData);
        }),
      ],
    },
  },
};

export const MockedError = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://your-restful-endpoint', async () => {
          await delay(800);
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import { initialize, mswLoader } from 'msw-storybook-addon';

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize();

export default {
  // ... rest of preview configuration
  loaders: [mswLoader], // 👈 Add the MSW loader to all stories
};
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      toc: {
        disable: true, // 👈 Disables the table of contents
      },
    },
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

export const Default = {
  args: {
    exampleProp: process.env.EXAMPLE_VAR,
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ExampleWithRole = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button', { name: / button label/i }));
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FirstStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByTestId('an-element'), 'example-value');
  },
};

export const SecondStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByTestId('other-element'), 'another value');
  },
};

export const CombinedStories = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    // Runs the FirstStory and Second story play function before running this story's play function
    await FirstStory.play(context);
    await SecondStory.play(context);
    await userEvent.type(canvas.getByTestId('another-element'), 'random value');
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const AsyncExample = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Other steps

    // Waits for the component to be rendered before querying the element
    await canvas.findByRole('button', { name: / button label/i }));
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { userEvent, waitFor, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ExampleAsyncStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const Input = canvas.getByLabelText('Username', {
      selector: 'input',
    });

    await userEvent.type(Input, 'WrongInput', {
      delay: 100,
    });

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    const Submit = canvas.getByRole('button');
    await userEvent.click(Submit);

    await waitFor(async () => {
      await userEvent.hover(canvas.getByTestId('error'));
    });
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

export const ExampleStory = {
  play: async ({ canvasElement }) => {
    // Assigns canvas to the component root element
    const canvas = within(canvasElement);

    // Starts querying from the component's root element
    await userEvent.type(canvas.getByTestId('example-element'), 'something');
    await userEvent.click(canvas.getByRole('another-element'));
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { fireEvent, userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ClickExample = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button'));
  },
};

export const FireEventExample = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await fireEvent.click(canvas.getByTestId('data-testid'));
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const DelayedStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const exampleElement = canvas.getByLabelText('example-element');

    // The delay option sets the amount of milliseconds between characters being typed
    await userEvent.type(exampleElement, 'random string', {
      delay: 100,
    });

    const AnotherExampleElement = canvas.getByLabelText('another-example-element');
    await userEvent.type(AnotherExampleElement, 'another random string', {
      delay: 100,
    });
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

// Function to emulate pausing between interactions
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ExampleChangeEvent = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const select = canvas.getByRole('listbox');

    await userEvent.selectOptions(select, ['One Item']);
    await sleep(2000);

    await userEvent.selectOptions(select, ['Another Item']);
    await sleep(2000);

    await userEvent.selectOptions(select, ['Yet another item']);
  },
};
```

```js filename="MyComponent.stories.js|jsx|mjs|ts|tsx" renderer="common" language="js"
// This will automatically be parsed to the contents of `data.json`
import data from './data.json';
```

```js filename="MyComponent.stories.js|jsx|mjs|ts|tsx" renderer="common" language="js"
// This will include './static/image.png' in the bundle.
// And return a path to be included in a src attribute
import imageFile from './static/image.png';
```

```js filename="MyComponent.story.js|jsx" renderer="common" language="js"
import { MyComponent } from './MyComponent';

export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/configure/#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Path/To/MyComponent',
  component: MyComponent,
  decorators: [ ... ],
  parameters: { ... },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

export const Simple = {
  decorators: [...],
  name: 'So simple!',
  parameters: {...},
}
```

```js filename="MyComponent.stories.js|jsx|mjs|ts|tsx" renderer="common" language="js"
import { MyComponent } from './MyComponent';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'MyComponent',
  component: MyComponent,
};

// Your stories
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

export const ExampleStory = {
  args: {
    propertyA: import.meta.env.STORYBOOK_DATA_KEY,
    propertyB: import.meta.env.VITE_CUSTOM_VAR,
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

export const ExampleStory = {
  args: {
    propertyA: process.env.STORYBOOK_DATA_KEY,
  },
};
```

```js filename="FooBar.stories.js|jsx" renderer="common" language="js"
import { Foo } from './Foo';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'OtherFoo/Bar',
  component: Foo,
  id: 'Foo/Bar', // Or 'foo-bar' if you prefer
};

export const Baz = {
  name: 'Insert name here',
};
```

```js filename="YourPage.stories.js|jsx" renderer="common" language="js"
import { DocumentScreen } from './YourPage';

// 👇 Imports the required stories
import * as PageLayout from './PageLayout.stories';
import * as DocumentHeader from './DocumentHeader.stories';
import * as DocumentList from './DocumentList.stories';

export default {
  component: DocumentScreen,
};

export const Simple = {
  args: {
    user: PageLayout.Simple.args.user,
    document: DocumentHeader.Simple.args.document,
    subdocuments: DocumentList.Simple.args.documents,
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  // 👇 Meta-level parameters
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const Basic = {};
```

```ts filename=".storybook/preview.ts" renderer="common" language="js"
export default {
  parameters: {
    backgrounds: {
      values: [
        { name: 'light', value: '#fff' },
        { name: 'dark', value: '#333' },
      ],
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const OnDark = {
  // 👇 Story-level parameters
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};
```

```js filename="setupFile.js|ts" renderer="common" language="js"
// Adjust the import based on the supported framework or Storybook's testing libraries (e.g., react, testing-vue3)
import { setProjectAnnotations } from '@storybook/your-framework';

// Replace this export with the default export from your Storybook preview file if you're working with a latest version of Storybook
import * as projectAnnotations from './.storybook/preview';

// Apply the global annotations from the Storybook preview file
setProjectAnnotations(projectAnnotations);
```

```js filename="storybook.test.js|ts" renderer="common" language="js"
// 👇 Augment expect with jest-specific-snapshot
import 'jest-specific-snapshot';

// ...Code omitted for brevity

describe(options.suite, () => {
  //👇 Add storyDir in the arguments list
  getAllStoryFiles().forEach(({ filePath, storyFile, storyDir }) => {
    // ...Previously existing code
    describe(title, () => {
      // ...Previously existing code
      stories.forEach(({ name, story }) => {
        // ...Previously existing code
        testFn(name, async () => {
          // ...Previously existing code

          //👇 Define the path to save the snapshot to:
          const snapshotPath = path.join(
            storyDir,
            options.snapshotsDirName,
            `${componentName}${options.snapshotExtension}`,
          );
          expect(mounted.container).toMatchSpecificSnapshot(snapshotPath);
        });
      });
    });
  });
});
```

```js filename="storybook.test.js" renderer="common" language="js"
import path from 'path';
import * as glob from 'glob';

import { describe, test, expect } from '@jest/globals';

// Replace your-testing-library with one of the supported testing libraries (e.g., react, vue)
import { render } from '@testing-library/your-testing-library';

// Adjust the import based on the supported framework or Storybook's testing libraries (e.g., react, testing-vue3)
import { composeStories } from '@storybook/your-framework';

const compose = (entry) => {
  try {
    return composeStories(entry);
  } catch (e) {
    throw new Error(
      `There was an issue composing stories for the module: ${JSON.stringify(entry)}, ${e}`,
    );
  }
};

function getAllStoryFiles() {
  // Place the glob you want to match your stories files
  const storyFiles = glob.sync(
    path.join(__dirname, 'stories/**/*.{stories,story}.{js,jsx,mjs,ts,tsx}'),
  );

  return storyFiles.map((filePath) => {
    const storyFile = require(filePath);
    return { filePath, storyFile };
  });
}

// Recreate similar options to Storyshots. Place your configuration below
const options = {
  suite: 'Storybook Tests',
  storyKindRegex: /^.*?DontTest$/,
  storyNameRegex: /UNSET/,
  snapshotsDirName: '__snapshots__',
  snapshotExtension: '.storyshot',
};

describe(options.suite, () => {
  getAllStoryFiles().forEach(({ storyFile, componentName }) => {
    const meta = storyFile.default;
    const title = meta.title || componentName;

    if (options.storyKindRegex.test(title) || meta.parameters?.storyshots?.disable) {
      // Skip component tests if they are disabled
      return;
    }

    describe(title, () => {
      const stories = Object.entries(compose(storyFile))
        .map(([name, story]) => ({ name, story }))
        .filter(({ name, story }) => {
          // Implements a filtering mechanism to avoid running stories that are disabled via parameters or that match a specific regex mirroring the default behavior of Storyshots.
          return !options.storyNameRegex.test(name) && !story.parameters.storyshots?.disable;
        });

      if (stories.length <= 0) {
        throw new Error(
          `No stories found for this module: ${title}. Make sure there is at least one valid story for this module, without a disable parameter, or add parameters.storyshots.disable in the default export of this file.`,
        );
      }

      stories.forEach(({ name, story }) => {
        // Instead of not running the test, you can create logic to skip it, flagging it accordingly in the test results.
        const testFn = story.parameters.storyshots?.skip ? test.skip : test;

        testFn(name, async () => {
          const mounted = render(story());
          // Ensures a consistent snapshot by waiting for the component to render by adding a delay of 1 ms before taking the snapshot.
          await new Promise((resolve) => setTimeout(resolve, 1));
          expect(mounted.container).toMatchSnapshot();
        });
      });
    });
  });
});
```

```ts filename="storybook.test.js|ts" renderer="common" language="js"
// ...Code omitted for brevity

describe(options.suite, () => {
  // 👇 Add storyDir in the arguments list
  getAllStoryFiles().forEach(({ filePath, storyFile, storyDir }) => {
    // ...Previously existing code
    describe(title, () => {
      // ...Previously existing code
      stories.forEach(({ name, story }) => {
        // ...Previously existing code
        testFn(name, async () => {
          // ...Previously existing code

          // 👇 Define the path to save the snapshot to:
          const snapshotPath = path.join(
            storyDir,
            options.snapshotsDirName,
            `${componentName}${options.snapshotExtension}`,
          );
          expect(mounted.container).toMatchFileSnapshot(snapshotPath);
        });
      });
    });
  });
});
```

```js filename="storybook.test.js" renderer="common" language="js"
// @vitest-environment jsdom

import { describe, expect, test } from 'vitest';

// Replace your-testing-library with one of the supported testing libraries (e.g., react, vue)
import { render } from '@testing-library/your-testing-library';

// Adjust the import based on the supported framework or Storybook's testing libraries (e.g., react, testing-vue3)
import { composeStories } from '@storybook/your-framework';

const compose = (entry) => {
  try {
    return composeStories(entry);
  } catch (e) {
    throw new Error(
      `There was an issue composing stories for the module: ${JSON.stringify(entry)}, ${e}`,
    );
  }
};

function getAllStoryFiles() {
  // Place the glob you want to match your story files
  const storyFiles = Object.entries(
    import.meta.glob('./stories/**/*.(stories|story).@(js|jsx|mjs|ts|tsx)', {
      eager: true,
    }),
  );

  return storyFiles.map(([filePath, storyFile]) => {
    const storyDir = path.dirname(filePath);
    const componentName = path.basename(filePath).replace(/\.(stories|story)\.[^/.]+$/, '');
    return { filePath, storyFile, componentName, storyDir };
  });
}

// Recreate similar options to Storyshots. Place your configuration below
const options = {
  suite: 'Storybook Tests',
  storyKindRegex: /^.*?DontTest$/,
  storyNameRegex: /UNSET/,
  snapshotsDirName: '__snapshots__',
  snapshotExtension: '.storyshot',
};

describe(options.suite, () => {
  getAllStoryFiles().forEach(({ storyFile, componentName, storyDir }) => {
    const meta = storyFile.default;
    const title = meta.title || componentName;

    if (options.storyKindRegex.test(title) || meta.parameters?.storyshots?.disable) {
      // Skip component tests if they are disabled
      return;
    }

    describe(title, () => {
      const stories = Object.entries(compose(storyFile))
        .map(([name, story]) => ({ name, story }))
        .filter(({ name, story }) => {
          // Implements a filtering mechanism to avoid running stories that are disabled via parameters or that match a specific regex mirroring the default behavior of Storyshots.
          return !options.storyNameRegex?.test(name) && !story.parameters.storyshots?.disable;
        });

      if (stories.length <= 0) {
        throw new Error(
          `No stories found for this module: ${title}. Make sure there is at least one valid story for this module, without a disable parameter, or add parameters.storyshots.disable in the default export of this file.`,
        );
      }

      stories.forEach(({ name, story }) => {
        // Instead of not running the test, you can create logic to skip it, flagging it accordingly in the test results.
        const testFn = story.parameters.storyshots?.skip ? test.skip : test;

        testFn(name, async () => {
          const mounted = render(story());
          // Ensures a consistent snapshot by waiting for the component to render by adding a delay of 1 ms before taking the snapshot.
          await new Promise((resolve) => setTimeout(resolve, 1));

          expect(mounted.container).toMatchSnapshot();
        });
      });
    });
  });
});
```

```js filename="RegistrationForm.stories.js|jsx" renderer="common" language="js"
import { userEvent, within } from '@storybook/test';

import { RegistrationForm } from './RegistrationForm';

export default {
  component: RegistrationForm,
};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emailInput = canvas.getByLabelText('email', {
      selector: 'input',
    });

    await userEvent.type(emailInput, 'example-email@email.com', {
      delay: 100,
    });

    const passwordInput = canvas.getByLabelText('password', {
      selector: 'input',
    });

    await userEvent.type(passwordInput, 'ExamplePassword', {
      delay: 100,
    });
    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    const submitButton = canvas.getByRole('button');

    await userEvent.click(submitButton);
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    // Other Storybook addons
    '@storybook/addon-a11y', //👈 The a11y addon goes here
  ],
};
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  parameters: {
    a11y: {
      // Optional selector to inspect
      element: '#storybook-root',
      config: {
        rules: [
          {
            // The autocomplete rule will not run based on the CSS selector provided
            id: 'autocomplete-valid',
            selector: '*:not([autocomplete="nope"])',
          },
          {
            // Setting the enabled option to false will disable checks for this particular rule on all stories.
            id: 'image-alt',
            enabled: false,
          },
        ],
      },
      options: {},
      manual: true,
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    a11y: {
      // Optional selector to inspect
      element: '#storybook-root',
      config: {
        rules: [
          {
            // The autocomplete rule will not run based on the CSS selector provided
            id: 'autocomplete-valid',
            selector: '*:not([autocomplete="nope"])',
          },
          {
            // Setting the enabled option to false will disable checks for this particular rule on all stories.
            id: 'image-alt',
            enabled: false,
          },
        ],
      },
      // Axe's options parameter
      options: {},
      // Optional flag to prevent the automatic check
      manual: true,
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

// To apply a set of backgrounds to all stories of Button:
export default {
  component: Button,
  parameters: {
    backgrounds: {
      default: 'twitter',
      values: [
        { name: 'twitter', value: '#00aced' },
        { name: 'facebook', value: '#3b5998' },
      ],
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

// To apply a grid to all stories of Button:
export default {
  component: Button,
  parameters: {
    backgrounds: {
      grid: {
        cellSize: 20,
        opacity: 0.5,
        cellAmount: 5,
        offsetX: 16, // Default is 0 if story has 'fullscreen' layout, 16 if layout is 'padded'
        offsetY: 16, // Default is 0 if story has 'fullscreen' layout, 16 if layout is 'padded'
      },
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Large = {
  parameters: {
    backgrounds: { disable: true },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Large = {
  parameters: {
    backgrounds: {
      grid: {
        disable: true,
      },
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Large = {
  parameters: {
    backgrounds: { default: 'facebook' },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};
```

```js filename="/my-addon/manager.js" renderer="common" language="js"
addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'My Addon',
    render: () => <div>Addon tab content</div>,
    paramKey: 'myAddon', // this element
  });
});
```

```js filename="my-preset/index.js" renderer="common" language="js"
function managerEntries(entry = []) {
  return [...entry, require.resolve('my-other-addon/register')];
}

const config = (entry = [], options) => {
  return [...entry, require.resolve('my-other-addon/addDecorator')];
};

export default {
  managerEntries,
  config,
};
```

```js filename="addon-panel/manager.js" renderer="common" language="js"
import React from 'react';

import { AddonPanel } from '@storybook/components';

import { useGlobals, addons, types } from '@storybook/manager-api';

addons.register('my/panel', () => {
  addons.add('my-panel-addon/panel', {
    title: 'Example Storybook panel',
    //👇 Sets the type of UI element in Storybook
    type: types.PANEL,
    render: ({ active }) => (
      <AddonPanel active={active}>
        <h2>I'm a panel addon in Storybook</h2>
      </AddonPanel>
    ),
  });
});
```

```js filename="my-addon/src/manager.js|ts" renderer="common" language="js"
import React from 'react';

import { addons, types } from '@storybook/manager-api';

import { AddonPanel } from '@storybook/components';

const ADDON_ID = 'myaddon';
const PANEL_ID = `${ADDON_ID}/panel`;

addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'My Addon',
    render: ({ active }) => (
      <AddonPanel active={active}>
        <div> Storybook addon panel </div>
      </AddonPanel>
    ),
  });
});
```

```js filename=".storybook/my-addon/preset.js" renderer="common" language="js"
export function config(entry = []) {
  return [...entry, require.resolve('./defaultParameters')];
}

export function managerEntries(entries) {
  return [...entries, require.resolve('./register')];
}

export default {
  parameters: {
    backgrounds: {
      values: [
        { name: 'light', value: '#F8F8F8' },
        { name: 'dark', value: '#333333' },
      ],
    },
  },
};
```

```js filename="addon-tab/manager.js" renderer="common" language="js"
import React from 'react';

import { addons, types } from '@storybook/manager-api';

addons.register('my-addon', () => {
  addons.add('my-addon/tab', {
    type: types.TAB,
    title: 'Example Storybook tab',
    render: () => (
      <div>
        <h2>I'm a tabbed addon in Storybook</h2>
      </div>
    ),
  });
});
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import { withThemeByClassName } from '@storybook/addon-themes';

import '../src/index.css'; // Your application's global CSS file

const preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import { withThemeByDataAttribute } from '@storybook/addon-themes';

import '../src/index.css'; // Your application's global CSS file

const preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import { withThemeFromJSXProvider } from '@storybook/addon-themes';

import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../src/themes';

const GlobalStyles = createGlobalStyle`
  body {
    font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
`;

const preview = {
  decorators: [
    withThemeFromJSXProvider({
      themes: {
        light: lightTheme,
        dark: darkTheme,
      }
      defaultTheme: 'light',
      Provider: ThemeProvider,
      GlobalStyles,
    })
  ]
};

export default preview;
```

```js filename="addon-toolbar/manager.js" renderer="common" language="js"
import React from 'react';

import { addons, types } from '@storybook/manager-api';
import { IconButton } from '@storybook/components';
import { OutlineIcon } from '@storybook/icons';

addons.register('my-addon', () => {
  addons.add('my-addon/toolbar', {
    title: 'Example Storybook toolbar',
    //👇 Sets the type of UI element in Storybook
    type: types.TOOL,
    //👇 Shows the Toolbar UI element if the story canvas is being viewed
    match: ({ tabId, viewMode }) => !tabId && viewMode === 'story',
    render: ({ active }) => (
      <IconButton active={active} title="Show a Storybook toolbar">
        <OutlineIcon />
      </IconButton>
    ),
  });
});
```

```js filename="my-addon/src/manager.js|ts" renderer="common" language="js"
addons.register('my-organisation/my-addon', (api) => {
  api.setQueryParams({
    exampleParameter: null,
  });
});
```

```js filename="my-addon/src/manager.js|ts" renderer="common" language="js"
import React, { useCallback } from 'react';

import { FORCE_RE_RENDER } from '@storybook/core-events';
import { addons } from '@storybook/preview-api';
import { useGlobals } from '@storybook/manager-api';
import { IconButton } from '@storybook/components';
import { OutlineIcon } from '@storybook/icons';

const ExampleToolbar = () => {
  const [globals, updateGlobals] = useGlobals();

  const isActive = globals['my-param-key'] || false;

  // Function that will update the global value and trigger a UI refresh.
  const refreshAndUpdateGlobal = () => {
    updateGlobals({
      ['my-param-key']: !isActive,
    }),
      // Invokes Storybook's addon API method (with the FORCE_RE_RENDER) event to trigger a UI refresh
      addons.getChannel().emit(FORCE_RE_RENDER);
  };

  const toggleToolbarAddon = useCallback(() => refreshAndUpdateGlobal(), [isActive]);

  return (
    <IconButton
      key="Example"
      active={isActive}
      title="Show the toolbar addon"
      onClick={toggleToolbarAddon}
    >
      <OutlineIcon />
    </IconButton>
  );
};
```

```js filename="my-addon/src/manager.js|ts" renderer="common" language="js"
addons.register('my-organisation/my-addon', (api) => {
  api.getQueryParam('exampleParameter');
});
```

```js filename="my-addon/src/manager.js|ts" renderer="common" language="js"
addons.register('my-organisation/my-addon', (api) => {
  const href = api.getUrlState({
    selectedKind: 'kind',
    selectedStory: 'story',
  }).url;
});
```

```js filename="my-addon/src/manager.js|ts" renderer="common" language="js"
import { addons } from '@storybook/preview-api';

import { useStorybookApi } from '@storybook/manager-api';
```

```js filename="my-addon/src/decorator.js|ts" renderer="common" language="js"
import { makeDecorator } from '@storybook/preview-api';

export const withAddonDecorator = makeDecorator({
  name: 'withSomething',
  parameterName: 'CustomParameter',
  skipIfNoParametersOrOptions: true
  wrapper: (getStory, context, { parameters }) => {
    /*
    * Write your custom logic here based on the parameters passed in Storybook's stories.
    * Although not advised, you can also alter the story output based on the parameters.
    */
    return getStory(context);
  },
});
```

```js filename="my-addon/src/manager.js|ts" renderer="common" language="js"
addons.register('my-organisation/my-addon', (api) => {
  // Logs the event data to the browser console whenever the event is emitted.
  api.on('custom-addon-event', (eventData) => console.log(eventData));
});
```

```js filename="my-addon/src/manager.js|ts" renderer="common" language="js"
import { addons } from '@storybook/preview-api';

// Register the addon with a unique name.
addons.register('my-organisation/my-addon', (api) => {});
```

```js filename="my-addon/src/manager.js|ts" renderer="common" language="js"
addons.register('my-organisation/my-addon', (api) => {
  api.selectInCurrentKind('Default');
});
```

```js filename="my-addon/src/manager.js|ts" renderer="common" language="js"
addons.register('my-organisation/my-addon', (api) => {
  api.selectStory('Button', 'Default');
});
```

```js filename="my-addon/src/manager.js|ts" renderer="common" language="js"
addons.register('my-organisation/my-addon', (api) => {
  api.setQueryParams({
    exampleParameter: 'Sets the example parameter value',
    anotherParameter: 'Sets the another parameter value',
  });
});
```

```js filename="my-addon/manager.js|ts" renderer="common" language="js"
import React from 'react';

import { useAddonState } from '@storybook/manager-api';
import { AddonPanel, IconButton } from '@storybook/components';
import { LightningIcon } from '@storybook/icons';

export const Panel = () => {
  const [state, setState] = useAddonState('addon-unique-identifier', 'initial state');

  return (
    <AddonPanel key="custom-panel" active="true">
      <Button onClick={() => setState('Example')}>
        Click to update Storybook's internal state
      </Button>
    </AddonPanel>
  );
};
export const Tool = () => {
  const [state, setState] = useAddonState('addon-unique-identifier', 'initial state');

  return (
    <IconButton
      key="custom-toolbar"
      active="true"
      title="Enable my addon"
      onClick={() => setState('Example')}
    >
      <LightningIcon />
    </IconButton>
  );
};
```

```js filename="my-addon/manager.js|ts" renderer="common" language="js"
import React, { useEffect, useCallback } from 'react';

import { useStorybookApi } from '@storybook/manager-api';
import { IconButton } from '@storybook/components';
import { ChevronDownIcon } from '@storybook/icons';

export const Panel = () => {
  const api = useStorybookApi();

  const toggleMyTool = useCallback(() => {
    // Custom logic to toggle the addon here
  }, []);

  useEffect(() => {
    api.setAddonShortcut('custom-toolbar-addon', {
      label: 'Enable toolbar addon',
      defaultShortcut: ['G'],
      actionName: 'Toggle',
      showInMenu: false,
      action: toggleAddon,
    });
  }, [api]);

  return (
    <IconButton key="custom-toolbar" active="true" title="Show a toolbar addon">
      <ChevronDownIcon />
    </IconButton>
  );
};
```

```js filename="my-addon/manager.js|ts" renderer="common" language="js"
import React from 'react';

import { AddonPanel, Button } from '@storybook/components';

import { STORY_CHANGED } from '@storybook/core-events';

import { useChannel } from '@storybook/manager-api';

export const Panel = () => {
  // Creates a Storybook API channel and subscribes to the STORY_CHANGED event
  const emit = useChannel({
    STORY_CHANGED: (...args) => console.log(...args),
  });

  return (
    <AddonPanel key="custom-panel" active="true">
      <Button onClick={() => emit('my-event-type', { sampleData: 'example' })}>
        Emit a Storybook API event with custom data
      </Button>
    </AddonPanel>
  );
};
```

```js filename="my-addon/manager.js|ts" renderer="common" language="js"
import React from 'react';

import { AddonPanel, Button } from '@storybook/components';

import { useGlobals } from '@storybook/manager-api';

export const Panel = () => {
  const [globals, updateGlobals] = useGlobals();

  const isActive = globals['my-param-key'] || false; // 👈 Sets visibility based on the global value.

  return (
    <AddonPanel key="custom-panel" active={isActive}>
      <Button onClick={() => updateGlobals({ ['my-param-key']: !isActive })}>
        {isActive ? 'Hide the addon panel' : 'Show the panel'}
      </Button>
    </AddonPanel>
  );
};
```

```js filename="my-addon/manager.js|ts" renderer="common" language="js"
import React from 'react';

import { AddonPanel } from '@storybook/components';

import { useParameter } from '@storybook/manager-api';

export const Panel = () => {
  // Connects to Storybook's API and retrieves the value of the custom parameter for the current story
  const value = useParameter('custom-parameter', 'initial value');

  return (
    <AddonPanel key="custom-panel" active="true">
      {value === 'initial value' ? (
        <h2>The story doesn't contain custom parameters. Defaulting to the initial value.</h2>
      ) : (
        <h2>You've set {value} as the parameter.</h2>
      )}
    </AddonPanel>
  );
};
```

```js filename="my-addon/src/manager.js|ts" renderer="common" language="js"
import React from 'react';

import { AddonPanel } from '@storybook/components';

import { useStorybookState } from '@storybook/manager-api';

export const Panel = () => {
  const state = useStorybookState();
  return (
    <AddonPanel {...props}>
      {state.viewMode !== 'docs' ? (
        <h2>Do something with the documentation</h2>
      ) : (
        <h2>Show the panel when viewing the story</h2>
      )}
    </AddonPanel>
  );
};
```

```js filename="example-addon/src/preset.js" renderer="common" language="js"
import { webpackFinal as webpack } from './webpack/webpackFinal';
import { viteFinal as vite } from './vite/viteFinal';
import { babelDefault as babel } from './babel/babelDefault';

export const webpackFinal = webpack;
export const viteFinal = vite;
export const babelDefault = babel;
```

```js filename="example-addon/src/babel/babelDefault.js" renderer="common" language="js"
export function babelDefault(config) {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      [require.resolve('@babel/plugin-transform-react-jsx'), {}, 'preset'],
    ],
  };
}
```

```js filename="example-addon/src/preview.js" renderer="common" language="js"
import { PARAM_KEY } from './constants';

import { CustomDecorator } from './decorators';

const preview = {
  decorators: [CustomDecorator],
  globals: {
    [PARAM_KEY]: false,
  },
};

export default preview;
```

```js filename="example-addon/src/vite/viteFinal.js" renderer="common" language="js"
export function ViteFinal(config, options = {}) {
  config.plugins.push(
    new MyCustomPlugin({
      someOption: true,
    }),
  );

  return config;
}
```

```js filename="example-addon/src/webpack/webpackFinal.js" renderer="common" language="js"
export function webpackFinal(config, options = {}) {
  const rules = [
    ...(config.module?.rules || []),
    {
      test: /\.custom-file-extension$/,
      loader: require.resolve(`custom-loader`),
    },
  ];
  config.module.rules = rules;

  return config;
}
```

```js renderer="common" language="js"
//example-addon/preset.js

export const managerEntries = (entry = []) => {
  return [...entry, require.resolve('path-to-third-party-addon')];
};
```

```js filename="preset.js" renderer="common" language="js"
export const previewAnnotations = (entry = [], options) => {
  return [...entry, require.resolve('./dist/preview')];
};
```

```js filename="example-addon/preset.js" renderer="common" language="js"
export const previewAnnotations = [require.resolve('./dist/preview')];

export const managerEntries = [require.resolve('./dist/manager')];

export * from './dist/preset';
```

```js renderer="common" language="js"
{
  obj: { key: 'val' },
  arr: ['one', 'two'],
  nil: null
}
```

```js filename=".storybook/my-addon/manager.js" renderer="common" language="js"
import { useArgTypes } from '@storybook/manager-api';

// inside your panel
const { argTypes } = useArgTypes();
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  docs: {
    //👇 See the table below for the list of supported options
    defaultName: 'Documentation',
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: [
    //👇 Your documentation written in MDX along with your stories goes here
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials'],
};
```

```js filename="addons/backgrounds/src/preset/addParameter.tsx" renderer="common" language="js"
export default {
  parameters: {
    backgrounds: {
      values: [
        { name: 'light', value: '#F8F8F8' },
        { name: 'dark', value: '#333333' },
      ],
    },
  },
};
```

```js filename="preset.js" renderer="common" language="js"
export function config(entry = []) {
  return [...entry, require.resolve('./defaultParameters')];
}
```

```jsx filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { ColorItem, ColorPalette } from '@storybook/blocks';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

const theme = {
  colors: {
    primaryDark: {
      value: '#1C1C1C',
    },
    primaryRegular: {
      value: '#363636',
    },
    primaryLight1: {
      value: '#4D4D4D',
    },
    primaryLight2: {
      value: '#878787',
    },
    primaryLight3: {
      value: '#D1D1D1',
    },
    primaryLight4: {
      value: '#EDEDED',
    },
  },
};

// ❌ Don't use the Doc Blocks inside your stories. It will break Storybook with a cryptic error.
export const Colors = {
  render: () => (
    <ColorPalette>
      {Object.entries(theme.colors).map(([key, { value }]) => (
        <ColorItem
          colors={{
            [key]: value,
          }}
          key={key}
          subtitle={`theme.colors.${key}`}
          title={key}
        />
      ))}
    </ColorPalette>
  ),
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  // Sets the layout parameter component wide.
  parameters: {
    layout: 'centered',
  },
};
```

```js filename=".storybook/manager.js" renderer="common" language="js"
import { addons } from '@storybook/manager-api';

addons.setConfig({
  navSize: 300,
  bottomPanelHeight: 300,
  rightPanelWidth: 300,
  panelPosition: 'bottom',
  enableShortcuts: true,
  showToolbar: true,
  theme: undefined,
  selectedPanel: undefined,
  initialActive: 'sidebar',
  sidebar: {
    showRoots: false,
    collapsedRoots: ['other'],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
});
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  stories: [],
  addons: [
    // Other Storybook addons
    {
      name: '@storybook/addon-coverage',
      options: {
        istanbul: {
          include: ['**/stories/**'],
          exclude: ['**/exampleDirectory/**'],
        },
      },
    },
  ],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-coverage',
  ],
  build: {
    test: {
      disabledAddons: ['@storybook/addon-docs', '@storybook/addon-essentials/docs'],
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  stories: [],
  addons: [
    // Other Storybook addons
    '@storybook/addon-coverage', //👈 Registers the addon
  ],
};
```

```shell renderer="common" language="js"
npx nyc report --reporter=lcov -t coverage/storybook --report-dir coverage/storybook
```

```js filename=".nyc.config.js" renderer="common" language="js"
export default {
  // Other configuration options
  extension: ['.js', '.cjs', '.mjs', '.ts', '.tsx', '.jsx', '.vue'],
};
```

```js filename="components/MyComponent/MyComponent.stories.js|jsx" renderer="common" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  title: 'components/MyComponent/MyComponent',
};

export const Default = {
  args: {
    something: 'Something else',
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  managerHead: (head) => `
    ${head}
    <link rel="icon" type="image/png" href="/logo192.png" sizes="192x192" />
  `,
};
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
// ❌ Don't use the package's index file to import the component.
import { MyComponent } from '@component-package';

// ✅ Use the component's export to import it directly.
import { MyComponent } from '@component-package/src/MyComponent';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'MyComponent',
  component: MyComponent,
};
```

```js filename="your-framework/src/client/preview/render.ts" renderer="common" language="js"
const rootElement = document.getElementById('root');

export default function renderMain({ storyFn }: RenderMainArgs) {
  const storyObj = storyFn();
  const html = fn(storyObj);
  rootElement.innerHTML = html;
}
```

```js renderer="common" language="js"
const argTypes = {
  label: {
    name: 'label',
    type: { name: 'string', required: false },
    defaultValue: 'Hello',
    description: 'demo description',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'Hello' },
    },
    control: {
      type: 'text',
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    // Other Storybook addons
    '@storybook/addon-interactions', // 👈 Register the addon
  ],
};
```

```js filename="Form.stories.js|jsx" renderer="common" language="js"
import { userEvent, waitFor, within, expect, fn } from '@storybook/test';

import { Form } from './Form';

export default {
  component: Form,
  args: {
    // 👇 Use `fn` to spy on the onSubmit arg
    onSubmit: fn(),
  },
};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const Submitted = {
  play: async ({ args, canvasElement, step }) => {
    // Starts querying the component from its root element
    const canvas = within(canvasElement);

    await step('Enter credentials', async () => {
      await userEvent.type(canvas.getByTestId('email'), 'hi@example.com');
      await userEvent.type(canvas.getByTestId('password'), 'supersecret');
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button'));
    });

    // 👇 Now we can assert that the onSubmit arg was called
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalled());
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="common" language="js"
import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const Submitted = {
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Enter email and password', async () => {
      await userEvent.type(canvas.getByTestId('email'), 'hi@example.com');
      await userEvent.type(canvas.getByTestId('password'), 'supersecret');
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button'));
    });
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  viteFinal: async (config, options) => {
    // Update config here
    return config;
  },
  webpackFinal: async (config, options) => {
    // Change webpack config
    return config;
  },
  babel: async (config, options) => {
    return config;
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: [
    {
      directory: '../src',
      titlePrefix: 'Custom', // 👈 Configure the title prefix
    },
  ],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
import remarkGfm from 'remark-gfm';

export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    // Other addons go here
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false, // 👈 disable the backgrounds addon
      },
    },
  ],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    // Other Storybook addons
    '@storybook/addon-designs', // 👈 Addon is registered here
  ],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    // Overrides the default Typescript configuration to allow multi-package components to be documented via Autodocs.
    reactDocgen: 'react-docgen',
    check: false,
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-actions',
    '@storybook/addon-viewport',
    {
      name: '@storybook/addon-docs',
      options: {
        csfPluginOptions: null,
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [],
          },
        },
      },
    },
    '@storybook/addon-controls',
    '@storybook/addon-backgrounds',
    '@storybook/addon-toolbars',
    '@storybook/addon-measure',
    '@storybook/addon-outline',
  ],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../my-project/src/components/*.@(js|md)'],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
import path from 'path';

const getAbsolutePath = (packageName) =>
  path.dirname(require.resolve(path.join(packageName, 'package.json')));

export default {
  framework: {
    // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
    name: getAbsolutePath('@storybook/your-framework'),
    options: {},
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    //👇 Use getAbsolutePath when referencing Storybook's addons and frameworks
    getAbsolutePath('@storybook/addon-essentials'),
  ],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  previewHead: (head) => (`
    ${head}
    <style>
      #main {
        background-color: yellow;
      }
    </style>
  `);
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  refs: {
    react: {
      title: 'React',
      url: 'http://localhost:7007',
    },
    angular: {
      title: 'Angular',
      url: 'http://localhost:7008',
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  addons: ['path/to/manager.js'],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials'], // 👈 Register addon-essentials
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  addons: [
    // Other Storybook addons
    '@storybook/addon-a11y',
  ],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-actions'],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  addons: [
    '@storybook/addon-docs/preset', // A preset registered here, in this case from the addon-docs addon.
  ],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  webpackFinal: async (config) => {
    config.plugins.push(...);
    return config;
  },
}
```

```js filename=".storybook/main.js" renderer="common" language="js"
import path from 'path';

export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
      };
    }
    return config;
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.plugins = [
        ...(config.resolve.plugins || []),
        new TsconfigPathsPlugin({
          extensions: config.resolve.extensions,
        }),
      ];
    }
    return config;
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  managerEntries: ['some-storybook-addon/entry-point.js'],
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
import custom from '../webpack.config.js'; // 👈 Custom Webpack configuration being imported.

export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  webpackFinal: async (config) => {
    return {
      ...config,
      module: { ...config.module, rules: [...config.module.rules, ...custom.module.rules] },
    };
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export function webpackFinal(config, { presets }) {
  const version = await presets.apply('webpackVersion');
  const instance = (await presets.apply('webpackInstance'))?.default;

  logger.info(`=> Running in webpack ${version}: ${instance}`);
  return config;
}
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    builder: {
      name: '@storybook/builder-webpack5',
      options: {
        fsCache: true,
        lazyCompilation: true,
      },
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export async function webpack(baseConfig, options) {
  // Modify or replace config.
  // Mutating the original reference object can cause unexpected bugs,
  // so in this example we replace.
  const { module = {} } = baseConfig;

  return {
    ...baseConfig,
    module: {
      ...module,
      rules: [
        ...(module.rules || []),
        {
          /* some new loader */
        },
      ],
    },
  };
}
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  core: {
    builder: {
      name: 'webpack5',
      options: {
        fsCache: true,
      },
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  core: {
    builder: {
      name: 'webpack5',
      options: {
        lazyCompilation: true,
      },
    },
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  core: {
    builder: '@storybook/builder-webpack5',
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export function webpackFinal(config, { configDir }) {
  if (!isReactScriptsInstalled()) {
    logger.info('=> Using base config because react-scripts is not installed.');
    return config;
  }

  logger.info('=> Loading create-react-app config.');
  return applyCRAWebpackConfig(config, configDir);
}
```

```js filename=".storybook/manager.js" renderer="common" language="js"
import { addons } from '@storybook/manager-api';
import yourTheme from './YourTheme';

addons.setConfig({
  theme: yourTheme,
});
```

```js filename=".storybook/manager.js" renderer="common" language="js"
import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: themes.dark,
});
```

```js filename="./storybook/manager.js" renderer="common" language="js"
import { addons } from '@storybook/manager-api';

addons.setConfig({
  sidebar: {
    showRoots: false,
  },
});
```

```js filename=".storybook/manager.js" renderer="common" language="js"
import { addons } from '@storybook/manager-api';

import startCase from 'lodash/startCase.js';

addons.setConfig({
  sidebar: {
    renderLabel: ({ name, type }) => (type === 'story' ? name : startCase(name)),
  },
});
```

```js renderer="common" language="js"
const argTypes = {
  label: {
    name: 'label',
    type: { name: 'string', required: false },
    defaultValue: 'Hello',
    description: 'overwritten description',
    table: {
      type: {
        summary: 'something short',
        detail: 'something really really long',
      },
      defaultValue: { summary: 'Hello' },
    },
    control: {
      type: null,
    },
  },
};
```

```js filename=".storybook/my-preset.js" renderer="common" language="js"
export default {
  managerWebpack: async (config, options) => {
    // Update config here
    return config;
  },
  webpackFinal: async (config, options) => {
    return config;
  },
  babel: async (config, options) => {
    return config;
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import * as React from 'react';

import { DocsContainer } from '@storybook/blocks';

const ExampleContainer = ({ children, ...props }) => {
  return <DocsContainer {...props}>{children}</DocsContainer>;
};

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      container: ExampleContainer,
    },
  },
};
```

```jsx filename=".storybook/preview.jsx" renderer="common" language="js"
import DocumentationTemplate from './DocumentationTemplate.mdx';

export default {
  parameters: {
    docs: {
      page: DocumentationTemplate,
    },
  },
};
```

```jsx filename=".storybook/preview.jsx" renderer="common" language="js"
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/blocks';

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Stories />
        </>
      ),
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import { MDXProvider } from '@mdx-js/react';

import { DocsContainer } from '@storybook/blocks';

import * as DesignSystem from 'your-design-system';

export const MyDocsContainer = (props) => (
  <MDXProvider
    components={{
      h1: DesignSystem.H1,
      h2: DesignSystem.H2,
    }}
  >
    <DocsContainer {...props} />
  </MDXProvider>
);

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      container: MyDocsContainer,
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import { themes, ensure } from '@storybook/theming';

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      theme: ensure(themes.dark), // The replacement theme to use
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    viewport: {
      viewports: newViewports, // newViewports would be an ViewportMap. (see below for examples)
      defaultViewport: 'someDefault',
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    backgrounds: {
      default: 'twitter',
      values: [
        {
          name: 'twitter',
          value: '#00aced',
        },
        {
          name: 'facebook',
          value: '#3b5998',
        },
      ],
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
const preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        // The label to show for this toolbar item
        title: 'Theme',
        icon: 'circlehollow',
        // Array of plain string values or MenuItem shape (see below)
        items: ['light', 'dark'],
        // Change title based on selected value
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import { MyCanvas } from './MyCanvas';

export default {
  parameters: {
    docs: {
      components: {
        Canvas: MyCanvas,
      },
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import { CodeBlock } from './CodeBlock';

export default {
  parameters: {
    docs: {
      components: {
        code: CodeBlock,
      },
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
      ],
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    docs: {
      toc: {
        contentsSelector: '.sbdocs-content',
        headingSelector: 'h1, h2, h3',
        ignoreSelector: '#primary',
        title: 'Table of Contents',
        disable: false,
        unsafeTocbotOptions: {
          orderedList: false,
        },
      },
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    docs: {
      controls: { exclude: ['style'] },
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import { themes } from '@storybook/theming';

export default {
  parameters: {
    docs: {
      theme: themes.dark,
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    options: {
      storySort: {
        method: '',
        order: [],
        locales: '',
      },
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    docs: {
      toc: true, // 👈 Enables the table of contents
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    controls: { expanded: true },
  },
};
```

```js renderer="common" language="js"
addonActionsTheme: {
  ...chromeLight,
  BASE_FONT_FAMILY: typography.fonts.mono,
  BASE_BACKGROUND_COLOR: 'transparent',
}
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import fetch from 'node-fetch';

export default {
  loaders: [
    async () => ({
      currentUser: await (await fetch('https://jsonplaceholder.typicode.com/users/1')).json(),
    }),
  ],
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
      ],
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';

export default {
  parameters: {
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        ...MINIMAL_VIEWPORTS,
      },
      defaultViewport: 'iphone14promax',
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import '../src/styles/global.css';

export default {
  parameters: {},
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    layout: 'centered',
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
const preview = {
  globalTypes: {
    locale: {
      description: 'Internationalization locale',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', right: '🇺🇸', title: 'English' },
          { value: 'fr', right: '🇫🇷', title: 'Français' },
          { value: 'es', right: '🇪🇸', title: 'Español' },
          { value: 'zh', right: '🇨🇳', title: '中文' },
          { value: 'kr', right: '🇰🇷', title: '한국어' },
        ],
      },
    },
  },
};

export default preview;
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    actions: { argTypesRegex: '^on.*' },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';

const customViewports = {
  kindleFire2: {
    name: 'Kindle Fire 2',
    styles: {
      width: '600px',
      height: '963px',
    },
  },
  kindleFireHD: {
    name: 'Kindle Fire HD',
    styles: {
      width: '533px',
      height: '801px',
    },
  },
};

export default {
  parameters: {
    viewport: {
      viewports: {
        ...MINIMAL_VIEWPORTS,
        ...customViewports,
      },
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    docs: {
      // Opt-out of inline rendering
      story: { inline: false },
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    controls: {
      presetColors: [{ color: '#ff4785', title: 'Coral' }, 'rgba(0, 159, 183, 1)', '#fe4a49'],
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import React from 'react';
import { render } from 'react-dom';
import toReact from '@egoist/vue-to-react';

export default {
  parameters: {
    docs: {
      // deprecated do not use
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';

// Registers and enables scss language support
SyntaxHighlighter.registerLanguage('scss', scss);

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    options: {
      storySort: (a, b) =>
        a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true }),
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
import { MyThemes } from '../my-theme-folder/my-theme-file';

const preview = {
  decorators: [
    (story, context) => {
      const selectedTheme = context.globals.theme || 'light';
      const theme = MyThemes[selectedTheme];
      return (
        // Your theme provider and other context providers go here
      )
    },
  ],
};

export default preview;
```

```js filename=".storybook/preview.js|ts" renderer="common" language="js"
const customViewports = {
  kindleFire2: {
    name: 'Kindle Fire 2',
    styles: {
      width: '600px',
      height: '963px',
    },
  },
  kindleFireHD: {
    name: 'Kindle Fire HD',
    styles: {
      width: '533px',
      height: '801px',
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    viewport: { viewports: customViewports },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    options: {
      storySort: {
        order: ['Intro', 'Pages', ['Home', 'Login', 'Admin'], 'Components', '*', 'WIP'],
      },
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  parameters: {
    options: {
      storySort: {
        order: ['Intro', 'Pages', ['Home', 'Login', 'Admin'], 'Components'],
      },
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="common" language="js"
import { Button } from './Button':

export default {
  component: Button,
}

export const WithLayout = {
  parameters: {
    layout: 'centered',
  },
};
```

```js filename=".storybook/main.js" renderer="common" language="js"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  // 👇 Storybook will load all existing stories within the MyStories folder
  stories: ['../packages/MyStories'],
};
```

```js filename="storysource/preset.js" renderer="common" language="js"
/* nothing needed */
```

```js renderer="common" language="js"
{
  stack: 'Error: Your button is not working\n' +
    '    at Object.<anonymous> ($SNIP/test.js:39:27)\n' +
    '    at Module._compile (node:internal/modules/cjs/loader:1103:14)\n' +
    '    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1157:10)\n' +
    '    at Module.load (node:internal/modules/cjs/loader:981:32)\n' +
    '    at Function.Module._load (node:internal/modules/cjs/loader:822:12)\n' +
    '    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12)\n' +
    '    at node:internal/main/run_main_module:17:47',
  message: 'Your button is not working'
}
```

```js filename="NoteUI.stories.js" renderer="common" language="js"
import { expect, userEvent, within } from '@storybook/test';

import { saveNote } from '../../app/actions.mock';
import { createNotes } from '../../mocks/notes';
import NoteUI from './note-ui';

export default {
  title: 'Mocked/NoteUI',
  component: NoteUI,
};

const notes = createNotes();

export const SaveFlow = {
  name: 'Save Flow ▶',
  args: {
    isEditing: true,
    note: notes[0],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const saveButton = canvas.getByRole('menuitem', { name: /done/i });
    await userEvent.click(saveButton);
    // 👇 This is the mock function, so you can assert its behavior
    await expect(saveNote).toHaveBeenCalled();
  },
};
```

```js filename="Page.stories.js" renderer="common" language="js"
import { getUserFromSession } from '../../api/session.mock';
import { Page } from './Page';

export default {
  component: Page,
};

export const Default = {
  async beforeEach() {
    // 👇 Set the return value for the getUserFromSession function
    getUserFromSession.mockReturnValue({ id: '1', name: 'Alice' });
  },
};
```

```js filename="MyComponent-test.js" renderer="common" language="js"
it('should format CSF exports with sensible defaults', () => {
  const testCases = {
    name: 'Name',
    someName: 'Some Name',
    someNAME: 'Some NAME',
    some_custom_NAME: 'Some Custom NAME',
    someName1234: 'Some Name 1234',
    someName1_2_3_4: 'Some Name 1 2 3 4',
  };
  Object.entries(testCases).forEach(([key, val]) => {
    expect(storyNameFromExport(key)).toBe(val);
  });
});
```

```js filename=".storybook/YourTheme.js" renderer="common" language="js"
import { create } from '@storybook/theming/create';

export default create({
  base: 'light',
  brandTitle: 'My custom Storybook',
  brandUrl: 'https://example.com',
  brandImage: 'https://storybook.js.org/images/placeholders/350x150.png',
  brandTarget: '_self',
});
```

```js filename="YourTheme.js" renderer="common" language="js"
import { styled } from '@storybook/theming';
```

```js filename=".storybook/main.js|ts" renderer="common" language="js"
export default {
  stories: ['../src/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['storybook-dark-mode'],
      },
    });
  },
};
```

```js filename=".storybook/main.js|ts" renderer="common" language="js"
export default {
  stories: ['../src/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  core: {
    builder: '@storybook/builder-vite',
  },
  typescript: {
    // Enables the `react-docgen-typescript` parser.
    // See https://storybook.js.org/docs/api/main-config-typescript for more information about this option.
    reactDocgen: 'react-docgen-typescript',
  },
};
```

```js filename=".storybook/main.js|ts" renderer="common" language="js"
export default {
  stories: ['../src/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  core: {
    builder: '@storybook/builder-vite', // 👈 The builder enabled here.
  },
};
```

```js filename="Button.stories.js" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  //👇 Enables auto-generated documentation for this component and includes all stories in this file
  tags: ['autodocs'],
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  // ...rest of preview
  //👇 Enables auto-generated documentation for all stories
  tags: ['autodocs'],
};
```

```js filename="Page.stories.js" renderer="common" language="js"
import { Page } from './Page';

export default {
  component: Page,
  // 👇 Disable auto-generated documentation for this component
  tags: ['!autodocs'],
};
```

```js filename="Button.stories.js" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  //👇 Enables auto-generated documentation for this component and includes all stories in this file
  tags: ['autodocs'],
};

export const UndocumentedStory = {
  // 👇 Removes this story from auto-generated documentation
  tags: ['!autodocs'],
};
```

```js filename="Button.stories.js" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  /**
   * 👇 All stories in this file will:
   *    - Be included in the docs page
   *    - Not appear in Storybook's sidebar
   */
  tags: ['autodocs', '!dev'],
};
```

```js filename="Button.stories.js" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  /**
   * 👇 All stories in this file will have these tags applied:
   *    - autodocs
   *    - dev (implicit default, inherited from preview)
   *    - test (implicit default, inherited from preview)
   */
  tags: ['autodocs'],
};

export const ExperimentalFeatureStory = {
  /**
   * 👇 This particular story will have these tags applied:
   *    - experimental
   *    - autodocs (inherited from meta)
   *    - dev (inherited from meta)
   *    - test (inherited from meta)
   */
  tags: ['experimental'],
};
```

```js filename=".storybook/preview.js" renderer="common" language="js"
export default {
  // ...rest of preview
  /**
   * 👇 All stories in your project will have these tags applied:
   *    - autodocs
   *    - dev (implicit default)
   *    - test (implicit default)
   */
  tags: ['autodocs'],
};
```

```js filename="Button.stories.js" renderer="common" language="js"
import { Button } from './Button';

export default {
  component: Button,
  // 👇 Applies to all stories in this file
  tags: ['stable'],
};

export const ExperimentalFeatureStory = {
  /**
   * 👇 For this particular story, remove the inherited
   *    `stable` tag and apply the `experimental` tag
   */
  tags: ['!stable', 'experimental'],
};
```

```js filename=".storybook/test-runner.js" renderer="common" language="js"
const { injectAxe, checkA11y } = require('axe-playwright');

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
module.exports = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page) {
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  },
};
```

```js filename=".storybook/test-runner.js" renderer="common" language="js"
const { injectAxe, checkA11y, configureAxe } = require('axe-playwright');

const { getStoryContext } = require('@storybook/test-runner');

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
module.exports = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    // Get the entire context of a story, including parameters, args, argTypes, etc.
    const storyContext = await getStoryContext(page, context);

    // Apply story-level a11y rules
    await configureAxe(page, {
      rules: storyContext.parameters?.a11y?.config?.rules,
    });

    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  },
};
```

```js filename=".storybook/test-runner.js" renderer="common" language="js"
const { getStoryContext } = require('@storybook/test-runner');

const { injectAxe, checkA11y } = require('axe-playwright');
/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
module.exports = {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    // Get the entire context of a story, including parameters, args, argTypes, etc.
    const storyContext = await getStoryContext(page, context);

    // Do not run a11y tests on disabled stories.
    if (storyContext.parameters?.a11y?.disable) {
      return;
    }
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  },
};
```

```js filename=".storybook/test-runner.js" renderer="common" language="js"
module.exports = {
  getHttpHeaders: async (url) => {
    const token = url.includes('prod') ? 'XYZ' : 'ABC';
    return {
      Authorization: `Bearer ${token}`,
    };
  },
};
```

```js filename="./test-runner-jest.config.js" renderer="common" language="js"
import { getJestConfig } from '@storybook/test-runner';

const defaultConfig = getJestConfig();

const config = {
  ...defaultConfig,
  snapshotSerializers: [
    // Sets up the custom serializer to preprocess the HTML before it's passed onto the test-runner
    './snapshot-serializer.js',
    ...defaultConfig.snapshotSerializers,
  ],
};

export default config;
```

```js filename="./test-runner-jest.config.js" renderer="common" language="js"
import { getJestConfig } from '@storybook/test-runner';

const defaultConfig = getJestConfig();

const config = {
  // The default Jest configuration comes from @storybook/test-runner
  ...defaultConfig,
  snapshotResolver: './snapshot-resolver.js',
};

export default config;
```

```js filename=".storybook/test-runner.js" renderer="common" language="js"
const { getStoryContext } = require('@storybook/test-runner');
const { MINIMAL_VIEWPORTS } = require('@storybook/addon-viewport');

const DEFAULT_VIEWPORT_SIZE = { width: 1280, height: 720 };

module.exports = {
  async preVisit(page, story) {
    // Accesses the story's parameters and retrieves the viewport used to render it
    const context = await getStoryContext(page, story);
    const viewportName = context.parameters?.viewport?.defaultViewport;
    const viewportParameter = MINIMAL_VIEWPORTS[viewportName];

    if (viewportParameter) {
      const viewportSize = Object.entries(viewportParameter.styles).reduce(
        (acc, [screen, size]) => ({
          ...acc,
          // Converts the viewport size from percentages to numbers
          [screen]: parseInt(size),
        }),
        {},
      );
      // Configures the Playwright page to use the viewport size
      page.setViewportSize(viewportSize);
    } else {
      page.setViewportSize(DEFAULT_VIEWPORT_SIZE);
    }
  },
};
```

```js filename="./snapshot-resolver.js" renderer="common" language="js"
import path from 'path';

export default {
  resolveSnapshotPath: (testPath) => {
    const fileName = path.basename(testPath);
    const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    const modifiedFileName = `${fileNameWithoutExtension}.storyshot`;

    // Configure Jest to generate snapshot files using the following naming convention (__snapshots__/Button.storyshot)
    return path.join(path.dirname(testPath), '__snapshots__', modifiedFileName);
  },
  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    path.basename(snapshotFilePath, snapshotExtension),
  testPathForConsistencyCheck: 'example.storyshot',
};
```

```js filename="./snapshot-serializer.js" renderer="common" language="js"
// The jest-serializer-html package is available as a dependency of the test-runner
const jestSerializerHtml = require('jest-serializer-html');

const DYNAMIC_ID_PATTERN = /"react-aria-\d+(\.\d+)?"/g;

module.exports = {
  /*
   * The test-runner calls the serialize function when the test reaches the expect(SomeHTMLElement).toMatchSnapshot().
   * It will replace all dynamic IDs with a static ID so that the snapshot is consistent.
   * For instance, from <label id="react-aria970235672-:rl:" for="react-aria970235672-:rk:">Favorite color</label> to <label id="react-mocked_id" for="react-mocked_id">Favorite color</label>
   */
  serialize(val) {
    const withFixedIds = val.replace(DYNAMIC_ID_PATTERN, 'mocked_id');
    return jestSerializerHtml.print(withFixedIds);
  },
  test(val) {
    return jestSerializerHtml.test(val);
  },
};
```

```js filename=".storybook/test-runner.js" renderer="common" language="js"
module.exports = {
  async postVisit(page, context) {
    // the #storybook-root element wraps the story. In Storybook 6.x, the selector is #root
    const elementHandler = await page.$('#storybook-root');
    const innerHTML = await elementHandler.innerHTML();
    expect(innerHTML).toMatchSnapshot();
  },
};
```

```js filename=".storybook/test-runner.js" renderer="common" language="js"
const { getStoryContext, waitForPageReady } = require('@storybook/test-runner');

module.exports = {
  // Hook that is executed before the test runner starts running tests
  setup() {
    // Add your configuration here.
  },
  /* Hook to execute before a story is initially visited before being rendered in the browser.
   * The page argument is the Playwright's page object for the story.
   * The context argument is a Storybook object containing the story's id, title, and name.
   */
  async preVisit(page, context) {
    // Add your configuration here.
  },
  /* Hook to execute after a story is visited and fully rendered.
   * The page argument is the Playwright's page object for the story
   * The context argument is a Storybook object containing the story's id, title, and name.
   */
  async postVisit(page, context) {
    // Get the entire context of a story, including parameters, args, argTypes, etc.
    const storyContext = await getStoryContext(page, context);

    // This utility function is designed for image snapshot testing. It will wait for the page to be fully loaded, including all the async items (e.g., images, fonts, etc.).
    await waitForPageReady(page);

    // Add your configuration here.
  },
};
```

```js filename=".storybook/test-runner.js" renderer="common" language="js"
module.exports = {
  // Hook that is executed before the test runner starts running tests
  setup() {
    // Add your configuration here.
  },
  /* Hook to execute before a story is initially visited before being rendered in the browser.
   * The page argument is the Playwright's page object for the story.
   * The context argument is a Storybook object containing the story's id, title, and name.
   */
  async preVisit(page, context) {
    // Add your configuration here.
  },
  /* Hook to execute after a story is visited and fully rendered.
   * The page argument is the Playwright's page object for the story
   * The context argument is a Storybook object containing the story's id, title, and name.
   */
  async postVisit(page, context) {
    // Add your configuration here.
  },
};
```

```js filename=".storybook/test-runner.js" renderer="common" language="js"
const { waitForPageReady } = require('@storybook/test-runner');

const { toMatchImageSnapshot } = require('jest-image-snapshot');

const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

/** @type { import('@storybook/test-runner').TestRunnerConfig } */
module.exports = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    // Waits for the page to be ready before taking a screenshot to ensure consistent results
    await waitForPageReady(page);

    // To capture a screenshot for different browsers, add page.context().browser().browserType().name() to get the browser name to prefix the file name
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir,
      customSnapshotIdentifier: context.id,
    });
  },
};
```

```js filename="./snapshot-resolver.js" renderer="common" language="js"
import path from 'path';

export default {
  resolveSnapshotPath: (testPath) => {
    const fileName = path.basename(testPath);
    const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    // Defines the file extension for the snapshot file
    const modifiedFileName = `${fileNameWithoutExtension}.snap`;

    // Configure Jest to generate snapshot files using the following convention (./src/test/__snapshots__/Button.stories.snap)
    return path.join('./src/test/__snapshots__', modifiedFileName);
  },
  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    path.basename(snapshotFilePath, snapshotExtension),
  testPathForConsistencyCheck: 'example',
};
```

```js filename=".storybook/test-runner.js" renderer="common" language="js"
module.exports = {
  tags: {
    include: ['test-only', 'pages'],
    exclude: ['no-tests', 'tokens'],
    skip: ['skip-test', 'layout'],
  },
};
```

```js filename=".storybook/test-runner.js" renderer="common" language="js"
const { waitForPageReady } = require('@storybook/test-runner');

const { toMatchImageSnapshot } = require('jest-image-snapshot');

const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

module.exports = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    // Awaits for the page to be loaded and available including assets (e.g., fonts)
    await waitForPageReady(page);

    // Generates a snapshot file based on the story identifier
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir,
      customSnapshotIdentifier: context.id,
    });
  },
};
```

```js filename=".storybook/YourTheme.js" renderer="common" language="js"
import { create } from '@storybook/theming/create';

export default create({
  base: 'light',
  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  brandTitle: 'My custom Storybook',
  brandUrl: 'https://example.com',
  brandImage: 'https://storybook.js.org/images/placeholders/350x150.png',
  brandTarget: '_self',

  //
  colorPrimary: '#3A10E5',
  colorSecondary: '#585C6D',

  // UI
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#585C6D',
  appBorderRadius: 4,

  // Text colors
  textColor: '#10162F',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#9E9E9E',
  barSelectedColor: '#585C6D',
  barHoverColor: '#585C6D',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#10162F',
  inputTextColor: '#10162F',
  inputBorderRadius: 2,
});
```

```js filename="Button.stories.js" renderer="ember" language="js"
export default {
  component: 'button',
};
```

```js filename="ember-cli-build.js" renderer="ember" language="js"
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    '@storybook/ember-cli-storybook': {
      enableAddonDocsIntegration: true,
    },
  });

  return app.toTree();
};
```

```js filename=".storybook/preview.js" renderer="ember" language="js"
import { setJSONDoc } from '@storybook/addon-docs/ember';

import docJson from '../dist/storybook-docgen/index.json';
setJSONDoc(docJson);

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};
```

```js filename="Button.stories.js" renderer="html" language="js"
import { createButton } from './Button';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  decorators: [
    (story) => {
      const decorator = document.createElement('div');
      decorator.style.margin = '3em';
      decorator.appendChild(story());
      return decorator;
    },
  ],
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: (args) => createButton(args),
};
```

```js filename="Button.stories.js" renderer="html" language="js"
import { createButton } from './Button';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
};
```

```js filename="Button.stories.js" renderer="html" language="js"
import { createButton } from './Button';

export default {
  render: (args) => createButton(args),
};

export const Primary = {
  // 👇 Rename this story
  name: 'I am the primary',
  args: {
    label: 'Button',
    primary: true,
  },
};
```

```js filename="Button.stories.js" renderer="html" language="js"
import { createButton } from './Button';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: (args) => createButton(args),
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary = {
  render: (args) => createButton(args),
  args: {
    ...Primary.args,
    label: '😄👍😍💯',
  },
};

export const Tertiary = {
  render: (args) => createButton(args),
  args: {
    ...Primary.args,
    label: '📚📕📈🤓',
  },
};
```

```js filename="Button.stories.js" renderer="html" language="js"
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: (args) => {
    const btn = document.createElement('button');
    btn.innerText = args.label;

    const mode = args.primary ? 'storybook-button--primary' : 'storybook-button--secondary';
    btn.className = ['storybook-button', 'storybook-button--medium', mode].join(' ');

    return btn;
  },
  args: {
    primary: true,
    label: 'Button',
  },
};
```

```js filename="Button.stories.js" renderer="html" language="js"
import { createButton } from './Button';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: (args) => createButton({ backgroundColor: '#ff0', label: 'Button' }),
};

export const Secondary = {
  render: (args) => createButton({ backgroundColor: '#ff0', label: '😄👍😍💯' }),
};

export const Tertiary = {
  render: (args) => createButton({ backgroundColor: '#ff0', label: '📚📕📈🤓' }),
};
```

```js filename="Button.stories.js" renderer="html" language="js"
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: () => {
    const btn = document.createElement('button');
    btn.innerText = 'Button';

    btn.className = [
      'storybook-button',
      'storybook-button--medium',
      'storybook-button--primary',
    ].join(' ');

    return btn;
  },
};
```

```js filename="Histogram.stories.js" renderer="html" language="js"
import { createHistogram } from './Histogram';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Histogram',
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default = {
  render: (args) => createHistogram(args),
  args: {
    dataType: 'latency',
    showHistogramLabels: true,
    histogramAccentColor: '#1EA7FD',
    label: 'Latency distribution',
  },
};
```

```js filename="List.stories.js" renderer="html" language="js"
import { createList } from './List';
import { createListItem } from './ListItem';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Empty = {
  render: () => createList(args),
};

export const OneItem = {
  render: (args) => {
    const list = createList(args);
    list.appendChild(createListItem());
    return list;
  },
};

export const ManyItems = {
  render: (args) => {
    const list = createList(args);
    list.appendChild(createListItem());
    list.appendChild(createListItem());
    list.appendChild(createListItem());
    return list;
  },
};
```

```js filename="List.stories.js" renderer="html" language="js"
import { createList } from './List';
import { createListItem } from './ListItem';

// 👇 We're importing the necessary stories from ListItem
import { Selected, Unselected } from './ListItem.stories';

export default {
  title: 'List',
};

export const ManyItems = {
  render: (args) => {
    const list = createList(args);
    list.appendChild(createListItem(Selected.args));
    list.appendChild(createListItem(Unselected.args));
    list.appendChild(createListItem(Unselected.args));
    return list;
  },
};
```

```js filename="List.stories.js" renderer="html" language="js"
import { createList } from './List';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
};

// Always an empty list, not super interesting
export const Empty = {
  render: (args) => createList(args),
};
```

```js filename="YourComponent.stories.js" renderer="html" language="js"
import { createYourComponent } from './YourComponent';

// 👇 This default export determines where your story goes in the story list
export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'YourComponent',
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const FirstStory = {
  render: (args) => createYourComponent(args),
  args: {
    // 👇 The args you need here will depend on your component
  },
};
```

```js filename="Button.stories.js|jsx" renderer="preact" language="js"
import { Button } from './Button';

export default {
  component: Button,
};
```

```js filename="Button.stories.js|jsx" renderer="preact" language="js"
/** @jsx h */
import { h } from 'preact';

import { Button } from './Button';

export default {
  component: Button,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: (args) => <Button {...args} />,
  args: {
    primary: true,
    label: 'Button',
  },
};
```

```js filename="Button.stories.js|jsx" renderer="preact" language="js"
/** @jsx h */
import { h } from 'preact';

import { Button } from './Button';

export default {
  component: Button,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: () => <Button primary label="Button" />,
};
```

```js filename="MyComponent.stories.js|jsx" renderer="preact" language="js"
/** @jsx h */
import { h } from 'preact';

import { Layout } from './Layout';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

// This story uses a render function to fully control how the component renders.
export const Example = {
  render: () => (
    <Layout>
      <header>
        <h1>Example</h1>
      </header>
      <article>
        <MyComponent />
      </article>
    </Layout>
  ),
};
```

```js filename="Form.test.js" renderer="preact" language="js"
import '@testing-library/jest-dom/extend-expect';

import { h } from 'preact';

import { render, fireEvent } from '@testing-library/preact';

import { InvalidForm } from './LoginForm.stories'; //👈 Our stories imported here.

it('Checks if the form is valid', () => {
  const { getByTestId, getByText } = render(<InvalidForm {...InvalidForm.args} />);

  fireEvent.click(getByText('Submit'));

  const isFormValid = getByTestId('invalid-form');
  expect(isFormValid).toBeInTheDocument();
});
```

```js filename="Histogram.stories.js|jsx" renderer="preact" language="js"
/** @jsx h */
import { h } from 'preact';

import { Histogram } from './Histogram';

export default {
  component: Histogram,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default = {
  render: (args) => <Histogram {...args} />,
  args: {
    dataType: 'latency',
    showHistogramLabels: true,
    histogramAccentColor: '#1EA7FD',
    label: 'Latency distribution',
  },
};
```

```js filename="YourComponent.stories.js|jsx" renderer="preact" language="js"
/** @jsx h */
import { h } from 'preact';

import { YourComponent } from './YourComponent';

//👇 This default export determines where your story goes in the story list
export default {
  component: YourComponent,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const FirstStory = {
  render: (args) => <YourComponent {...args} />,
  args: {
    //👇 The args you need here will depend on your component
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="react" language="js"
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT, RESET_HIGHLIGHT } from '@storybook/addon-highlight';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

export const ResetHighlight = {
  decorators: [
    (storyFn) => {
      const emit = useChannel({});
      emit(RESET_HIGHLIGHT); //👈 Remove previously highlighted elements
      emit(HIGHLIGHT, {
        elements: ['header', 'section', 'footer'],
      });
      return storyFn();
    },
  ],
};
```

```js filename="Button.js|jsx" renderer="react" language="js"
import React from 'react';

import PropTypes from 'prop-types';

export function Button({ isDisabled, content }) {
  return (
    <button type="button" disabled={isDisabled}>
      {content}
    </button>
  );
}

Button.propTypes = {
  /**
   Checks if the button should be disabled
  */
  isDisabled: PropTypes.bool.isRequired,
  /**
  The display content of the button
  */
  content: PropTypes.string.isRequired,
};
```

```js filename="ButtonGroup.stories.js|jsx" renderer="react" language="js"
import { ButtonGroup } from '../ButtonGroup';

//👇 Imports the Button stories
import * as ButtonStories from './Button.stories';

export default {
  component: ButtonGroup,
};

export const Pair = {
  args: {
    buttons: [{ ...ButtonStories.Primary.args }, { ...ButtonStories.Secondary.args }],
    orientation: 'horizontal',
  },
};
```

```js filename="Button.js|jsx" renderer="react" language="js"
import React from 'react';

import PropTypes from 'prop-types';

/**
 * Primary UI component for user interaction
 */
export const Button = ({ primary, backgroundColor, size, label, ...props }) => {
  // the component implementation
};

Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import { action } from '@storybook/addon-actions';

import { Button } from './Button';

export default {
  component: Button,
};

export const Text = {
  args: {
    label: 'Hello',
    onClick: action('clicked'),
  },
  render: ({ label, onClick }) => <Button label={label} onClick={onClick} />,
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import { action } from '@storybook/addon-actions';

import { Button } from './Button';

export default {
  component: Button,
};

export const Text = {
  render: ({ label, onClick }) => <Button label={label} onClick={onClick} />,
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import { Button } from './Button';

export default {
  component: Button,
}

export const Text = {
  args: {...},
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import { action } from '@storybook/addon-actions';

import { Button } from './Button';

export default {
  component: Button,
};

export const Text = {
  render: () => <Button label="Hello" onClick={action('clicked')} />,
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import { Button } from './Button';

export default {
  component: Button,
  //👇 Creates specific argTypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: {
    //👇 Now all Button stories will be primary.
    primary: true,
  },
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import { Button } from './Button';

export default {
  component: Button,
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import { Button } from './Button';

export default {
  component: Button,
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  // 👇 Rename this story
  name: 'I am the primary',
  args: {
    label: 'Button',
    primary: true,
  },
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  args: {
    backgroundColor: '#ff0',
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    ...Primary.args,
    label: '😄👍😍💯',
  },
};

export const Tertiary = {
  args: {
    ...Primary.args,
    label: '📚📕📈🤓',
  },
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import React from 'react';

import { Button } from './Button';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  component: Button,
  //👇 Creates specific parameters for the story
  parameters: {
    myAddon: {
      data: 'This data is passed to the addon',
    },
  },
};

export const Basic = {
  render: () => <Button>Hello</Button>,
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  args: {
    label: 'Button',
    primary: true,
  },
};
```

```ts filename="Button.stories.js|jsx" renderer="react" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: () => <Button backgroundColor="#ff0" label="Button" />,
};

export const Secondary = {
  render: () => <Button backgroundColor="#ff0" label="😄👍😍💯" />,
};

export const Tertiary = {
  render: () => <Button backgroundColor="#ff0" label="📚📕📈🤓" />,
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import React from 'react';

import { Button } from './Button';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  component: Button,
  //👇 Creates specific parameters for the story
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
      ],
    },
  },
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Sample = {
  render: () => <Button label="hello button" />,
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: () => <Button primary label="Button" />,
};
```

```js filename="YourComponent.stories.js|jsx" renderer="react" language="js"
import { YourComponent } from './your-component';

export default {
  component: YourComponent,
  //👇 Creates specific argTypes with options
  argTypes: {
    propertyA: {
      options: ['Item One', 'Item Two', 'Item Three'],
      control: { type: 'select' }, // Automatically inferred when 'options' is defined
    },
    propertyB: {
      options: ['Another Item One', 'Another Item Two', 'Another Item Three'],
    },
  },
};

const someFunction = (valuePropertyA, valuePropertyB) => {
  // Do some logic here
};

export const ExampleStory = {
  render: (args) => {
    const { propertyA, propertyB } = args;
    //👇 Assigns the function result to a variable
    const someFunctionResult = someFunction(propertyA, propertyB);

    return <YourComponent {...args} someProperty={someFunctionResult} />;
  },
  args: {
    propertyA: 'Item One',
    propertyB: 'Another Item One',
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="react" language="js"
import { MyComponent } from './MyComponent';

// More on default export: https://storybook.js.org/docs/writing-stories/#default-export
export default {
  component: MyComponent,
};

export const Example = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Sample-File',
    },
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="react" language="js"
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT } from '@storybook/addon-highlight';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

export const Highlighted = {
  decorators: [
    (storyFn) => {
      const emit = useChannel({});
      emit(HIGHLIGHT, {
        elements: ['h2', 'a', '.storybook-button'],
      });
      return storyFn();
    },
  ],
};
```

```js filename="MyComponent.stories.js|jsx" renderer="react" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

export const WithAnImage = {
  render: () => (
    <img src="https://storybook.js.org/images/placeholders/350x150.png" alt="My CDN placeholder" />
  ),
};
```

```js filename="MyComponent.stories.js|jsx" renderer="react" language="js"
import { MyComponent } from './MyComponent';

import imageFile from './static/image.png';

export default {
  component: MyComponent,
};

const image = {
  src: imageFile,
  alt: 'my image',
};

export const WithAnImage = {
  render: () => <img src={image.src} alt={image.alt} />,
};
```

```js filename="MyComponent.stories.js|jsx" renderer="react" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

// Assume image.png is located in the "public" directory.
export const WithAnImage = {
  render: () => <img src="/image.png" alt="my image" />,
};
```

```js filename="Button.stories.js|jsx" renderer="react" language="js"
import { Button } from './Button';

export default {
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

// This is an accessible story
export const Accessible = {
  args: {
    primary: false,
    label: 'Button',
  },
};

// This is not
export const Inaccessible = {
  args: {
    ...Accessible.args,
    backgroundColor: 'red',
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="react" language="js"
import { Layout } from './Layout';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

// This story uses a render function to fully control how the component renders.
export const Example = {
  render: () => (
    <Layout>
      <header>
        <h1>Example</h1>
      </header>
      <article>
        <MyComponent />
      </article>
    </Layout>
  ),
};
```

```js filename="MyComponent.js|jsx" renderer="react" language="js"
const Component = styled.div(({ theme }) => ({
  background: theme.background.app,
  width: 0,
}));
```

```js filename="MyComponent.js|jsx" renderer="react" language="js"
const Component = styled.div`
  background: `${props => props.theme.background.app}`
  width: 0;
`;
```

```js filename="Form.test.js|jsx" renderer="react" language="js"
import { fireEvent, render, screen } from '@testing-library/react';

import { composeStory } from '@storybook/react';

import Meta, { InvalidForm as InvalidFormStory } from './LoginForm.stories'; //👈 Our stories imported here.

const FormError = composeStory(InvalidFormStory, Meta);

test('Checks if the form is valid', () => {
  render(<FormError />);

  const buttonElement = screen.getByRole('button', {
    name: 'Submit',
  });

  fireEvent.click(buttonElement);

  const isFormValid = screen.getByLabelText('invalid-form');
  expect(isFormValid).toBeInTheDocument();
});
```

```js filename="Button.stories.js" renderer="react" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

// Wrapped in light theme
export const Default = {};

// Wrapped in dark theme
export const Dark = {
  parameters: {
    theme: 'dark',
  },
};
```

```js filename="CSF 2" renderer="react" language="js"
import { Button } from './Button';

export default {
  title: 'Button',
  component: Button,
};

export const Primary = (args) => <Button {...args} />;
Primary.args = { primary: true };
```

```js filename="CSF 2" renderer="react" language="js"
// Other imports and story implementation
export const Default = (args) => <Button {...args} />;
```

```js filename="CSF 3 - explicit render function" renderer="react" language="js"
// Other imports and story implementation
export const Default = {
  render: (args) => <Button {...args} />,
};
```

```js filename=".storybook/preview.jsx" renderer="react" language="js"
import React from 'react';

export default {
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (Story, { parameters }) => {
      // 👇 Make it configurable by reading from parameters
      const { pageLayout } = parameters;
      switch (pageLayout) {
        case 'page':
          return (
            // Your page layout is probably a little more complex than this ;)
            <div className="page-layout"><Story /></div>
          );
        case 'page-mobile':
          return (
            <div className="page-mobile-layout"><Story /></div>
          );
        case default:
          // In the default case, don't apply a layout
          return <Story />;
      }
    },
  ],
};
```

```js filename="YourPage.js|jsx|mjs|ts|tsx" renderer="react" language="js"
import React, { useState, useEffect } from 'react';

import { PageLayout } from './PageLayout';
import { DocumentHeader } from './DocumentHeader';
import { DocumentList } from './DocumentList';

// Example hook to retrieve data from an external endpoint
function useFetchData() {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState([]);
  useEffect(() => {
    setStatus('loading');
    fetch('https://your-restful-endpoint')
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        setStatus('success');
        setData(data);
      })
      .catch(() => {
        setStatus('error');
      });
  }, []);
  return {
    status,
    data,
  };
}
export function DocumentScreen() {
  const { status, data } = useFetchData();

  const { user, document, subdocuments } = data;

  if (status === 'loading') {
    return <p>Loading...</p>;
  }
  if (status === 'error') {
    return <p>There was an error fetching the data!</p>;
  }
  return (
    <PageLayout user={user}>
      <DocumentHeader document={document} />
      <DocumentList documents={subdocuments} />
    </PageLayout>
  );
}
```

```js filename="YourPage.js|jsx" renderer="react" language="js"
import { useQuery, gql } from '@apollo/client';

import { PageLayout } from './PageLayout';
import { DocumentHeader } from './DocumentHeader';
import { DocumentList } from './DocumentList';

const AllInfoQuery = gql`
  query AllInfo {
    user {
      userID
      name
    }
    document {
      id
      userID
      title
      brief
      status
    }
    subdocuments {
      id
      userID
      title
      content
      status
    }
  }
`;

function useFetchInfo() {
  const { loading, error, data } = useQuery(AllInfoQuery);

  return { loading, error, data };
}

export function DocumentScreen() {
  const { loading, error, data } = useFetchInfo();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>There was an error fetching the data!</p>;
  }

  return (
    <PageLayout user={data.user}>
      <DocumentHeader document={data.document} />
      <DocumentList documents={data.subdocuments} />
    </PageLayout>
  );
}
```

```js filename="MyComponent.stories.js|jsx" renderer="react" language="js"
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT } from '@storybook/addon-highlight';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

export const StyledHighlight = {
  decorators: [
    (storyFn) => {
      const emit = useChannel({});
      emit(HIGHLIGHT, {
        elements: ['h2', 'a', '.storybook-button'],
        color: 'blue',
        style: 'double', // 'dotted' | 'dashed' | 'solid' | 'double'
      });
      return storyFn();
    },
  ],
};
```

```js filename="Histogram.stories.js|jsx" renderer="react" language="js"
import { Histogram } from './Histogram';

export default {
  component: Histogram,
};

export const Default = {
  args: {
    dataType: 'latency',
    showHistogramLabels: true,
    histogramAccentColor: '#1EA7FD',
    label: 'Latency distribution',
  },
};
```

```js filename="List.stories.js|jsx" renderer="react" language="js"
import { List } from './List';
import { ListItem } from './ListItem';

export default {
  component: List,
};

export const Empty = {};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const OneItem = {
  render: (args) => (
    <List {...args}>
      <ListItem />
    </List>
  ),
};

export const ManyItems = {
  render: (args) => (
    <List {...args}>
      <ListItem />
      <ListItem />
      <ListItem />
    </List>
  ),
};
```

```js filename="List.stories.js|jsx" renderer="react" language="js"
import React from 'react';

import { List } from './List';
import { ListItem } from './ListItem';

//👇 We're importing the necessary stories from ListItem
import { Selected, Unselected } from './ListItem.stories';

export default {
  component: List,
};

export const ManyItems = {
  render: (args) => (
    <List {...args}>
      <ListItem {...Selected.args} />
      <ListItem {...Unselected.args} />
      <ListItem {...Unselected.args} />
    </List>
  ),
};
```

```js filename="List.stories.js|jsx" renderer="react" language="js"
import { List } from './List';

export default {
  component: List,
};

// Always an empty list, not super interesting

export const Empty = {};
```

```js filename="List.stories.js|jsx" renderer="react" language="js"
import { List } from './List';
import { ListItem } from './ListItem';

//👇 Imports a specific story from ListItem stories
import { Unchecked } from './ListItem.stories';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
};

//👇 The ListTemplate construct will be spread to the existing stories.
const ListTemplate = {
  render: ({ items, ...args }) => {
    return (
      <List>
        {items.map((item) => (
          <ListItem {...item} />
        ))}
      </List>
    );
  },
};

export const Empty = {
  ...ListTemplate,
  args: {
    items: [],
  },
};

export const OneItem = {
  ...ListTemplate,
  args: {
    items: [
      {
        ...Unchecked.args,
      },
    ],
  },
};
```

```js filename="List.stories.js|jsx" renderer="react" language="js"
import { List } from './List';

//👇 Instead of importing ListItem, we import the stories
import { Unchecked } from './ListItem.stories';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
};

export const OneItem = {
  render: (args) => (
    <List {...args}>
      <Unchecked {...Unchecked.args} />
    </List>
  ),
};
```

```jsx filename="List.stories.js|jsx" renderer="react" language="js"
import React from 'react';

import { List } from './List';
import { ListItem } from './ListItem';

export default {
  component: List,
  subcomponents: { ListItem }, //👈 Adds the ListItem component as a subcomponent
};

export const Empty = {};

export const OneItem = {
  render: (args) => (
    <List {...args}>
      <ListItem />
    </List>
  ),
};
```

```js filename="List.stories.js|jsx" renderer="react" language="js"
import { List } from './List';

//👇 Instead of importing ListItem, we import the stories
import { Unchecked } from './ListItem.stories';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
};

export const OneItem = {
  args: {
    children: <Unchecked {...Unchecked.args} />,
  },
};
```

```js filename="TodoItem.stories.js|jsx" renderer="react" language="js"
import fetch from 'node-fetch';

import { TodoItem } from './TodoItem';

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export default {
  component: TodoItem,
  render: (args, { loaded: { todo } }) => <TodoItem {...args} {...todo} />,
};

export const Primary = {
  loaders: [
    async () => ({
      todo: await (await fetch('https://jsonplaceholder.typicode.com/todos/1')).json(),
    }),
  ],
};
```

```js filename="LoginForm.stories.js|jsx" renderer="react" language="js"
import { userEvent, within, expect } from '@storybook/test';

import { LoginForm } from './LoginForm';

export default {
  component: LoginForm,
};

export const EmptyForm = {};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 👇 Simulate interactions with the component
    await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');

    await userEvent.type(canvas.getByTestId('password'), 'a-random-password');

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button'));

    // 👇 Assert DOM structure
    await expect(
      canvas.getByText(
        'Everything is perfect. Your account is ready and we should probably get you started!',
      ),
    ).toBeInTheDocument();
  },
};
```

```js filename=".storybook/preview.js" renderer="react" language="js"
import React from 'react';

import { normal as NavigationNormal } from '../components/Navigation.stories';

import GlobalContainerContext from '../components/lib/GlobalContainerContext';

const context = {
  NavigationContainer: NavigationNormal,
};

const AppDecorator = (storyFn) => {
  return (
    <GlobalContainerContext.Provider value={context}>{storyFn()}</GlobalContainerContext.Provider>
  );
};

export default { decorators: [AppDecorator] };
```

```js filename="pages/profile.js|jsx" renderer="react" language="js"
import React from 'react';

import ProfilePageContext from './ProfilePageContext';
import { ProfilePageContainer } from './ProfilePageContainer';
import { UserPostsContainer } from './UserPostsContainer';
import { UserFriendsContainer } from './UserFriendsContainer';

//👇 Ensure that your context value remains referentially equal between each render.
const context = {
  UserPostsContainer,
  UserFriendsContainer,
};

export const AppProfilePage = () => {
  return (
    <ProfilePageContext.Provider value={context}>
      <ProfilePageContainer />
    </ProfilePageContext.Provider>
  );
};
```

```js filename="ProfilePage.stories.js|jsx" renderer="react" language="js"
import React from 'react';

import { ProfilePage } from './ProfilePage';
import { UserPosts } from './UserPosts';

//👇 Imports a specific story from a story file
import { Normal as UserFriendsNormal } from './UserFriends.stories';

export default {
  component: ProfilePage,
};

const ProfilePageProps = {
  name: 'Jimi Hendrix',
  userId: '1',
};

const context = {
  //👇 We can access the `userId` prop here if required:
  UserPostsContainer({ userId }) {
    return <UserPosts {...UserPostsProps} />;
  },
  // Most of the time we can simply pass in a story.
  // In this case we're passing in the `normal` story export
  // from the `UserFriends` component stories.
  UserFriendsContainer: UserFriendsNormal,
};

export const Normal = {
  render: () => (
    <ProfilePageContext.Provider value={context}>
      <ProfilePage {...ProfilePageProps} />
    </ProfilePageContext.Provider>
  ),
};
```

```js filename="ProfilePageContext.js|jsx" renderer="react" language="js"
import { createContext } from 'react';

const ProfilePageContext = createContext();

export default ProfilePageContext;
```

```js filename="ProfilePage.js|jsx" renderer="react" language="js"
import { useContext } from 'react';

import ProfilePageContext from './ProfilePageContext';

export const ProfilePage = ({ name, userId }) => {
  const { UserPostsContainer, UserFriendsContainer } = useContext(ProfilePageContext);

  return (
    <div>
      <h1>{name}</h1>
      <UserPostsContainer userId={userId} />
      <UserFriendsContainer userId={userId} />
    </div>
  );
};
```

```jsx filename=".storybook/preview.jsx" renderer="react" language="js"
import React from 'react';

import { ThemeProvider } from 'styled-components';

// themes = { light, dark }
import * as themes from '../src/themes';

export default {
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (Story, { parameters }) => {
      // 👇 Make it configurable by reading the theme value from parameters
      const { theme = 'light' } = parameters;
      return (
        <ThemeProvider theme={themes[theme]}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
};
```

```js filename="YourPage.stories.js|jsx" renderer="react" language="js"
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { graphql, HttpResponse, delay } from 'msw';

import { DocumentScreen } from './YourPage';

const mockedClient = new ApolloClient({
  uri: 'https://your-graphql-endpoint',
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

//👇The mocked data that will be used in the story
const TestData = {
  user: {
    userID: 1,
    name: 'Someone',
  },
  document: {
    id: 1,
    userID: 1,
    title: 'Something',
    brief: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'approved',
  },
  subdocuments: [
    {
      id: 1,
      userID: 1,
      title: 'Something',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'approved',
    },
  ],
};

export default {
  component: DocumentScreen,
  decorators: [
    (Story) => (
      <ApolloProvider client={mockedClient}>
        <Story />
      </ApolloProvider>
    ),
  ],
};

export const MockedSuccess = {
  parameters: {
    msw: {
      handlers: [
        graphql.query('AllInfoQuery', () => {
          return new HttpResponse.json({
            data: {
              allInfo: {
                ...TestData,
              },
            },
          });
        }),
      ],
    },
  },
};

export const MockedError = {
  parameters: {
    msw: {
      handlers: [
        graphql.query('AllInfoQuery', async () => {
          await delay(800);
          return new HttpResponse.json({
            errors: [
              {
                message: 'Access denied',
              },
            ],
          });
        }),
      ],
    },
  },
};
```

```js filename="Form.test.js|jsx" renderer="react" language="js"
import { fireEvent, render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/react';

import * as FormStories from './LoginForm.stories';

const { InvalidForm, ValidForm } = composeStories(FormStories);

test('Tests invalid form state', () => {
  render(<InvalidForm />);

  const buttonElement = screen.getByRole('button', {
    name: 'Submit',
  });

  fireEvent.click(buttonElement);

  const isFormValid = screen.getByLabelText('invalid-form');
  expect(isFormValid).toBeInTheDocument();
});

test('Tests filled form', () => {
  render(<ValidForm />);

  const buttonElement = screen.getByRole('button', {
    name: 'Submit',
  });

  fireEvent.click(buttonElement);

  const isFormValid = screen.getByLabelText('invalid-form');
  expect(isFormValid).not.toBeInTheDocument();
});
```

```js filename="MyComponent.stories.js|jsx" renderer="react" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

export const Basic = {};

export const WithProp = {
  render: () => <MyComponent prop="value" />,
};
```

```js filename="MyComponent.stories.js|jsx" renderer="react" language="js"
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  parameters: {
    //👇 The viewports object from the Essentials addon
    viewport: {
      //👇 The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
      //👇 Your own default viewport
      defaultViewport: 'iphone6',
    },
  },
};

export const MyStory = {
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="react" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

const getCaptionForLocale = (locale) => {
  switch (locale) {
    case 'es':
      return 'Hola!';
    case 'fr':
      return 'Bonjour!';
    case 'kr':
      return '안녕하세요!';
    case 'zh':
      return '你好!';
    default:
      return 'Hello!';
  }
};

export const StoryWithLocale = {
  render: (args, { globals: { locale } }) => {
    const caption = getCaptionForLocale(locale);
    return <p>{caption}</p>;
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="react" language="js"
import { MyComponent } from './MyComponent';

import someData from './data.json';

export default {
  component: MyComponent,
  includeStories: ['SimpleStory', 'ComplexStory'], // 👈 Storybook loads these stories
  excludeStories: /.*Data$/, // 👈 Storybook ignores anything that contains Data
};

export const simpleData = { foo: 1, bar: 'baz' };
export const complexData = { foo: 1, foobar: { bar: 'baz', baz: someData } };

export const SimpleStory = {
  args: {
    data: simpleData,
  },
};

export const ComplexStory = {
  args: {
    data: complexData,
  },
};
```

```js filename=".storybook/main.js" renderer="react" language="js"
export default {
  // ...
  // framework: '@storybook/react-webpack5', 👈 Remove this
  framework: '@storybook/nextjs', // 👈 Add this
};
```

```js filename="NavigationBasedComponent.stories.js" renderer="react" language="js"
import NavigationBasedComponent from './NavigationBasedComponent';

export default {
  component: NavigationBasedComponent,
  parameters: {
    nextjs: {
      appDirectory: true, // 👈 Set this
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="react" language="js"
export default {
  // ...
  parameters: {
    // ...
    nextjs: {
      appDirectory: true,
    },
  },
};
```

```js filename="MyForm.stories.js" renderer="react" language="js"
import { expect, userEvent, within } from '@storybook/test';
import { revalidatePath } from '@storybook/nextjs/cache.mock';

import MyForm from './my-form';

export default {
  component: MyForm,
};

export const Submitted = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    const submitButton = canvas.getByRole('button', { name: /submit/i });
    await userEvent.click(saveButton);
    // 👇 Use any mock assertions on the function
    await expect(revalidatePath).toHaveBeenCalledWith('/');
  },
};
```

```js filename=".storybook/main.js" renderer="react" language="js"
export default {
  // ...
  webpackFinal: async (config) => {
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // This modifies the existing image rule to exclude .svg files
    // since you want to handle those files with @svgr/webpack
    const imageRule = config.module.rules.find((rule) => rule?.['test']?.test('.svg'));
    if (imageRule) {
      imageRule['exclude'] = /\.svg$/;
    }

    // Configure .svg files to be loaded with @svgr/webpack
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
```

```js filename="MyForm.stories.js" renderer="react" language="js"
import { expect, userEvent, within } from '@storybook/test';
import { cookies, headers } from '@storybook/nextjs/headers.mock';

import MyForm from './my-form';

export default {
  component: MyForm,
};

export const LoggedInEurope = {
  async beforeEach() {
    // 👇 Set mock cookies and headers ahead of rendering
    cookies().set('username', 'Sol');
    headers().set('timezone', 'Central European Summer Time');
  },
  async play() {
    // 👇 Assert that your component called the mocks
    await expect(cookies().get).toHaveBeenCalledOnce();
    await expect(cookies().get).toHaveBeenCalledWith('username');
    await expect(headers().get).toHaveBeenCalledOnce();
    await expect(cookies().get).toHaveBeenCalledWith('timezone');
  },
};
```

```js filename=".storybook/main.js" renderer="react" language="js"
export default {
  // ...
  staticDirs: [
    {
      from: '../src/components/fonts',
      to: 'src/components/fonts',
    },
  ],
};
```

```js filename="MyForm.stories.js" renderer="react" language="js"
import { expect, fireEvent, userEvent, within } from '@storybook/test';
import { redirect, getRouter } from '@storybook/nextjs/navigation.mock';

import MyForm from './my-form';

export default {
  component: MyForm,
  parameters: {
    nextjs: {
      // 👇 As in the Next.js application, next/navigation only works using App Router
      appDirectory: true,
    },
  },
};

export const Unauthenticated = {
  async play() => {
    // 👇 Assert that your component called redirect()
    await expect(redirect).toHaveBeenCalledWith('/login', 'replace');
  },
};

export const GoBack = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const backBtn = await canvas.findByText('Go back');

    await userEvent.click(backBtn);
    // 👇 Assert that your component called back()
    await expect(getRouter().back).toHaveBeenCalled();
  },
};
```

```js filename="NavigationBasedComponent.stories.js" renderer="react" language="js"
import NavigationBasedComponent from './NavigationBasedComponent';

export default {
  component: NavigationBasedComponent,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

// If you have the actions addon,
// you can interact with the links and see the route change events there
export const Example = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/profile',
        query: {
          user: '1',
        },
      },
    },
  },
};
```

```js filename="NavigationBasedComponent.stories.js" renderer="react" language="js"
import NavigationBasedComponent from './NavigationBasedComponent';

export default {
  component: NavigationBasedComponent,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: [
          ['slug', 'hello'],
          ['framework', 'nextjs'],
        ],
      },
    },
  },
};
```

```js filename="NavigationBasedComponent.stories.js" renderer="react" language="js"
import NavigationBasedComponent from './NavigationBasedComponent';

export default {
  component: NavigationBasedComponent,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: ['dashboard', 'analytics'],
      },
    },
  },
};
```

```js filename=".storybook/main.js" renderer="react" language="js"
export default {
  // ...
  addons: [
    // ...
    // 👇 These can both be removed
    // 'storybook-addon-next',
    // 'storybook-addon-next-router',
  ],
};
```

```js filename="MyForm.stories.js" renderer="react" language="js"
import { expect, fireEvent, userEvent, within } from '@storybook/test';
// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { getRouter } from '@storybook/nextjs/router.mock';

import MyForm from './my-form';

export default {
  component: MyForm,
};

export const GoBack = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const backBtn = await canvas.findByText('Go back');

    await userEvent.click(backBtn);
    // 👇 Assert that your component called back()
    await expect(getRouter().back).toHaveBeenCalled();
  },
};
```

```js filename="RouterBasedComponent.stories.js" renderer="react" language="js"
import RouterBasedComponent from './RouterBasedComponent';

export default {
  component: RouterBasedComponent,
};

// If you have the actions addon,
// you can interact with the links and see the route change events there
export const Example = {
  parameters: {
    nextjs: {
      router: {
        pathname: '/profile/[id]',
        asPath: '/profile/1',
        query: {
          id: '1',
        },
      },
    },
  },
};
```

```js filename="my-component/component.stories.js|jsx" renderer="react" language="js"
import { useArgs } from '@storybook/preview-api';
import { Checkbox } from './checkbox';

export default {
  title: 'Inputs/Checkbox',
  component: Checkbox,
};

export const Example = {
  args: {
    isChecked: false,
    label: 'Try Me!',
  },
  /**
   * 👇 To avoid linting issues, it is recommended to use a function with a capitalized name.
   * If you are not concerned with linting, you may use an arrow function.
   */
  render: function Render(args) {
    const [{ isChecked }, updateArgs] = useArgs();

    function onChange() {
      updateArgs({ isChecked: !isChecked });
    }

    return <Checkbox {...args} onChange={onChange} isChecked={isChecked} />;
  },
};
```

```js filename="Page.stories.js|jsx" renderer="react" language="js"
import { Page } from './Page';

export default {
  component: Page,
  render: ({ footer, ...args }) => (
    <Page {...args}>
      <footer>{footer}</footer>
    </Page>
  ),
};

export const CustomFooter = {
  args: {
    footer: 'Built with Storybook',
  },
};
```

```js filename="Page.stories.js|jsx" renderer="react" language="js"
import { Page } from './Page';

//👇 Imports all Header stories
import * as HeaderStories from './Header.stories';

export default {
  component: Page,
};

export const LoggedIn = {
  args: {
    ...HeaderStories.LoggedIn.args,
  },
};
```

```js filename=".storybook/main.js" renderer="react" language="js"
export default {
  // ...
  // framework: '@storybook/react-webpack5', 👈 Remove this
  framework: '@storybook/react-vite', // 👈 Add this
};
```

```js filename=".storybook/main.js" renderer="react" language="js"
export default {
  // ...
  framework: '@storybook/react-webpack5', // 👈 Add this
};
```

```js filename="Button.test.js|jsx" renderer="react" language="js"
import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/react';

import * as stories from './Button.stories';

const { Primary } = composeStories(stories);

test('reuses args from composed story', () => {
  render(<Primary />);

  const buttonElement = screen.getByRole('button');
  // Testing against values coming from the story itself! No need for duplication
  expect(buttonElement.textContent).toEqual(Primary.args.label);
});
```

```js filename=".storybook/main.js" renderer="react" language="js"
export default {
  // ...
  features: {
    experimentalRSC: true,
  },
};
```

```js filename="MyServerComponent.stories.js" renderer="react" language="js"
import MyServerComponent from './MyServerComponent';

export default {
  component: MyServerComponent,
  parameters: {
    react: { rsc: false },
  },
};
```

```js filename="YourPage.js|jsx" renderer="react" language="js"
import React from 'react';

import { PageLayout } from './PageLayout';
import { DocumentHeader } from './DocumentHeader';
import { DocumentList } from './DocumentList';

export function DocumentScreen({ user, document, subdocuments }) {
  return (
    <PageLayout user={user}>
      <DocumentHeader document={document} />
      <DocumentList documents={subdocuments} />
    </PageLayout>
  );
}
```

```js filename="Form.test.js|jsx" renderer="react" language="js"
import { fireEvent, render, screen } from '@testing-library/react';

import { composeStory } from '@storybook/react';

import Meta, { ValidForm as ValidFormStory } from './LoginForm.stories';

const FormOK = composeStory(ValidFormStory, Meta);

test('Validates form', () => {
  render(<FormOK />);

  const buttonElement = screen.getByRole('button', {
    name: 'Submit',
  });

  fireEvent.click(buttonElement);

  const isFormValid = screen.getByLabelText('invalid-form');
  expect(isFormValid).not.toBeInTheDocument();
});
```

```js filename="MyComponent.stories.js|jsx" renderer="react" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

export const NonA11yStory = {
  parameters: {
    a11y: {
      // This option disables all a11y checks on this story
      disable: true,
    },
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="react" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

export const ExampleStory = {
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          {
            // The autocomplete rule will not run based on the CSS selector provided
            id: 'autocomplete-valid',
            selector: '*:not([autocomplete="nope"])',
          },
          {
            // Setting the enabled option to false will disable checks for this particular rule on all stories.
            id: 'image-alt',
            enabled: false,
          },
        ],
      },
      options: {},
      manual: true,
    },
  },
};
```

```jsx filename=".storybook/preview.jsx" renderer="react" language="js"
import React from 'react';

export default {
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};
```

```jsx filename=".storybook/preview.js|jsx" renderer="react" language="js"
import { ThemeProvider } from 'styled-components';

import { MyThemes } from '../my-theme-folder/my-theme-file';

const preview = {
  decorators: [
    (Story, context) => {
      const theme = MyThemes[context.globals.theme];
      return (
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
```

```jsx filename=".storybook/preview.js" renderer="react" language="js"
import React from 'react';

import { ThemeProvider } from 'styled-components';

export default {
  decorators: [
    (Story) => (
      <ThemeProvider theme="default">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </ThemeProvider>
    ),
  ],
};
```

```js filename="setupFile.js|ts" renderer="react" language="js"
// Storybook's preview file location
import * as globalStorybookConfig from './.storybook/preview';

import { setProjectAnnotations } from '@storybook/react';

setProjectAnnotations(globalStorybookConfig);
```

```jsx filename="Button.stories.jsx" renderer="react" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Variant1 = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 1 },
};

export const Variant2 = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 2 },
};

// Etc...

export const Combo = {
  // 👇 This story should not be tested, but will appear in the sidebar and docs page
  tags: ['!test'],
  render: () => (
    <>
      <Button variant={1}>
      <Button variant={2}>
      {/* Etc... */}
    </>
  ),
};
```

```js filename="YourComponent.stories.js|jsx" renderer="react" language="js"
import { YourComponent } from './YourComponent';

export default {
  component: YourComponent,
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};
```

```js filename="YourComponent.stories.js|jsx" renderer="react" language="js"
import { YourComponent } from './YourComponent';

//👇 This default export determines where your story goes in the story list
export default {
  component: YourComponent,
};

export const FirstStory = {
  args: {
    //👇 The args you need here will depend on your component
  },
};
```

```js filename="ButtonGroup.stories.js|jsx" renderer="solid" language="js"
import { ButtonGroup } from '../ButtonGroup';

//👇 Imports the Button stories
import * as ButtonStories from './Button.stories';

export default {
  component: ButtonGroup,
};

export const Pair = {
  args: {
    buttons: [{ ...ButtonStories.Primary.args }, { ...ButtonStories.Secondary.args }],
    orientation: 'horizontal',
  },
};
```

```js filename="Button.stories.js|jsx" renderer="solid" language="js"
import { action } from '@storybook/addon-actions';

import { Button } from './Button';

export default {
  component: Button,
};

export const Text = {
  args: {
    label: 'Hello',
    onClick: action('clicked'),
  },
  render: ({ label, onClick }) => <Button label={label} onClick={onClick} />,
};
```

```js filename="Button.stories.js|jsx" renderer="solid" language="js"
import { Button } from './Button';

export default {
  component: Button,
}

export const Text = {
  args: {...},
};
```

```js filename="Button.stories.js|jsx" renderer="solid" language="js"
import { action } from '@storybook/addon-actions';

import { Button } from './Button';

export default {
  component: Button,
};

export const Text = {
  render: () => <Button label="Hello" onClick={action('clicked')} />,
};
```

```js filename="Button.stories.js|jsx" renderer="solid" language="js"
import { Button } from './Button';

export default {
  component: Button,
  //👇 Creates specific argTypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: {
    //👇 Now all Button stories will be primary.
    primary: true,
  },
};
```

```js filename="Button.stories.js|jsx" renderer="solid" language="js"
import { Button } from './Button';

export default {
  component: Button,
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
};
```

```js filename="Button.stories.js|jsx" renderer="solid" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
};
```

```js filename="Button.stories.js|jsx" renderer="solid" language="js"
import { Button } from './Button';

export default {
  component: Button,
};
```

```js filename="Button.stories.js|jsx" renderer="solid" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  // 👇 Rename this story
  name: 'I am the primary',
  args: {
    label: 'Button',
    primary: true,
  },
};
```

```js filename="Button.stories.js|jsx" renderer="solid" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  args: {
    backgroundColor: '#ff0',
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    ...Primary.args,
    label: '😄👍😍💯',
  },
};

export const Tertiary = {
  args: {
    ...Primary.args,
    label: '📚📕📈🤓',
  },
};
```

```js filename="Button.stories.js|jsx" renderer="solid" language="js"
import { Button } from './Button';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  component: Button,
  //👇 Creates specific parameters for the story
  parameters: {
    myAddon: {
      data: 'This data is passed to the addon',
    },
  },
};

export const Basic = {
  render: () => <Button>Hello</Button>,
};
```

```js filename="Button.stories.js|jsx" renderer="solid" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Primary = {
  args: {
    label: 'Button',
    primary: true,
  },
};
```

```ts filename="Button.stories.js|jsx" renderer="solid" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: () => <Button backgroundColor="#ff0" label="Button" />,
};

export const Secondary = {
  render: () => <Button backgroundColor="#ff0" label="😄👍😍💯" />,
};

export const Tertiary = {
  render: () => <Button backgroundColor="#ff0" label="📚📕📈🤓" />,
};
```

```js filename="Button.stories.js|jsx" renderer="solid" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Sample = {
  render: () => <Button label="hello button" />,
};
```

```js filename="Button.stories.js|jsx" renderer="solid" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: () => <Button primary label="Button" />,
};
```

```js filename="YourComponent.stories.js|jsx" renderer="solid" language="js"
import { createSignal, createEffect } from 'solid-js';
import { YourComponent } from './your-component';

export default {
  component: YourComponent,
  //👇 Creates specific argTypes with options
  argTypes: {
    propertyA: {
      options: ['Item One', 'Item Two', 'Item Three'],
      control: { type: 'select' }, // Automatically inferred when 'options' is defined
    },
    propertyB: {
      options: ['Another Item One', 'Another Item Two', 'Another Item Three'],
    },
  },
};

const someFunction = (valuePropertyA, valuePropertyB) => {
  // Do some logic here
};

export const ExampleStory = {
  render: (args) => {
    const [someFunctionResult, setSomeFunctionResult] = createSignal();

    //👇 Assigns the function result to a signal
    createEffect(() => {
      setSomeFunctionResult(someFunction(args.propertyA, args.propertyB));
    });

    return <YourComponent {...args} someProperty={someFunctionResult()} />;
  },
  args: {
    propertyA: 'Item One',
    propertyB: 'Another Item One',
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="solid" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

export const Example = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Sample-File',
    },
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="solid" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

export const WithAnImage = {
  render: () => (
    <img src="https://storybook.js.org/images/placeholders/350x150.png" alt="My CDN placeholder" />
  ),
};
```

```js filename="MyComponent.stories.js|jsx" renderer="solid" language="js"
import imageFile from './static/image.png';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

const image = {
  src: imageFile,
  alt: 'my image',
};

export const WithAnImage = {
  render: () => <img src={image.src} alt={image.alt} />,
};
```

```js filename="MyComponent.stories.js|jsx" renderer="solid" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

// Assume image.png is located in the "public" directory.
export const WithAnImage = {
  render: () => <img src="/image.png" alt="my image" />,
};
```

```js filename="Button.stories.js|jsx" renderer="solid" language="js"
import { Button } from './Button';

export default {
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

// This is an accessible story
export const Accessible = {
  args: {
    primary: false,
    label: 'Button',
  },
};

// This is not
export const Inaccessible = {
  args: {
    ...Accessible.args,
    backgroundColor: 'red',
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="solid" language="js"
import { Layout } from './Layout';

import { MyComponent } from './MyComponent';

export default {
  title: 'MyComponent',
  component: MyComponent,
};

// This story uses a render function to fully control how the component renders.
export const Example = {
  render: () => (
    <Layout>
      <header>
        <h1>Example</h1>
      </header>
      <article>
        <MyComponent />
      </article>
    </Layout>
  ),
};
```

```js filename="CSF 2" renderer="solid" language="js"
import { Button } from './Button';

export default {
  title: 'Button',
  component: Button,
};

export const Primary = (args) => <Button {...args} />;
Primary.args = { primary: true };
```

```js filename="CSF 2" renderer="solid" language="js"
// Other imports and story implementation
export const Default = (args) => <Button {...args} />;
```

```js filename="CSF 3 - explicit render function" renderer="solid" language="js"
// Other imports and story implementation
export const Default = {
  render: (args) => <Button {...args} />,
};
```

```jsx filename=".storybook/preview.jsx" renderer="solid" language="js"
export default {
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (Story, { parameters }) => {
      // 👇 Make it configurable by reading from parameters
      const { pageLayout } = parameters;
      switch (pageLayout) {
        case 'page':
          return (
            // Your page layout is probably a little more complex than this ;)
            <div className="page-layout"><Story /></div>
          );
        case 'page-mobile':
          return (
            <div className="page-mobile-layout"><Story /></div>
          );
        case default:
          // In the default case, don't apply a layout
          return <Story />;
      }
    },
  ],
};
```

```js filename="YourPage.js|jsx|mjs|ts|tsx" renderer="solid" language="js"
import { createSignal, Match, Switch } from 'solid-js';

import { PageLayout } from './PageLayout';
import { DocumentHeader } from './DocumentHeader';
import { DocumentList } from './DocumentList';

// Example hook to retrieve data from an external endpoint
function useFetchData() {
  const [status, setStatus] = createSignal('idle');
  const [data, setData] = createSignal([]);

  setStatus('loading');
  fetch('https://your-restful-endpoint')
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res;
    })
    .then((res) => res.json())
    .then((data) => {
      setStatus('success');
      setData(data);
    })
    .catch(() => {
      setStatus('error');
    });

  return {
    status,
    data,
  };
}
export function DocumentScreen() {
  const { status, data } = useFetchData();

  return (
    <Switch>
      <Match when={status() === 'loading'}>
        <p>Loading...</p>
      </Match>
      <Match when={status() === 'error'}>
        <p>There was an error fetching the data!</p>
      </Match>
      <Match when={user} keyed>
        <PageLayout user={data().user}>
          <DocumentHeader document={data().document} />
          <DocumentList documents={data().subdocuments} />
        </PageLayout>
      </Match>
    </Switch>
  );
}
```

```js filename="YourPage.js|jsx" renderer="solid" language="js"
import { Match, Switch } from 'solid-js';
import { createGraphQLClient, gql } from '@solid-primitives/graphql';

import { PageLayout } from './PageLayout';
import { DocumentHeader } from './DocumentHeader';
import { DocumentList } from './DocumentList';

const newQuery = createGraphQLClient('https://foobar.com/v1/api');
const AllInfoQuery = gql`
  query AllInfo {
    user {
      userID
      name
    }
    document {
      id
      userID
      title
      brief
      status
    }
    subdocuments {
      id
      userID
      title
      content
      status
    }
  }
`;

function useFetchInfo() {
  const [data] = newQuery(AllInfoQuery, { path: 'home' });
  return data;
}

export function DocumentScreen() {
  const data = useFetchInfo();

  return (
    <Switch>
      <Match when={data.loading}>
        <p>Loading...</p>
      </Match>
      <Match when={data.error}>
        <p>There was an error fetching the data!</p>
      </Match>
      <Match when={data()} keyed>
        {(data) => (
          <PageLayout user={data.user}>
            <DocumentHeader document={data.document} />
            <DocumentList documents={data.subdocuments} />
          </PageLayout>
        )}
      </Match>
    </Switch>
  );
}
```

```js filename="Histogram.stories.js|jsx" renderer="solid" language="js"
import { Histogram } from './Histogram';

export default {
  component: Histogram,
};

export const Default = {
  args: {
    dataType: 'latency',
    showHistogramLabels: true,
    histogramAccentColor: '#1EA7FD',
    label: 'Latency distribution',
  },
};
```

```js filename="List.stories.js|jsx" renderer="solid" language="js"
import { List } from './List';
import { ListItem } from './ListItem';

export default {
  component: List,
};

export const Empty = {};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const OneItem = {
  render: (args) => (
    <List {...args}>
      <ListItem />
    </List>
  ),
};

export const ManyItems = {
  render: (args) => (
    <List {...args}>
      <ListItem />
      <ListItem />
      <ListItem />
    </List>
  ),
};
```

```js filename="List.stories.js|jsx" renderer="solid" language="js"
import { List } from './List';
import { ListItem } from './ListItem';

//👇 We're importing the necessary stories from ListItem
import { Selected, Unselected } from './ListItem.stories';

export default {
  component: List,
};

export const ManyItems = {
  render: (args) => (
    <List {...args}>
      <ListItem {...Selected.args} />
      <ListItem {...Unselected.args} />
      <ListItem {...Unselected.args} />
    </List>
  ),
};
```

```js filename="List.stories.js|jsx" renderer="solid" language="js"
import { List } from './List';

export default {
  component: List,
};

// Always an empty list, not super interesting

export const Empty = {};
```

```js filename="List.stories.js|jsx" renderer="solid" language="js"
import { List } from './List';
import { ListItem } from './ListItem';

//👇 Imports a specific story from ListItem stories
import { Unchecked } from './ListItem.stories';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
};

//👇 The ListTemplate construct will be spread to the existing stories.
const ListTemplate = {
  render: ({ items, ...args }) => {
    return (
      <List>
        {items.map((item) => (
          <ListItem {...item} />
        ))}
      </List>
    );
  },
};

export const Empty = {
  ...ListTemplate,
  args: {
    items: [],
  },
};

export const OneItem = {
  ...ListTemplate,
  args: {
    items: [
      {
        ...Unchecked.args,
      },
    ],
  },
};
```

```js filename="List.stories.js|jsx" renderer="solid" language="js"
import { List } from './List';

//👇 Instead of importing ListItem, we import the stories
import { Unchecked } from './ListItem.stories';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
};

export const OneItem = {
  render: (args) => (
    <List {...args}>
      <Unchecked {...Unchecked.args} />
    </List>
  ),
};
```

```js filename="List.stories.js|jsx" renderer="solid" language="js"
import { List } from './List';
import { ListItem } from './ListItem';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
  subcomponents: { ListItem }, //👈 Adds the ListItem component as a subcomponent
};

export const Empty = {};

export const OneItem = {
  render: (args) => (
    <List {...args}>
      <ListItem />
    </List>
  ),
};
```

```js filename="List.stories.js|jsx" renderer="solid" language="js"
import { List } from './List';

//👇 Instead of importing ListItem, we import the stories
import { Unchecked } from './ListItem.stories';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
};

export const OneItem = {
  args: {
    children: <Unchecked {...Unchecked.args} />,
  },
};
```

```js filename="TodoItem.stories.js|jsx" renderer="solid" language="js"
import { TodoItem } from './TodoItem';

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export default {
  component: TodoItem,
  render: (args, { loaded: { todo } }) => <TodoItem {...args} {...todo} />,
};

export const Primary = {
  loaders: [
    async () => ({
      todo: await (await fetch('https://jsonplaceholder.typicode.com/todos/1')).json(),
    }),
  ],
};
```

```js filename="LoginForm.stories.js|jsx" renderer="solid" language="js"
import { userEvent, within, expect } from '@storybook/test';

import { LoginForm } from './LoginForm';

export default {
  component: LoginForm,
};

export const EmptyForm = {};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 👇 Simulate interactions with the component
    await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');

    await userEvent.type(canvas.getByTestId('password'), 'a-random-password');

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button'));

    // 👇 Assert DOM structure
    await expect(
      canvas.getByText(
        'Everything is perfect. Your account is ready and we should probably get you started!',
      ),
    ).toBeInTheDocument();
  },
};
```

```js filename=".storybook/preview.js" renderer="solid" language="js"
import { normal as NavigationNormal } from '../components/Navigation.stories';

import GlobalContainerContext from '../components/lib/GlobalContainerContext';

const context = {
  NavigationContainer: NavigationNormal,
};

const AppDecorator = (storyFn) => {
  return (
    <GlobalContainerContext.Provider value={context}>{storyFn()}</GlobalContainerContext.Provider>
  );
};
export const decorators = [AppDecorator];
```

```js filename="pages/profile.js|jsx" renderer="solid" language="js"
import ProfilePageContext from './ProfilePageContext';
import { ProfilePageContainer } from './ProfilePageContainer';
import { UserPostsContainer } from './UserPostsContainer';
import { UserFriendsContainer } from './UserFriendsContainer';

//👇 Ensure that your context value remains referentially equal between each render.
const context = {
  UserPostsContainer,
  UserFriendsContainer,
};

export const AppProfilePage = () => {
  return (
    <ProfilePageContext.Provider value={context}>
      <ProfilePageContainer />
    </ProfilePageContext.Provider>
  );
};
```

```js filename="ProfilePage.stories.js|jsx" renderer="solid" language="js"
import { ProfilePage } from './ProfilePage';
import { UserPosts } from './UserPosts';

//👇 Imports a specific story from a story file
import { Normal as UserFriendsNormal } from './UserFriends.stories';

export default {
  component: ProfilePage,
};

const ProfilePageProps = {
  name: 'Jimi Hendrix',
  userId: '1',
};

const context = {
  //👇 We can access the `userId` prop here if required:
  UserPostsContainer({ userId }) {
    return <UserPosts {...UserPostsProps} />;
  },
  // Most of the time we can simply pass in a story.
  // In this case we're passing in the `normal` story export
  // from the `UserFriends` component stories.
  UserFriendsContainer: UserFriendsNormal,
};

export const Normal = {
  render: () => (
    <ProfilePageContext.Provider value={context}>
      <ProfilePage {...ProfilePageProps} />
    </ProfilePageContext.Provider>
  ),
};
```

```js filename="ProfilePageContext.js|jsx" renderer="solid" language="js"
import { createContext } from 'solid-js';

const ProfilePageContext = createContext();

export default ProfilePageContext;
```

```js filename="ProfilePage.js|jsx" renderer="solid" language="js"
import { useContext } from 'solid-js';

import ProfilePageContext from './ProfilePageContext';

export const ProfilePage = (props) => {
  const { UserPostsContainer, UserFriendsContainer } = useContext(ProfilePageContext);

  return (
    <div>
      <h1>{props.name}</h1>
      <UserPostsContainer userId={props.userId} />
      <UserFriendsContainer userId={props.userId} />
    </div>
  );
};
```

```js filename="MyComponent.story.js|jsx" renderer="solid" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

export const Basic = {};

export const WithProp = {
  render: () => <MyComponent prop="value" />,
};
```

```js filename="MyComponent.stories.js|jsx" renderer="solid" language="js"
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
  parameters: {
    //👇 The viewports object from the Essentials addon
    viewport: {
      //👇 The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
      //👇 Your own default viewport
      defaultViewport: 'iphone6',
    },
  },
};

export const MyStory = {
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="solid" language="js"
import { MyComponent } from './MyComponent';

export default {
  component: MyComponent,
};

const getCaptionForLocale = (locale) => {
  switch (locale) {
    case 'es':
      return 'Hola!';
    case 'fr':
      return 'Bonjour!';
    case 'kr':
      return '안녕하세요!';
    case 'zh':
      return '你好!';
    default:
      return 'Hello!';
  }
};

export const StoryWithLocale = {
  render: (args, { globals: { locale } }) => {
    const caption = getCaptionForLocale(locale);
    return <p>{caption}</p>;
  },
};
```

```js filename="MyComponent.stories.js|jsx" renderer="solid" language="js"
import { MyComponent } from './MyComponent';

import someData from './data.json';

export default {
  component: MyComponent,
  includeStories: ['SimpleStory', 'ComplexStory'], // 👈 Storybook loads these stories
  excludeStories: /.*Data$/, // 👈 Storybook ignores anything that contains Data
};

export const simpleData = { foo: 1, bar: 'baz' };
export const complexData = { foo: 1, foobar: { bar: 'baz', baz: someData } };

export const SimpleStory = {
  args: {
    data: simpleData,
  },
};

export const ComplexStory = {
  args: {
    data: complexData,
  },
};
```

```js filename="Page.stories.js|jsx" renderer="solid" language="js"
import { Page } from './Page';

export default {
  component: Page,
  render: ({ footer, ...args }) => (
    <Page {...args}>
      <footer>{footer}</footer>
    </Page>
  ),
};

export const CustomFooter = {
  args: {
    footer: 'Built with Storybook',
  },
};
```

```js filename="Page.stories.js|jsx" renderer="solid" language="js"
import { Page } from './Page';

//👇 Imports all Header stories
import * as HeaderStories from './Header.stories';

export default {
  component: Page,
};

export const LoggedIn = {
  args: {
    ...HeaderStories.LoggedIn.args,
  },
};
```

```js filename="YourPage.js|jsx" renderer="solid" language="js"
import { PageLayout } from './PageLayout';
import { DocumentHeader } from './DocumentHeader';
import { DocumentList } from './DocumentList';

export function DocumentScreen({ user, document, subdocuments }) {
  return (
    <PageLayout user={user}>
      <DocumentHeader document={document} />
      <DocumentList documents={subdocuments} />
    </PageLayout>
  );
}
```

```jsx filename=".storybook/preview.js" renderer="solid" language="js"
export default {
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
};
```

```js filename=".storybook/preview.js" renderer="solid" language="js"
import { ThemeProvider } from 'solid-styled-components';

const theme = {
  colors: {
    primary: 'hotpink',
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
];
```

```jsx filename="Button.stories.jsx" renderer="solid" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Variant1 = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 1 },
};

export const Variant2 = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 2 },
};

// Etc...

export const Combo = {
  // 👇 This story should not be tested, but will appear in the sidebar and docs page
  tags: ['!test'],
  render: () => (
    <>
      <Button variant={1}>
      <Button variant={2}>
      {/* Etc... */}
    </>
  ),
};
```

```js filename="YourComponent.stories.js|jsx" renderer="solid" language="js"
import { YourComponent } from './YourComponent';

export default {
  component: YourComponent,
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
};
```

```js filename="YourComponent.stories.js|jsx" renderer="solid" language="js"
import { YourComponent } from './YourComponent';

//👇 This default export determines where your story goes in the story list
export default {
  component: YourComponent,
};

export const FirstStory = {
  args: {
    //👇 The args you need here will depend on your component
  },
};
```

```html filename="Button.svelte" renderer="svelte" language="js"
<script>
  /**
   * A Button Component
   * @component
   */

  /**
   * Disable the button
   * @required
   */
  export let disabled = false;

  /**
   * Button content
   * @required
   */
  export let content = '';
<script/>

<button type="button" {disabled}>{content}</button>
```

```js filename="ButtonGroup.stories.js" renderer="svelte" language="js"
import ButtonGroup from '../ButtonGroup.svelte';

//👇 Imports the Button stories
import * as ButtonStories from './Button.stories';

export default {
  component: ButtonGroup,
};

export const Pair = {
  args: {
    buttons: [{ ...ButtonStories.Primary.args }, { ...ButtonStories.Secondary.args }],
    orientation: 'horizontal',
  },
};
```

```html renderer="svelte" language="js"
{/* Button.svelte */}

<script>
  import { createEventDispatcher } from 'svelte';
  /**
   * Is this the principal call to action on the page?
   */
  export let primary = false;

  /**
   * What background color to use
   */
  export let backgroundColor = undefined;
  /**
   * How large should the button be?
   */
  export let size = 'medium';
  /**
   * Button contents
   */
  export let label = '';

  $: style = backgroundColor ? `background-color: ${backgroundColor}` : '';

  const dispatch = createEventDispatcher();

  /**
   * Optional click handler
   */
  export let onClick = (event) => {
    dispatch('click', event);
  };
</script>

<button type="button" {style} on:click="{onClick}">{label}</button>
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import Button from './Button.svelte';

import { action } from '@storybook/addon-actions';

export default {
  component: Button,
};

export const Text = {
  render: ({ label, click }) => ({
    Component: Button,
    props: {
      label,
    },
    on: {
      click,
    },
  }),
  args: {
    label: 'Hello',
    click: action('clicked'),
  },
};
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import Button from './Button.svelte';

export default {
  component: Button,
};

export const Text = {
  args: {...},
};
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import { action } from '@storybook/addon-actions';

import Button from './Button.svelte';

export default {
  component: Button,
};

export const Text = {
  render: () => ({
    Component: Button,
    props: {
      label: 'Hello',
    },
    on: {
      click: action('clicked'),
    },
  }),
};
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import Button from './Button.svelte';

export default {
  component: Button,
  //👇 Creates specific argTypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: {
    //👇 Now all Button stories will be primary.
    primary: true,
  },
};
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import Button from './Button.svelte';
import MarginDecorator from './MarginDecorator.svelte';

export default {
  component: Button,
  decorators: [() => MarginDecorator],
};
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import Button from './Button.svelte';
import MarginDecorator from './MarginDecorator.svelte';

export default {
  component: Button,
};

export const Primary = {
  decorators: [() => MarginDecorator],
};
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import Button from './Button.svelte';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  component: Button,
  //👇 Creates specific argTypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

//👇 Some function to demonstrate the behavior
const someFunction = (someValue) => {
  return `i am a ${someValue}`;
};

export const ExampleStory = (args) => {
  //👇 Destructure the label from the args object
  const { label } = args;

  //👇 Assigns the function result to a variable and pass it as a prop into the component
  const functionResult = someFunction(label);
  return {
    Component: Button,
    props: {
      ...args,
      label: functionResult,
    },
  };
};
ExampleStory.args = {
  primary: true,
  size: 'small',
  label: 'button',
};
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import Button from './Button.svelte';

export default {
  component: Button,
};
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import Button from './Button.svelte';

export default {
  component: Button,
};

export const Primary = ({
  // 👇 Rename this story
  name: 'I am the primary',
  args: {
    label: 'Button',
    primary: true,
  },
};
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import Button from './Button.svelte';

export default {
  component: Button,
};

export const Primary = {
  args: {
    backgroundColor: '#ff0',
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    ...Primary.args,
    label: '😄👍😍💯',
  },
};

export const Tertiary = {
  args: {
    ...Primary.args,
    label: '📚📕📈🤓',
  },
};
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import Button from './Button.svelte';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  component: Button,
  //👇 Creates specific parameters for the story
  parameters: {
    myAddon: {
      data: 'this data is passed to the addon',
    },
  },
};

export const Basic = {};
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import Button from './Button.svelte';

export default {
  component: Button,
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import Button from './Button.svelte';

export default {
  component: Button,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: () => ({
    Component: Button,
    props: {
      backgroundColor: '#ff0',
      label: 'Button',
    },
  }),
};

export const Secondary = {
  render: () => ({
    Component: Button,
    props: {
      backgroundColor: '#ff0',
      label: '😄👍😍💯',
    },
  }),
};

export const Tertiary = {
  render: () => ({
    Component: Button,
    props: {
      backgroundColor: '#ff0',
      label: '📚📕📈🤓',
    },
  }),
};
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import Button from './Button.svelte';

export default {
  component: Button,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: () => ({
    Component: Button,
    props: {
      primary: true,
      label: 'Button',
    },
  }),
};
```

```js filename="YourComponent.stories.js" renderer="svelte" language="js"
import YourComponent from './YourComponent.svelte';

export default {
  component: YourComponent,
  //👇 Creates specific argTypes
  argTypes: {
    propertyA: {
      options: ['Item One', 'Item Two', 'Item Three'],
      control: { type: 'select' }, // Automatically inferred when 'options' is defined
    },
    propertyB: {
      options: ['Another Item One', 'Another Item Two', 'Another Item Three'],
    },
  },
};

const someFunction = (valuePropertyA, valuePropertyB) => {
  // Do some logic here
};

export const ExampleStory = {
  render: ({ propertyA, propertyB }) => {
    //👇 Assigns the function result to a variable
    const someFunctionResult = someFunction(propertyA, propertyB);
    return {
      Component: YourComponent,
      props: {
        ...args,
        someProperty: someFunctionResult,
      },
    };
  },
  args: {
    propertyA: 'Item One',
    propertyB: 'Another Item One',
  },
};
```

```js filename="MyComponent.stories.js" renderer="svelte" language="js"
import MyComponent from './MyComponent.svelte';

// More on default export: https://storybook.js.org/docs/writing-stories/#default-export
export default {
  component: MyComponent,
};

export const Example = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Sample-File',
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="svelte" language="js"
import MyComponent from './MyComponent.svelte';

export default {
  component: MyComponent,
};

export const WithAnImage = {
  render: () => ({
    Component: MyComponent,
    props: {
      src: 'https://storybook.js.org/images/placeholders/350x150.png',
      alt: 'My CDN placeholder',
    },
  }),
};
```

```js renderer="svelte" language="js"
//MyComponent.stories.js

import MyComponent from './MyComponent.svelte';

import imageFile from './static/image.png';

export default {
  component: MyComponent,
};

const image = {
  src: imageFile,
  alt: 'my image',
};

export const WithAnImage = {
  render: () => ({
    Component: MyComponent,
    props: image,
  }),
};
```

```js filename="MyComponent.stories.js" renderer="svelte" language="js"
import MyComponent from './MyComponent.svelte';

export default {
  component: MyComponent,
};

// Assume image.png is located in the "public" directory.
export const WithAnImage = {
  render: () => ({
    Component: MyComponent,
    props: {
      src: '/image.png',
      alt: 'my image',
    },
  }),
};
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import Button from './Button.svelte';

export default {
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

// This is an accessible story
export const Accessible = {
  render: (args) => ({
    Component: Button,
    props: args,
  }),
  args: {
    primary: false,
    label: 'Button',
  },
};

// This is not
export const Inaccessible = {
  render: (args) => ({
    Component: Button,
    props: args,
  }),
  args: {
    ...Accessible.args,
    backgroundColor: 'red',
  },
};
```

```js filename="Form.test.js|ts" renderer="svelte" language="js"
import { render, fireEvent } from '@testing-library/svelte';

import LoginForm from './LoginForm.svelte';

import { InvalidForm } from './LoginForm.stories'; //👈 Our stories imported here.

it('Checks if the form is valid', async () => {
  const { getByTestId, getByText } = render(LoginForm, {
    props: InvalidForm.args,
  });

  await fireEvent.click(getByText('Submit'));

  const isFormValid = getByTestId('invalid-form');
  expect(isFormValid).toBeInTheDocument();
});
```

```js filename="Button.stories.js" renderer="svelte" language="js"
import Button from './Button.svelte';

export default {
  title: 'Button',
  component: Button,
};

export const Primary = (args) => ({
  Component: Button,
  props: args,
});
Primary.args = { primary: true };
```

```js filename="CSF 2" renderer="svelte" language="js"
// Other imports and story implementation
export const Default = (args) => ({
  Component: Button,
  props: args,
});
```

```js filename="CSF 3 - explicit render function" renderer="svelte" language="js"
// Other imports and story implementation
export const Default = {
  render: (args) => ({
    Component: Button,
    props: args,
  });
};
```

```html renderer="svelte" language="js"
{/* YourPage.svelte */}

<script>
  import { onMount } from 'svelte';

  import PageLayout from './PageLayout.svelte';
  import DocumentHeader from './DocumentHeader.svelte';
  import DocumentList from './DocumentList.svelte';

  export let user = {};
  export let document = {};
  export let subdocuments = [];
  export let status = 'loading';

  onMount(async () => {
    await fetch('https://your-restful-endpoint')
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        user = data.user;
        status = 'success';
        document = data.document;
        subdocuments = data.subdocuments;
      })
      .catch(() => {
        status = 'error';
      });
  });
</script>

{#if status === "error"}
<p>There was an error fetching the data!</p>
{:else if status === "loading"}
<p>Loading...</p>
{:else}
<PageLayout {user}>
  <DocumentHeader {document} />
  <DocumentList documents="{subdocuments}" />
</PageLayout>
{/if}
```

```html renderer="svelte" language="js"
{/* YourPage.svelte */}

<script>
  import gql from 'graphql-tag';
  import { query } from 'svelte-apollo';
  import PageLayout from './PageLayout.svelte';
  import DocumentHeader from './DocumentHeader.svelte';
  import DocumentList from './DocumentList.svelte';

  const AllInfoQuery = gql`
    query AllInfoQuery {
      user {
        userID
        name
      }
      document {
        id
        userID
        title
        brief
        status
      }
      subdocuments {
        id
        userID
        title
        content
        status
      }
    }
  `;
  const infoResult = query(AllInfoQuery);
</script>

{#if $infoResult.loading}
<p>Loading...</p>
{:else if $infoResult.error}
<p>There was an error fetching the data!</p>
{:else}
<PageLayout {$infoResult.data.user}>
  <DocumentHeader {$infoResult.data.document} />
  <DocumentList {$infoResult.data.subdocuments} />
</PageLayout>
{/if}
```

```js filename="Histogram.stories.js" renderer="svelte" language="js"
import Histogram from './Histogram.svelte';

export default {
  component: Histogram,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default = {
  render: (args) => ({
    Component: Histogram,
    props: args,
  }),
  args: {
    dataType: 'latency',
    showHistogramLabels: true,
    histogramAccentColor: '#1EA7FD',
    label: 'Latency distribution',
  },
};
```

```js filename="TodoItem.stories.js" renderer="svelte" language="js"
import fetch from 'node-fetch';

import TodoItem from './TodoItem.svelte';

export default {
  component: TodoItem,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: (args, { loaded: { todo } }) => ({
    Component: TodoItem,
    props: {
      ...args,
      todo,
    },
  }),
  loaders: [
    async () => ({
      todo: await (await fetch('https://jsonplaceholder.typicode.com/todos/1')).json(),
    }),
  ],
};
```

```js filename="LoginForm.stories.js" renderer="svelte" language="js"
import { expect, userEvent, within } from '@storybook/test';

import LoginForm from './LoginForm.svelte';

export default {
  component: LoginForm,
};

export const EmptyForm = {};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 👇 Simulate interactions with the component
    await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');

    await userEvent.type(canvas.getByTestId('password'), 'a-random-password');

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button'));

    // 👇 Assert DOM structure
    await expect(
      canvas.getByText(
        'Everything is perfect. Your account is ready and we should probably get you started!',
      ),
    ).toBeInTheDocument();
  },
};
```

```js filename=".storybook/main.js" renderer="svelte" language="js"
export default {
  // Replace sveltekit with svelte-vite if you are not working with SvelteKit
  framework: '@storybook/sveltekit',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    // Other Storybook addons
    '@storybook/addon-svelte-csf', //👈 The Svelte CSF addon goes here
  ],
};
```

```js filename="YourPage.stories.js" renderer="svelte" language="js"
import { graphql, HttpResponse, delay } from 'msw';

import MockApolloWrapperClient from './MockApolloWrapperClient.svelte';
import DocumentScreen from './YourPage.svelte';

export default {
  component: DocumentScreen,
  decorators: [() => MockApolloWrapperClient],
};

//👇The mocked data that will be used in the story
const TestData = {
  user: {
    userID: 1,
    name: 'Someone',
  },
  document: {
    id: 1,
    userID: 1,
    title: 'Something',
    brief: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'approved',
  },
  subdocuments: [
    {
      id: 1,
      userID: 1,
      title: 'Something',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'approved',
    },
  ],
};

export const MockedSuccess = {
  parameters: {
    msw: {
      handlers: [
        graphql.query('AllInfoQuery', () => {
          return new HttpResponse.json({
            data: {
              allInfo: {
                ...TestData,
              },
            },
          });
        }),
      ],
    },
  },
};

export const MockedError = {
  parameters: {
    msw: {
      handlers: [
        graphql.query('AllInfoQuery', async () => {
          await delay(800);
          return new HttpResponse.json({
            errors: [
              {
                message: 'Access denied',
              },
            ],
          });
        }),
      ],
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="svelte" language="js"
import MyComponent from './MyComponent.svelte';

export default {
  component: MyComponent,
};

export const Basic = {};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const WithProp = {
  render: () => ({
    Component: MyComponent,
    props: {
      prop: 'value',
    },
  }),
};
```

```js filename="MyComponent.stories.js" renderer="svelte" language="js"
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import MyComponent from './MyComponent.svelte';

export default {
  component: MyComponent,
  parameters: {
    //👇 The viewports object from the Essentials addon
    viewport: {
      //👇 The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
      //👇 Your own default viewport
      defaultViewport: 'iphone6',
    },
  },
};

export const MyStory = {
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="svelte" language="js"
import MyComponent from './MyComponent.svelte';

export default {
  component: MyComponent,
};

const getCaptionForLocale = (locale) => {
  switch (locale) {
    case 'es':
      return 'Hola!';
    case 'fr':
      return 'Bonjour!';
    case 'kr':
      return '안녕하세요!';
    case 'zh':
      return '你好!';
    default:
      return 'Hello!';
  }
};

export const StoryWithLocale = {
  render: (args, { globals: { locale } }) => {
    const caption = getCaptionForLocale(locale);
    return {
      Component: MyComponent,
      props: {
        locale: caption,
      },
    };
  },
};
```

```js filename="MyComponent.stories.js" renderer="svelte" language="js"
import MyComponent from './MyComponent.svelte';

import someData from './data.json';

export default {
  component: MyComponent,
  includeStories: ['SimpleStory', 'ComplexStory'], // 👈 Storybook loads these stories
  excludeStories: /.*Data$/, // 👈 Storybook ignores anything that contains Data
};

export const simpleData = { foo: 1, bar: 'baz' };
export const complexData = { foo: 1, foobar: { bar: 'baz', baz: someData } };

export const SimpleStory = {
  args: {
    data: simpleData,
  },
};

export const ComplexStory = {
  args: {
    data: complexData,
  },
};
```

```js filename="Page.stories.js" renderer="svelte" language="js"
import Page from './Page.svelte';

//👇 Imports all Header stories
import * as HeaderStories from './Header.stories';

export default {
  component: Page,
};

export const LoggedIn = {
  args: {
    ...HeaderStories.LoggedIn.args,
  },
};
```

```html renderer="svelte" language="js"
{/* YourPage.svelte */}

<script>
  import PageLayout from './PageLayout.svelte';
  import DocumentHeader from './DocumentHeader.svelte';
  import DocumentList from './DocumentList.svelte';

  export let user = {};
  export let document = {};
  export let subdocuments = [];
</script>

<div>
  <PageLayout {user}>
    <DocumentHeader {document} />
    <DocumentList documents="{subdocuments}" />
  </PageLayout>
</div>
```

```js filename="MyComponent.stories.js" renderer="svelte" language="js"
import MyComponent from './MyComponent.svelte';

export default {
  component: MyComponent,
};

export const NonA11yStory = {
  parameters: {
    a11y: {
      // This option disables all a11y checks on this story
      disable: true,
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="svelte" language="js"
import MyComponent from './MyComponent.svelte';

export default {
  component: MyComponent,
};

export const ExampleStory = {
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          {
            // The autocomplete rule will not run based on the CSS selector provided
            id: 'autocomplete-valid',
            selector: '*:not([autocomplete="nope"])',
          },
          {
            // Setting the enabled option to false will disable checks for this particular rule on all stories.
            id: 'image-alt',
            enabled: false,
          },
        ],
      },
      options: {},
      manual: true,
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="svelte" language="js"
import MarginDecorator from './MarginDecorator.svelte';

export default { decorators: [() => MarginDecorator] };
```

```js filename=".storybook/main.js" renderer="svelte" language="js"
export default {
  // ...
  framework: '@storybook/svelte-vite', // 👈 Add this
};
```

```js filename=".storybook/main.js" renderer="svelte" language="js"
export default {
  // ...
  framework: '@storybook/svelte-webpack5', // 👈 Add this
};
```

```js filename=".storybook/main.js" renderer="svelte" language="js"
export default {
  // ...
  framework: '@storybook/sveltekit', // 👈 Add this
  // svelteOptions: { ... }, 👈 Remove this
};
```

```js filename="YourComponent.stories.js" renderer="svelte" language="js"
import YourComponent from './YourComponent.svelte';

import MarginDecorator from './MarginDecorator.svelte';

export default {
  component: YourComponent,
  decorators: [() => MarginDecorator],
};
```

```js filename="YourComponent.stories.js" renderer="svelte" language="js"
import YourComponent from './YourComponent.svelte';

//👇This default export determines where your story goes in the story list
export default {
  component: YourComponent,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const FirstStory = {
  render: (args) => ({
    Component: YourComponent,
    props: args,
  }),
  args: {
    //👇 The args you need here will depend on your component
  },
};
```

```js filename="MyComponent.stories.js" renderer="vue" language="js"
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT, RESET_HIGHLIGHT } from '@storybook/addon-highlight';

import MyComponent from './MyComponent.vue';

export default {
  component: MyComponent,
};

export const ResetHighlight = {
  decorators: [
    () => {
      const emit = useChannel({});
      emit(RESET_HIGHLIGHT); //👈 Remove previously highlighted elements
      emit(HIGHLIGHT, {
        elements: ['header', 'section', 'footer'],
      });
      return {
        template: '<story />',
      };
    },
  ],
};
```

```js filename="__tests__/Button.spec.js|ts" renderer="vue" language="js"
// @vitest-environment jsdom

import { expect, test } from 'vitest';

import { render } from '@testing-library/vue';

import { composeStories } from '@storybook/vue3';

import * as stories from '../stories/Button.stories';

const { Primary } = composeStories(stories);
test('Button snapshot', async () => {
  const mounted = render(Primary());
  expect(mounted.container).toMatchSnapshot();
});
```

```js filename="Button.stories.js" renderer="vue" language="js"
import Button from './Button.vue';

export default {
  component: Button,
  argTypes: {
    onClick: {},
  },
};

export const Text = {
  args: {},
};
```

```js filename="Button.stories.js" renderer="vue" language="js"
import Button from './Button.vue';

export default {
  component: Button,
  //👇 Creates specific argTypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: {
    //👇 Now all Button stories will be primary.
    primary: true,
  },
};
```

```js filename="Button.stories.js" renderer="vue" language="js"
import Button from './Button.vue';

export default {
  component: Button,
  decorators: [() => ({ template: '<div style="margin: 3em;"><story /></div>' })],
};
```

```js filename="Button.stories.js" renderer="vue" language="js"
import Button from './Button.vue';

export default {
  component: Button,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: () => ({
    components: { Button },
    template: '<Button primary label="Hello World" />',
  }),
  decorators: [() => ({ template: '<div style="margin: 3em;"><story /></div>' })],
};
```

```js filename="Button.stories.js" renderer="vue" language="js"
import Button from './Button.vue';

export default {
  component: Button,
};
```

```js filename="Button.stories.js" renderer="vue" language="js"
import Button from './Button.vue';

export default {
  component: Button,
};

export const Primary = {
  // 👇 Rename this story
  name: 'I am the primary',
  args: {
    label: 'Button',
    primary: true,
  },
};
```

```js filename="Button.stories.js" renderer="vue" language="js"
import Button from './Button.vue';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  component: Button,
  //👇 Creates specific parameters for the story
  parameters: {
    myAddon: {
      data: 'This data is passed to the addon',
    },
  },
};

export const Basic = {
  render: () => ({
    components: { Button },
    template: '<Button label="Hello" />',
  }),
};
```

```js filename="Button.stories.js" renderer="vue" language="js"
import Button from './Button.vue';

export default {
  component: Button,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: () => ({
    components: { Button },
    template: '<Button backgroundColor="#ff0" label="Button" />',
  }),
};

export const Secondary = {
  render: () => ({
    components: { Button },
    template: '<Button backgroundColor="#ff0" label="😄👍😍💯" />',
  }),
};

export const Tertiary = {
  render: () => ({
    components: { Button },
    template: '<Button backgroundColor="#ff0" label="📚📕📈🤓" />',
  }),
```

```js filename="Button.stories.js" renderer="vue" language="js"
import Button from './Button.vue';

export default {
  component: Button,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: () => ({
    components: { Button },
    template: '<Button primary label="Button" />',
  }),
};
```

```js filename="YourComponent.stories.js" renderer="vue" language="js"
import YourComponent from './YourComponent.vue';

export default {
  component: YourComponent,
  //👇 Creates specific argTypes with options
  argTypes: {
    propertyA: {
      options: ['Item One', 'Item Two', 'Item Three'],
      control: { type: 'select' }, // automatically inferred when 'options' is defined
    },
    propertyB: {
      options: ['Another Item One', 'Another Item Two', 'Another Item Three'],
    },
  },
};

const someFunction = (valuePropertyA, valuePropertyB) => {
  // Do some logic here
};

export const ExampleStory = {
  render: ({ args }) => {
    const { propertyA, propertyB } = args;
    //👇 Assigns the function result to a variable
    const functionResult = someFunction(propertyA, propertyB);
    return {
      components: { YourComponent },
      setup() {
        return {
          ...args,
          //👇 Replaces arg variable with the override (without the need of mutation)
          someProperty: functionResult,
        };
      },
      template:
        '<YourComponent :propertyA="propertyA" :propertyB="propertyB" :someProperty="someProperty"/>',
    };
  },
  args: {
    propertyA: 'Item One',
    propertyB: 'Another Item One',
  },
};
```

```js filename="MyComponent.stories.js" renderer="vue" language="js"
import MyComponent from './MyComponent.vue';

// More on default export: https://storybook.js.org/docs/writing-stories/#default-export
export default {
  component: MyComponent,
};

export const Example = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Sample-File',
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="vue" language="js"
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT } from '@storybook/addon-highlight';

import MyComponent from './MyComponent.vue';

export default {
  component: MyComponent,
};

export const Highlighted = {
  decorators: [
    () => {
      const emit = useChannel({});
      emit(HIGHLIGHT, {
        elements: ['h2', 'a', '.storybook-button'],
      });
      return {
        template: '<story />',
      };
    },
  ],
};
```

```js filename="MyComponent.stories.js" renderer="vue" language="js"
import MyComponent from './MyComponent.vue';

export default {
  component: MyComponent,
};

export const WithAnImage = {
  render: () => ({
    template:
      '<img src="https://storybook.js.org/images/placeholders/350x150.png" alt="My CDN placeholder"/>',
  }),
};
```

```js filename="MyComponent.stories.js" renderer="vue" language="js"
import MyComponent from './MyComponent.vue';

export default {
  component: MyComponent,
};

// Assume image.png is located in the "public" directory.
export const WithAnImage = {
  render: () => ({
    template: '<img src="image.png" alt="my image" />',
  }),
};
```

```js filename="MyComponent.stories.js" renderer="vue" language="js"
import Layout from './Layout.vue';

import MyComponent from './MyComponent.vue';

export default {
  component: MyComponent,
};

// This story uses a render function to fully control how the component renders.
export const Example = {
  render: () => ({
    components: { Layout, MyComponent },
    template: `
      <Layout>
        <header>
          <h1>Example</h1>
        </header>
        <article>
          <MyComponent />
        </article>
      </Layout>
    `,
  }),
};
```

```js filename=".storybook/preview.js" renderer="vue" language="js"
export default {
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (_, { parameters }) => {
      // 👇 Make it configurable by reading from parameters
      const { pageLayout } = parameters;
      switch (pageLayout) {
        case 'page':
          // Your page layout is probably a little more complex than this ;)
          return { template: '<div class="page-layout"><story/></div>' };
        case 'page-mobile':
          return { template: '<div class="page-mobile-layout"><story/></div>' };
        case default:
          // In the default case, don't apply a layout
          return { template: '<story/>' };
      }
    },
  ],
};
```

```js filename="MyComponent.stories.js" renderer="vue" language="js"
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT } from '@storybook/addon-highlight';

import MyComponent from './MyComponent.vue';

export default {
  component: MyComponent,
};

export const StyledHighlight = {
  decorators: [
    () => {
      const emit = useChannel({});
      emit(HIGHLIGHT, {
        elements: ['h2', 'a', '.storybook-button'],
        color: 'blue',
        style: 'double', // 'dotted' | 'dashed' | 'solid' | 'double'
      });
      return {
        template: '<story />',
      };
    },
  ],
};
```

```js filename="List.stories.js" renderer="vue" language="js"
import List from './ListComponent.vue';
import ListItem from './ListItem.vue';

export default {
  component: List,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Empty = {
  render: () => ({
    components: { List },
    template: '<List/>',
  }),
};

export const OneItem = {
  render: () => ({
    components: { List, ListItem },
    template: `
      <List>
        <list-item/>
      </List>`,
  }),
};

export const ManyItems = {
  render: () => ({
    components: { List, ListItem },
    template: `
      <List>
        <list-item/>
        <list-item/>
        <list-item/>
      </List>`,
  }),
};
```

```js filename="List.stories.js" renderer="vue" language="js"
import List from './ListComponent.vue';

export default {
  component: List,
};

// Always an empty list, not super interesting
export const Empty = {
  render: () => ({
    components: { List },
    template: '<List/>',
  }),
};
```

```js filename="List.stories.js" renderer="vue" language="js"
import List from './List.vue';
import ListItem from './ListItem.vue';

export default {
  component: List,
  subcomponents: { ListItem }, //👈 Adds the ListItem component as a subcomponent
};

export const Empty = {
  render: () => ({
    components: { List },
    template: '<List/>',
  }),
};

export const OneItem = {
  render: (args) => ({
    components: { List, ListItem },
    setup() {
      return { args }
    }
    template: '<List v-bind="args"><ListItem /></List>',
  }),
};
```

```js filename="TodoItem.stories.js" renderer="vue" language="js"
import TodoItem from './TodoItem.vue';

import fetch from 'node-fetch';

export default {
  component: TodoItem,
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: (args, { loaded: { todo } }) => ({
    components: { TodoItem },
    setup() {
      return { args, todo: todo };
    },
    template: '<TodoItem :todo="todo" />',
  }),
  loaders: [
    async () => ({
      todo: await (await fetch('https://jsonplaceholder.typicode.com/todos/1')).json(),
    }),
  ],
};
```

```js filename="LoginForm.stories.js" renderer="vue" language="js"
import { userEvent, within, expect } from '@storybook/test';

import LoginForm from './LoginForm.vue';

export default {
  component: LoginForm,
};

export const EmptyForm = {
  render: () => ({
    components: { LoginForm },
    template: `<LoginForm />`,
  }),
};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm = {
  render: () => ({
    components: { LoginForm },
    template: `<LoginForm />`,
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 👇 Simulate interactions with the component
    await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');

    await userEvent.type(canvas.getByTestId('password'), 'a-random-password');

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button'));

    // 👇 Assert DOM structure
    await expect(
      canvas.getByText(
        'Everything is perfect. Your account is ready and we should probably get you started!',
      ),
    ).toBeInTheDocument();
  },
};
```

```js filename="YourPage.stories.js" renderer="vue" language="js"
import { graphql, HttpResponse, delay } from 'msw';

import WrapperComponent from './ApolloWrapperClient.vue';
import DocumentScreen from './YourPage.vue';

export default {
  component: DocumentScreen,
  render: () => ({
    components: { DocumentScreen, WrapperComponent },
    template: '<WrapperComponent><DocumentScreen /></WrapperComponent>',
  }),
};

//👇The mocked data that will be used in the story
const TestData = {
  user: {
    userID: 1,
    name: 'Someone',
  },
  document: {
    id: 1,
    userID: 1,
    title: 'Something',
    brief: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'approved',
  },
  subdocuments: [
    {
      id: 1,
      userID: 1,
      title: 'Something',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'approved',
    },
  ],
};

export const MockedSuccess = {
  parameters: {
    msw: {
      handlers: [
        graphql.query('AllInfoQuery', () => {
          return new HttpResponse.json({
            data: {
              allInfo: {
                ...TestData,
              },
            },
          });
        }),
      ],
    },
  },
};

export const MockedError = {
  parameters: {
    msw: {
      handlers: [
        graphql.query('AllInfoQuery', async () => {
          await delay(800);
          return new HttpResponse.json({
            errors: [
              {
                message: 'Access denied',
              },
            ],
          });
        }),
      ],
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="vue" language="js"
import MyComponent from './MyComponent.vue';

export default {
  component: MyComponent,
};

export const Basic = {
  render: () => ({
    components: { MyComponent },
    template: '<MyComponent />',
  }),
};

export const WithProp = {
  render: () => ({
    components: { MyComponent },
    template: '<MyComponent prop="value"/>',
  }),
};
```

```js filename="MyComponent.stories.js" renderer="vue" language="js"
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import MyComponent from './MyComponent.vue';

export default {
  component: MyComponent,
  parameters: {
    //👇 The viewports object from the Essentials addon
    viewport: {
      //👇 The viewports you want to use
      viewports: INITIAL_VIEWPORTS,

      //👇 Your own default viewport
      defaultViewport: 'iphone6',
    },
  },
};

export const MyStory = {
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="vue" language="js"
import MyComponent from './MyComponent.vue';

export default {
  component: MyComponent,
};

const getCaptionForLocale = (locale) => {
  switch (locale) {
    case 'es':
      return 'Hola!';
    case 'fr':
      return 'Bonjour!';
    case 'kr':
      return '안녕하세요!';
    case 'zh':
      return '你好!';
    default:
      return 'Hello!';
  }
};

export const StoryWithLocale = {
  render: (args, { globals: { locale } }) => {
    const caption = getCaptionForLocale(locale);
    return {
      template: `<p>${caption}</p>`,
    };
  },
};
```

```js filename="MyComponent.stories.js" renderer="vue" language="js"
import MyComponent from './MyComponent.vue';

import someData from './data.json';

export default {
  component: MyComponent,
  includeStories: ['SimpleStory', 'ComplexStory'],
  excludeStories: /.*Data$/, // 👈 Storybook ignores anything that contains Data
};

export const simpleData = { foo: 1, bar: 'baz' };
export const complexData = { foo: 1, foobar: { bar: 'baz', baz: someData } };

export const SimpleStory = {
  args: {
    data: simpleData,
  },
};

export const ComplexStory = {
  args: {
    data: complexData,
  },
};
```

```js filename="MyComponent.stories.js" renderer="vue" language="js"
import MyComponent from './MyComponent.vue';

export default {
  component: MyComponent,
};

export const NonA11yStory = {
  parameters: {
    a11y: {
      // This option disables all a11y checks on this story
      disable: true,
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="vue" language="js"
import MyComponent from './MyComponent.vue';

export default {
  component: MyComponent,
};

export const ExampleStory = {
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          {
            // The autocomplete rule will not run based on the CSS selector provided
            id: 'autocomplete-valid',
            selector: '*:not([autocomplete="nope"])',
          },
          {
            // Setting the enabled option to false will disable checks for this particular rule on all stories.
            id: 'image-alt',
            enabled: false,
          },
        ],
      },
      options: {},
      manual: true,
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="vue" language="js"
export default {
  decorators: [
    (story) => ({
      components: { story },
      template: '<div style="margin: 3em;"><story /></div>',
    }),
  ],
};
```

```js filename="setupFile.js|ts" renderer="vue" language="js"
// Storybook's preview file location
import * as globalStorybookConfig from './.storybook/preview';

import { setProjectAnnotations } from '@storybook/vue3';

setProjectAnnotations(globalStorybookConfig);
```

```js filename="Button.stories.js" renderer="vue" language="js"
import { Button } from './Button';

export default {
  component: Button,
};

export const Variant1 = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 1 },
};

export const Variant2 = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 2 },
};

// Etc...

export const Combo = {
  // 👇 This story should not be tested, but will appear in the sidebar and docs page
  tags: ['!test'],
  render: () => ({
    components: { Button },
    template: `
      <div>
        <Button variant={1}>
        <Button variant={2}>
        {/* Etc... */}
      </div>
    `,
  }),
};
```

```js filename=".storybook/main.js" renderer="vue" language="js"
export default {
  // ...
  framework: '@storybook/vue3-vite', // 👈 Add this
};
```

```js filename=".storybook/main.js" renderer="vue" language="js"
export default {
  // ...
  framework: '@storybook/vue3-webpack5', // 👈 Add this
};
```

```js filename="YourComponent.stories.js" renderer="vue" language="js"
import YourComponent from './YourComponent.vue';

export default {
  component: YourComponent,
  decorators: [() => ({ template: '<div style="margin: 3em;"><story/></div>' })],
};
```

```ts filename="Button.stories.js" renderer="web-components" language="js"
import { action } from '@storybook/addon-actions';

export default {
  component: 'demo-button',
  args: {
    // 👇 Create an action that appears when the onClick event is fired
    onClick: action('on-click'),
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT, RESET_HIGHLIGHT } from '@storybook/addon-highlight';

export default {
  component: 'my-component',
};

export const ResetHighlight = {
  decorators: [
    (story) => {
      const emit = useChannel({});
      emit(RESET_HIGHLIGHT); //👈 Remove previously highlighted elements
      emit(HIGHLIGHT, {
        elements: ['header', 'section', 'footer'],
      });
      return story();
    },
  ],
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  title: 'Button',
  component: 'demo-button',
};

export const Basic = {
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  title: 'Button',
  component: 'demo-button',
};

export const Basic = {
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  title: 'Button',
  component: 'demo-button',
  parameters: {
    docs: {
      description: {
        component: 'Another description, overriding the comments',
      },
    },
  },
};

/**
 * # Button stories
 * These stories showcase the button
 */
export const Primary = {
  parameters: {
    docs: {
      description: {
        story: 'Another description on the story, overriding the comments',
      },
    },
  },
};
```

```js filename="Button.stories.ts" renderer="web-components" language="js"
export default {
  title: 'Button',
  component: 'demo-button',
};

export const Basic = {
  parameters: {
    docs: {
      source: { language: 'tsx' },
    },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  title: 'Button',
  component: 'demo-button',
};

export const Basic = {
  parameters: {
    docs: {
      story: { autoplay: true },
    },
  },
};
```

```js filename="Example.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-example',
  argTypes: {
    value: {
      control: {
        type: 'number',
        min: 0,
        max: 100,
        step: 10,
      },
    },
  },
};
```

```js filename="Example.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-example',
  argTypes: {
    value: {
      // ⛔️ Deprecated, do not use
      defaultValue: 0,
    },
  },
  // ✅ Do this instead
  args: {
    value: 0,
  },
};
```

```js filename="Example.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-example',
  argTypes: {
    value: {
      description: 'The value of the slider',
    },
  },
};
```

```js filename="Example.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-example',
  argTypes: {
    parent: { control: 'select', options: ['one', 'two', 'three'] },

    // 👇 Only shown when `parent` arg exists
    parentExists: { if: { arg: 'parent', exists: true } },

    // 👇 Only shown when `parent` arg does not exist
    parentDoesNotExist: { if: { arg: 'parent', exists: false } },

    // 👇 Only shown when `parent` arg value is truthy
    parentIsTruthy: { if: { arg: 'parent' } },
    parentIsTruthyVerbose: { if: { arg: 'parent', truthy: true } },

    // 👇 Only shown when `parent` arg value is not truthy
    parentIsNotTruthy: { if: { arg: 'parent', truthy: false } },

    // 👇 Only shown when `parent` arg value is 'three'
    parentIsEqToValue: { if: { arg: 'parent', eq: 'three' } },

    // 👇 Only shown when `parent` arg value is not 'three'
    parentIsNotEqToValue: { if: { arg: 'parent', neq: 'three' } },

    // Each of the above can also be conditional on the value of a globalType, e.g.:

    // 👇 Only shown when `theme` global exists
    parentExists: { if: { global: 'theme', exists: true } },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
  argTypes: {
    // 👇 All Button stories expect a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
};

export const Basic = {
  argTypes: {
    // 👇 This story expects a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
};
```

```js filename="Example.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  component: 'demo-example',
  argTypes: {
    label: {
      options: ['Normal', 'Bold', 'Italic'],
      mapping: {
        Bold: html`<b>Bold</b>`,
        Italic: html`<i>Italic</i>`,
      },
    },
  },
};
```

```js filename="Example.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-example',
  argTypes: {
    actualArgName: {
      name: 'Friendly name',
    },
  },
};
```

```js filename="Example.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-example',
  argTypes: {
    icon: {
      options: ['arrow-up', 'arrow-down', 'loading'],
    },
  },
};
```

```js filename="Example.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-example',
  argTypes: {
    value: {
      table: {
        defaultValue: { summary: 0 },
        type: { summary: 'number' },
      },
    },
  },
};
```

```js filename="Example.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-example',
  argTypes: {
    value: { type: 'number' },
  },
};
```

```js filename="Page.stories.js" renderer="web-components" language="js"
import MockDate from 'mockdate';

import { getUserFromSession } from '../../api/session.mock';

export default {
  component: 'my-page',
  // 👇 Set the value of Date for every story in the file
  async beforeEach() {
    MockDate.set('2024-02-14');

    // 👇 Reset the Date after each story
    return () => {
      MockDate.reset();
    };
  },
};

export const Default = {
  async play({ canvasElement }) {
    // ... This will run with the mocked Date
  },
};
```

```js filename="Button.js" renderer="web-components" language="js"
import { LitElement, html } from 'lit';

/**
 * @prop {string} content - The display label of the button
 * @prop {boolean} isDisabled - Checks if the button should be disabled
 * @summary This is a custom button element
 * @tag custom-button
 */

export class CustomButton extends LitElement {
  static get properties() {
    return {
      content: { type: String },
      isDisabled: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.content = 'One';
    this.isDisabled = false;
  }

  render() {
    return html` <button type="button" ?disabled=${this.isDisabled}>${this.content}</button> `;
  }
}

customElements.define('custom-button', CustomButton);
```

```js filename="ButtonGroup.stories.js" renderer="web-components" language="js"
// 👇 Imports the Button stories
import * as ButtonStories from './Button.stories';

export default {
  component: 'demo-button-group',
};

export const Pair = {
  args: {
    buttons: [{ ...ButtonStories.Primary.args }, { ...ButtonStories.Secondary.args }],
    orientation: 'horizontal',
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
import { withActions } from '@storybook/addon-actions/decorator';

export default {
  component: 'demo-button',
  parameters: {
    actions: {
      handles: ['mouseover', 'click .btn'],
    },
  },
  decorators: [withActions],
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
  argTypes: {
    // Assigns the argTypes to the Colors category
    backgroundColor: {
      control: 'color',
      table: {
        category: 'Colors',
      },
    },
    primary: {
      table: {
        category: 'Colors',
      },
    },
    // Assigns the argType to the Text category
    label: {
      table: {
        category: 'Text',
      },
    },
    // Assigns the argType to the Events category
    onClick: {
      table: {
        category: 'Events',
      },
    },
    // Assigns the argType to the Sizes category
    size: {
      table: {
        category: 'Sizes',
      },
    },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
  argTypes: {
    // Assigns the argTypes to the Colors category
    backgroundColor: {
      control: 'color',
      table: {
        category: 'Colors',
        // Assigns the argTypes to a specific subcategory
        subcategory: 'Button colors',
      },
    },
    primary: {
      table: {
        category: 'Colors',
        subcategory: 'Button style',
      },
    },
    label: {
      table: {
        category: 'Text',
        subcategory: 'Button contents',
      },
    },
    // Assigns the argType to the Events category
    onClick: {
      table: {
        category: 'Events',
        subcategory: 'Button Events',
      },
    },
    // Assigns the argType to the Sizes category
    size: {
      table: {
        category: 'Sizes',
      },
    },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

import { action } from '@storybook/addon-actions';

export default {
  component: 'custom-button',
};

export const Text = {
  render: ({ label, onClick }) =>
    html`<custom-button label="${label}" @click=${onClick}></custom-button>`,
  args: {
    label: 'Hello',
    onClick: action('clicked'),
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'custom-button',
  argTypes: {
    onClick: { action: 'onClick' },
  },
};

export const Text = {
  args: {...},
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

import { action } from '@storybook/addon-actions';

export default {
  component: 'custom-button',
};

export const Text = {
  render: () => html`<custom-button label="Hello" @click=${action('clicked')}></custom-button>`,
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
  // 👇 Creates specific argTypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  args: {
    // 👇 Now all Button stories will be primary.
    primary: true,
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  component: 'demo-button',
  decorators: [(story) => html`<div style="margin: 3em">${story()}</div>`],
};

export const Example = {};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
};

export const Success = {
  args: {
    variant: 'primary',
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
  argTypes: {
    variant: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  component: 'demo-button',
};

export const Primary = {
  decorators: [(story) => html`<div style="margin: 3em">${story()}</div>`],
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  title: 'Button',
  component: 'demo-button',
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
  parameters: {
    myAddon: { disable: true }, // Disables the addon
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  title: 'Design System/Atoms/Button',
  component: 'demo-button',
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  title: 'Design System/Atoms/Button',
  component: 'demo-button',
};

// This is the only named export in the file, and it matches the component name
export const Button = {};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
  parameters: { actions: { argTypesRegex: '^on.*' } },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    ...Primary.args,
    primary: false,
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const PrimaryLongName = {
  args: {
    ...Primary.args,
    label: 'Primary with a really long name',
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
};

export const Primary = {
  // 👇 Rename this story
  name: 'I am the primary',
  args: {
    label: 'Button',
    primary: true,
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
};

export const Primary = {
  args: {
    background: '#ff0',
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    ...Primary.args,
    label: '😄👍😍💯',
  },
};

export const Tertiary = {
  args: {
    ...Primary.args,
    label: '📚📕📈🤓',
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  title: 'Button',
  component: 'custom-button',
  //👇 Creates specific parameters for the story
  parameters: {
    myAddon: {
      data: 'This data is passed to the addon',
    },
  },
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Basic = {
  render: () => html`<custom-button label="Hello"></custom-button>`,
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  component: 'demo-button',
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary = {
  render: () => html`<demo-button .background="#ff0" .label="Button"></demo-button>`,
};

export const Secondary = {
  render: () => html`<demo-button .background="#ff0" .label="😄👍😍💯"></demo-button>`,
};

export const Tertiary = {
  render: () => html`<demo-button .background="#ff0" .label="📚📕📈🤓"></demo-button>`,
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  component: 'demo-button',
};

export const Primary = {
  render: () => html`<demo-button primary></demo-button>`,
};
```

```js filename="Checkbox.stories.js" renderer="web-components" language="js"
export default {
  title: 'Checkbox',
  component: 'checkbox',
};

export const Unchecked = {
  args: {
    label: 'Unchecked',
  },
};
```

```js filename="Checkbox.stories.js" renderer="web-components" language="js"
export default {
  title: 'Design System/Atoms/Checkbox',
  component: 'demo-checkbox',
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
  argTypes: {
    // Button can be passed a label or an image, not both
    label: {
      control: 'text',
      if: { arg: 'image', truthy: false },
    },
    image: {
      control: { type: 'select', options: ['foo.jpg', 'bar.jpg'] },
      if: { arg: 'label', truthy: false },
    },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
  argTypes: {
    label: { control: 'text' }, // Always shows the control
    advanced: { control: 'boolean' },
    // Only enabled if advanced is true
    margin: { control: 'number', if: { arg: 'advanced' } },
    padding: { control: 'number', if: { arg: 'advanced' } },
    cornerRadius: { control: 'number', if: { arg: 'advanced' } },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  component: 'custom-component',
  //👇 Creates specific argTypes
  argTypes: {
    propertyA: {
      options: ['Item One', 'Item Two', 'Item Three'],
      control: { type: 'select' }, // Automatically inferred when 'options' is defined
    },
    propertyB: {
      options: ['Another Item One', 'Another Item Two', 'Another Item Three'],
    },
  },
};

const someFunction = (valuePropertyA, valuePropertyB) => {
  // Do some logic here
};

export const ExampleStory = {
  render: ({ propertyA, propertyB }) => {
    //👇 Assigns the function result to a variable
    const someFunctionResult = someFunction(propertyA, propertyB);

    return html`
      <custom-component
        .propertyA=${propertyA}
        .propertyB=${propertyB}
        .someProperty=${someFunctionResult}
      ></custom-component>
    `;
  },
  args: {
    propertyA: 'Item One',
    propertyB: 'Another Item One',
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from './icons';

const arrows = { ArrowUp, ArrowDown, ArrowLeft, ArrowRight };

export default {
  component: 'demo-button',
  argTypes: {
    arrow: {
      options: Object.keys(arrows), // An array of serializable values
      mapping: arrows, // Maps serializable option values to complex arg values
      control: {
        type: 'select', // Type 'select' is automatically inferred when 'options' is defined
        labels: {
          // 'labels' maps option values to string labels
          ArrowUp: 'Up',
          ArrowDown: 'Down',
          ArrowLeft: 'Left',
          ArrowRight: 'Right',
        },
      },
    },
  },
};
```

```js filename="YourComponent.stories.js" renderer="web-components" language="js"
export default {
  component: 'your-component',
  argTypes: {
    // foo is the property we want to remove from the UI
    foo: {
      control: false,
    },
  },
};
```

```js filename="YourComponent.stories.js" renderer="web-components" language="js"
export default {
  component: 'your-component',
};

export const ArrayInclude = {
  parameters: {
    controls: { include: ['foo', 'bar'] },
  },
};

export const RegexInclude = {
  parameters: {
    controls: { include: /^hello*/ },
  },
};

export const ArrayExclude = {
  parameters: {
    controls: { exclude: ['foo', 'bar'] },
  },
};

export const RegexExclude = {
  parameters: {
    controls: { exclude: /^hello*/ },
  },
};
```

```js filename="YourComponent.stories.js" renderer="web-components" language="js"
export default {
  component: 'your-component',
  argTypes: {
    // foo is the property we want to remove from the UI
    foo: {
      table: {
        disable: true,
      },
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
export default {
  component: 'my-component',
};

export const Example = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Sample-File',
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT } from '@storybook/addon-highlight';

export default {
  component: 'my-component',
};

export const Highlighted = {
  decorators: [
    (story) => {
      const emit = useChannel({});
      emit(HIGHLIGHT, {
        elements: ['h2', 'a', '.storybook-button'],
      });
      return story();
    },
  ],
};
```

```js filename="YourComponent.stories.js" renderer="web-components" language="js"
export default {
  component: 'your-component',
  parameters: { controls: { sort: 'requiredFirst' } },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  component: 'my-component',
};

export const WithAnImage = {
  render: () =>
    html`<img
      src="https://storybook.js.org/images/placeholders/350x150.png"
      alt="My CDN placeholder"
    />`,
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

import imageFile from './static/image.png';

export default {
  component: 'my-component',
};

const image = {
  src: imageFile,
  alt: 'my image',
};

export const WithAnImage = {
  render: () => html`<img src="${image.src}" alt="${image.alt}" /> `,
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  component: 'my-component',
};

// Assume image.png is located in the "public" directory.
export const WithAnImage = {
  render: () => html`<img src="/image.png" alt="image" />`,
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'custom-button',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

// This is an accessible story
export const Accessible = {
  args: {
    primary: false,
    label: 'Button',
  },
};

// This is not
export const Inaccessible = {
  args: {
    ...Accessible.args,
    backgroundColor: 'red',
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  component: 'my-component',
};

// This story uses a render function to fully control how the component renders.
export const Example = {
  render: () => html`
    <layout>
      <header>
        <h1>Example</h1>
      </header>
      <article>
        <my-component />
      </article>
    </layout>
  `,
};
```

```js filename="CSF 2" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  title: 'components/Button',
  component: 'demo-button',
};

export const Primary = ({ primary }) => html`<custom-button ?primary=${primary}></custom-button>`;
Primary.args = {
  primary: true,
};
```

```js filename="CSF 2" renderer="web-components" language="js"
// Other imports and story implementation

export const Default = ({ primary, backgroundColor, size, label }) =>
  html`<custom-button ?primary="${primary}" size="${size}" label="${label}"></custom-button>`;
```

```js filename="CSF 3" renderer="web-components" language="js"
// Other imports and story implementation

export const Default = {
  render: (args) => html`<demo-button label="Hello" @click=${action('clicked')}></custom-button>`,
};
```

```js filename="CSF 3" renderer="web-components" language="js"
export default {
  title: 'components/Button',
  component: 'demo-button',
};

export const Primary = { args: { primary: true } };
```

```js filename="YourPage.js" renderer="web-components" language="js"
import { LitElement, html } from 'lit-element';

class DocumentScreen extends LitElement {
  static get properties() {
    return {
      _data: { type: Object },
      _status: { state: true },
    };
  }

  constructor() {
    super();
    this._status = 'idle';
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  fetchData() {
    this._status = 'loading';

    fetch('https://your-restful-endpoint')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        response.json();
      })
      .then((data) => {
        this._status = 'success';
        this._data = data;
      })
      .catch((error) => {
        this._status = 'error';
      });
  }

  render() {
    if (this._status === 'error') {
      return html`<p>There was an error fetching the data!</p>`;
    }

    if (this._status === 'loading') {
      return html`<p>Loading...</p>`;
    }

    const { user, document, subdocuments } = this._data;
    return html`
      <demo-page-layout .user=${user}>
        <demo-document-header .document=${document}></demo-document-header>
        <demo-document-list .documents=${subdocuments}></demo-document-list>
      </demo-page-layout>
    `;
  }
}

customElements.define('demo-document-screen', DocumentScreen);
```

```js filename="Gizmo.stories.js" renderer="web-components" language="js"
export default {
  component: 'gizmo-element',
  argTypes: {
    canRotate: {
      control: 'boolean',
    },
    width: {
      control: { type: 'number', min: 400, max: 1200, step: 50 },
    },
    height: {
      control: { type: 'range', min: 200, max: 1500, step: 50 },
    },
    rawData: {
      control: 'object',
    },
    coordinates: {
      control: 'object',
    },
    texture: {
      control: {
        type: 'file',
        accept: '.png',
      },
    },
    position: {
      control: 'radio',
      options: ['left', 'right', 'center'],
    },
    rotationAxis: {
      control: 'check',
      options: ['x', 'y', 'z'],
    },
    scaling: {
      control: 'select',
      options: [10, 50, 75, 100, 200],
    },
    label: {
      control: 'text',
    },
    meshColors: {
      control: {
        type: 'color',
        presetColors: ['#ff0000', '#00ff00', '#0000ff'],
      },
    },
    revisionDate: {
      control: 'date',
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT } from '@storybook/addon-highlight';

export default {
  component: 'my-component',
};

export const StyledHighlight = {
  decorators: [
    (story) => {
      const emit = useChannel({});
      emit(HIGHLIGHT, {
        elements: ['h2', 'a', '.storybook-button'],
        color: 'blue',
        style: 'double', // 'dotted' | 'dashed' | 'solid' | 'double'
      });
      return story();
    },
  ],
};
```

```js filename="Histogram.stories.js" renderer="web-components" language="js"
export default {
  component: 'histogram-component',
};

export const Default = {
  args: {
    dataType: 'latency',
    showHistogramLabels: true,
    histogramAccentColor: '#1EA7FD',
    label: 'Latency distribution',
  },
};
```

```js filename="List.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  component: 'demo-list',
};

export const Empty = {
  render: () => html`<demo-list></demo-list>`,
};

export const OneItem = {
  render: () => html`
    <demo-list>
      <demo-list-item></demo-list-item>
    </demo-list>
  `,
};

export const ManyItems = {
  render: () => html`
    <demo-list>
      <demo-list-item></demo-list-item>
      <demo-list-item></demo-list-item>
      <demo-list-item></demo-list-item>
    </demo-list>
  `,
};
```

```js filename="List.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

// 👇 We're importing the necessary stories from ListItem
import { Selected, Unselected } from './ListItem.stories';

export default {
  component: 'demo-list',
};

export const ManyItems = {
  render: (args) => html`
    <demo-list>
      ${Selected({ ...args, ...Selected.args })} ${Unselected({ ...args, ...Unselected.args })}
      ${Unselected({ ...args, ...Unselected.args })}
    </demo-list>
  `,
};
```

```js filename="List.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  component: 'demo-list',
};

// Always an empty list, not super interesting
export const Empty = {
  render: () => html`<demo-list></demo-list>`,
};
```

```js filename="List.stories.js" renderer="web-components" language="js"
import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

import { Unchecked } from './ListItem.stories';

export default {
  title: 'List',
  component: 'demo-list',
};

//👇 The ListTemplate construct will be spread to the existing stories.
const ListTemplate = {
  render: ({ items, ...args }) => {
    return html`
      <demo-list>
        ${repeat(items, (item) => html`<demo-list-item>${item}</demo-list-item>`)}
      </demo-list>
    `;
  },
};
export const Empty = {
  ...ListTemplate,
  args: {
    items: [],
  },
};

export const OneItem = {
  ...ListTemplate,
  args: {
    items: [
      {
        ...Unchecked.args,
      },
    ],
  },
};
```

```js filename="MyList.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

// 👇 Import the stories of MyListItem
import { Unchecked } from './MyListItem.stories';

export default {
  title: 'MyList',
  component: 'demo-my-list',
};

export const OneItem = {
  render: () => html` <List> ${Unchecked({ ...Unchecked.args })} </List> `,
};
```

```js filename="List.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  title: 'List',
  component: 'demo-list',
  subcomponents: { ListItem: 'demo-list-item' }, // 👈 Adds the ListItem component as a subcomponent
};

export const Empty = {};

export const OneItem = {
  render: () => html`
    <demo-list>
      <demo-list-item></demo-list-item>
    </demo-list>
  `,
};
```

```js filename="TodoItem.stories.js" renderer="web-components" language="js"
import fetch from 'node-fetch';
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export default {
  component: 'demo-todo-item',
  render: (args, { loaded: { todo } }) => TodoItem({ ...args, ...todo }),
};

export const Primary = {
  loaders: [
    async () => ({
      todo: await (await fetch('https://jsonplaceholder.typicode.com/todos/1')).json(),
    }),
  ],
};
```

```js filename="LoginForm.stories.js" renderer="web-components" language="js"
import { userEvent, within, expect } from '@storybook/test';

export default {
  component: 'demo-login-form',
};

export const EmptyForm = {};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 👇 Simulate interactions with the component
    await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');

    await userEvent.type(canvas.getByTestId('password'), 'a-random-password');

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button'));

    // 👇 Assert DOM structure
    await expect(
      canvas.getByText(
        'Everything is perfect. Your account is ready and we should probably get you started!',
      ),
    ).toBeInTheDocument();
  },
};
```

```js filename="YourPage.stories.js" renderer="web-components" language="js"
import { http, HttpResponse, delay } from 'msw';

export default {
  component: 'demo-document-screen',
};

// 👇 The mocked data that will be used in the story
const TestData = {
  user: {
    userID: 1,
    name: 'Someone',
  },
  document: {
    id: 1,
    userID: 1,
    title: 'Something',
    brief: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: 'approved',
  },
  subdocuments: [
    {
      id: 1,
      userID: 1,
      title: 'Something',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      status: 'approved',
    },
  ],
};

export const MockedSuccess = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://your-restful-endpoint/', () => {
          return new HttpResponse.json(TestData);
        }),
      ],
    },
  },
};

export const MockedError = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://your-restful-endpoint', async () => {
          await delay(800);
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
export default {
  component: 'my-component',
  tags: ['autodocs'],
  parameters: {
    docs: {
      toc: {
        disable: true, // 👈 Disables the table of contents
      },
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
export default {
  component: 'my-component',
};

export const Default = {
  args: {
    exampleProp: process.env.EXAMPLE_VAR,
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { userEvent, within } from '@storybook/test';

export default {
  component: 'demo-my-component',
};

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ExampleWithRole = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button', { name: / button label/i }));
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { userEvent, within } from '@storybook/test';

export default {
  component: 'demo-my-component',
};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FirstStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByTestId('an-element'), 'example-value');
  },
};

export const SecondStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByTestId('other-element'), 'another value');
  },
};

export const CombinedStories = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    // Runs the FirstStory and Second story play function before running this story's play function
    await FirstStory.play(context);
    await SecondStory.play(context);
    await userEvent.type(canvas.getByTestId('another-element'), 'random value');
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { userEvent, within } from '@storybook/test';

export default {
  component: 'demo-my-component',
};

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const AsyncExample = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Other steps

    // Waits for the component to be rendered before querying the element
    await canvas.findByRole('button', { name: / button label/i }));
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { userEvent, waitFor, within } from '@storybook/test';

export default {
  component: 'demo-my-component',
};

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ExampleAsyncStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const Input = canvas.getByLabelText('Username', {
      selector: 'input',
    });

    await userEvent.type(Input, 'WrongInput', {
      delay: 100,
    });

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    const Submit = canvas.getByRole('button');
    await userEvent.click(Submit);

    await waitFor(async () => {
      await userEvent.hover(canvas.getByTestId('error'));
    });
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { userEvent, within } from '@storybook/test';

export default {
  component: 'demo-my-component',
};

export const ExampleStory = {
  play: async ({ canvasElement }) => {
    // Assigns canvas to the component root element
    const canvas = within(canvasElement);

    // Starts querying from the component's root element
    await userEvent.type(canvas.getByTestId('example-element'), 'something');
    await userEvent.click(canvas.getByRole('another-element'));
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { fireEvent, userEvent, within } from '@storybook/test';

export default {
  component: 'demo-my-component',
};

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ClickExample = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button'));
  },
};

export const FireEventExample = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await fireEvent.click(canvas.getByTestId('data-testid'));
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { userEvent, within } from '@storybook/test';

export default {
  component: 'demo-my-component',
};

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const DelayedStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const exampleElement = canvas.getByLabelText('example-element');

    // The delay option sets the amount of milliseconds between characters being typed
    await userEvent.type(exampleElement, 'random string', {
      delay: 100,
    });

    const AnotherExampleElement = canvas.getByLabelText('another-example-element');
    await userEvent.type(AnotherExampleElement, 'another random string', {
      delay: 100,
    });
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { userEvent, within } from '@storybook/test';

export default {
  component: 'demo-my-component',
};

// Function to emulate pausing between interactions
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ExampleChangeEvent = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const select = canvas.getByRole('listbox');

    await userEvent.selectOptions(select, ['One Item']);
    await sleep(2000);

    await userEvent.selectOptions(select, ['Another Item']);
    await sleep(2000);

    await userEvent.selectOptions(select, ['Yet another item']);
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  title: 'Path/To/MyComponent',
  component: 'my-component',
};

export const Basic = {};

export const WithProp = {
  render: () => html`<my-component prop="value" />`,
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

export default {
  component: 'my-component',
  parameters: {
    //👇 The viewports object from the Essentials addon
    viewport: {
      //👇 The viewports you want to use
      viewports: INITIAL_VIEWPORTS,
      //👇 Your own default viewport
      defaultViewport: 'iphone6',
    },
  },
};

export const MyStory = {
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
export default {
  title: 'Path/To/MyComponent',
  component: 'my-component',
  decorators: [ ... ],
  parameters: { ... },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  component: 'my-component',
};

const getCaptionForLocale = (locale) => {
  switch (locale) {
    case 'es':
      return 'Hola!';
    case 'fr':
      return 'Bonjour!';
    case 'kr':
      return '안녕하세요!';
    case 'zh':
      return '你好!';
    default:
      return 'Hello!';
  }
};

export const StoryWithLocale = {
  render: (args, { globals: { locale } }) => {
    const caption = getCaptionForLocale(locale);
    return html`<p>${caption}</p>`;
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
export default {
  component: 'my-component',
  includeStories: ['SimpleStory', 'ComplexStory'], // 👈 Storybook loads these stories
  excludeStories: /.*Data$/, // 👈 Storybook ignores anything that contains Data
};

export const simpleData = { foo: 1, bar: 'baz' };
export const complexData = { foo: 1, foobar: { bar: 'baz', baz: someData } };

export const SimpleStory = {
  args: {
    data: simpleData,
  },
};

export const ComplexStory = {
  args: {
    data: complexData,
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
export default {
  component: 'my-component',
};

export const Simple = {
  decorators: [],
  name: 'So simple!',
  parameters: {},
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
export default {
  component: 'my-component',
};

export const ExampleStory = {
  args: {
    propertyA: import.meta.env.STORYBOOK_DATA_KEY,
    propertyB: import.meta.env.VITE_CUSTOM_VAR,
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
export default {
  component: 'my-component',
};

export const ExampleStory = {
  args: {
    propertyA: process.env.STORYBOOK_DATA_KEY,
  },
};
```

```js filename="FooBar.stories.js" renderer="web-components" language="js"
export default {
  title: 'OtherFoo/Bar',
  component: 'foo',
  id: 'Foo/Bar', // Or 'foo-bar' if you prefer
};

export const Baz = {
  name: 'Insert name here',
};
```

```js filename="Page.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  title: 'Page',
  component: 'demo-page',
  render: ({ footer }) => html`
    <demo-page>
      <footer>${footer}</footer>
    </demo-page>
  `,
};

export const CustomFooter = {
  args: {
    footer: 'Built with Storybook',
  },
};
```

```js filename="YourPage.stories.js" renderer="web-components" language="js"
// 👇 Imports the required stories
import * as PageLayout from './PageLayout.stories';
import * as DocumentHeader from './DocumentHeader.stories';
import * as DocumentList from './DocumentList.stories';

export default {
  component: 'demo-document-screen',
};

export const Simple = {
  args: {
    user: PageLayout.Simple.args.user,
    document: DocumentHeader.Simple.args.document,
    subdocuments: DocumentList.Simple.args.documents,
  },
};
```

```js filename="Page.stories.js" renderer="web-components" language="js"
// 👇 Imports all Header stories
import * as HeaderStories from './Header.stories';

export default {
  component: 'demo-page',
};

export const LoggedIn = {
  args: {
    ...HeaderStories.LoggedIn.args,
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
  //👇 Creates specific parameters for the story
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
        { name: 'blue', value: '#00f' },
      ],
    },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
};

export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
        { name: 'blue', value: '#00f' },
      ],
    },
  },
};
```

```js filename="RegistrationForm.stories.js" renderer="web-components" language="js"
import { userEvent, within } from '@storybook/test';

export default {
  component: 'demo-registration-form',
};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emailInput = canvas.getByLabelText('email', {
      selector: 'input',
    });

    await userEvent.type(emailInput, 'example-email@email.com', {
      delay: 100,
    });

    const passwordInput = canvas.getByLabelText('password', {
      selector: 'input',
    });

    await userEvent.type(passwordInput, 'ExamplePassword', {
      delay: 100,
    });
    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    const submitButton = canvas.getByRole('button');

    await userEvent.click(submitButton);
  },
};
```

```js filename="YourPage.js" renderer="web-components" language="js"
import { LitElement, html } from 'lit-element';

class DocumentScreen extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
    };
  }

  constructor() {
    super();
    this.data = {};
  }

  render() {
    const { user, document, subdocuments } = this.data;
    return html`
      <demo-page-layout .user=${user}>
        <demo-document-header .document=${document}></demo-document-header>
        <demo-document-list .documents=${subdocuments}></demo-document-list>
      </demo-page-layout>
    `;
  }
}

customElements.define('demo-document-screen', DocumentScreen);
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
export default {
  component: 'my-component',
  parameters: {
    a11y: {
      // Optional selector to inspect
      element: '#storybook-root',
      config: {
        rules: [
          {
            // The autocomplete rule will not run based on the CSS selector provided
            id: 'autocomplete-valid',
            selector: '*:not([autocomplete="nope"])',
          },
          {
            // Setting the enabled option to false will disable checks for this particular rule on all stories.
            id: 'image-alt',
            enabled: false,
          },
        ],
      },
      options: {},
      manual: true,
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
export default {
  component: 'my-component',
};

export const ExampleStory = {
  parameters: {
    a11y: {
      // This option disables all a11y checks on this story
      disable: true,
    },
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
export default {
  component: 'my-component',
};

export const ExampleStory = {
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          {
            // The autocomplete rule will not run based on the CSS selector provided
            id: 'autocomplete-valid',
            selector: '*:not([autocomplete="nope"])',
          },
          {
            // Setting the enabled option to false will disable checks for this particular rule on all stories.
            id: 'image-alt',
            enabled: false,
          },
        ],
      },
      options: {},
      manual: true,
    },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
// To apply a set of backgrounds to all stories of Button:
export default {
  component: 'demo-button',
  parameters: {
    backgrounds: {
      grid: {
        cellSize: 20,
        opacity: 0.5,
        cellAmount: 5,
        offsetX: 16, // Default is 0 if story has 'fullscreen' layout, 16 if layout is 'padded'
        offsetY: 16, // Default is 0 if story has 'fullscreen' layout, 16 if layout is 'padded'
      },
    },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
};

export const Large = {
  parameters: {
    backgrounds: { disable: true },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
};

export const Large = {
  parameters: {
    backgrounds: {
      grid: {
        disable: true,
      },
    },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
};

export const Large = {
  parameters: {
    backgrounds: { default: 'facebook' },
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
  // Sets the layout parameter component wide.
  parameters: {
    layout: 'centered',
  },
};
```

```js filename="components/MyComponent/MyComponent.stories.js" renderer="web-components" language="js"
export default {
  component: 'my-component',
  title: 'components/MyComponent/MyComponent',
};

export const Default = {
  args: {
    something: 'Something else',
  },
};
```

```js filename="Form.stories.js" renderer="web-components" language="js"
import { userEvent, waitFor, within, expect, fn } from '@storybook/test';

export default {
  component: 'my-form-element',
  args: {
    // 👇 Use `fn` to spy on the onSubmit arg
    onSubmit: fn(),
  },
};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const Submitted = {
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Enter credentials', async () => {
      await userEvent.type(canvas.getByTestId('email'), 'hi@example.com');
      await userEvent.type(canvas.getByTestId('password'), 'supersecret');
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button'));
    });

    // 👇 Now we can assert that the onSubmit arg was called
    await waitFor(() => expect(args.onSubmit).toHaveBeenCalled());
  },
};
```

```js filename="MyComponent.stories.js" renderer="web-components" language="js"
import { userEvent, within } from '@storybook/test';

export default = {
  component: 'my-component',
};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const Submitted = {
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Enter email and password', async () => {
      await userEvent.type(canvas.getByTestId('email'), 'hi@example.com');
      await userEvent.type(canvas.getByTestId('password'), 'supersecret');
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button'));
    });
  },
};
```

```js filename=".storybook/preview.js" renderer="web-components" language="js"
import { setCustomElementsManifest } from '@storybook/web-components';
import customElements from '../custom-elements.json';

setCustomElementsManifest(customElements);

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};
```

```js filename=".storybook/preview.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  decorators: [(story) => html`<div style="margin: 3em">${story()}</div>`],
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  component: 'demo-button',
};

export const WithLayout = {
  parameters: {
    layout: 'centered',
  },
};
```

```js filename="NoteUI.stories.js" renderer="web-components" language="js"
import { expect, userEvent, within } from '@storybook/test';

import { saveNote } from '../../app/actions.mock';
import { createNotes } from '../../mocks/notes';

export default {
  title: 'Mocked/NoteUI',
  component: 'note-ui',
};

const notes = createNotes();

export const SaveFlow = {
  name: 'Save Flow ▶',
  args: {
    isEditing: true,
    note: notes[0],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    const saveButton = canvas.getByRole('menuitem', { name: /done/i });
    await userEvent.click(saveButton);
    // 👇 This is the mock function, so you can assert its behavior
    await expect(saveNote).toHaveBeenCalled();
  },
};
```

```js filename="Page.stories.js" renderer="web-components" language="js"
import { getUserFromSession } from '../../api/session.mock';

export default {
  component: 'my-page',
};

export const Default = {
  async beforeEach() {
    // 👇 Set the return value for the getUserFromSession function
    getUserFromSession.mockReturnValue({ id: '1', name: 'Alice' });
  },
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  title: 'Button',
  component: 'demo-button',
  //👇 Enables auto-generated documentation for this component and includes all stories in this file
  tags: ['autodocs'],
};
```

```js filename="Page.stories.js" renderer="web-components" language="js"
export default {
  title: 'Page',
  component: 'demo-page',
  // 👇 Disable auto-generated documentation for this component
  tags: ['!autodocs'],
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  title: 'Button',
  component: 'demo-button',
  //👇 Enables auto-generated documentation for this component and includes all stories in this file
  tags: ['autodocs'],
};

export const UndocumentedStory = {
  // 👇 Removes this story from auto-generated documentation
  tags: ['!autodocs'],
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  title: 'Button',
  component: 'demo-button',
};

export const Variant1 = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 1 },
};

export const Variant2 = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 2 },
};

// Etc...

export const Combo = {
  // 👇 This story should not be tested, but will appear in the sidebar and docs page
  tags: ['!test'],
  render: () => html`
    <div>
      <demo-button variant="1">
      <demo-button variant="2">
      {/* Etc... */}
    </div>
  `,
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  title: 'Button',
  component: 'demo-button',
  /**
   * 👇 All stories in this file will:
   *    - Be included in the docs page
   *    - Not appear in Storybook's sidebar
   */
  tags: ['autodocs', '!dev'],
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  title: 'Button',
  component: 'demo-button',
  /**
   * 👇 All stories in this file will have these tags applied:
   *    - autodocs
   *    - dev (implicit default, inherited from preview)
   *    - test (implicit default, inherited from preview)
   */
  tags: ['autodocs'],
};

export const ExperimentalFeatureStory = {
  /**
   * 👇 This particular story will have these tags applied:
   *    - experimental
   *    - autodocs (inherited from meta)
   *    - dev (inherited from meta)
   *    - test (inherited from meta)
   */
  tags: ['experimental'],
};
```

```js filename="Button.stories.js" renderer="web-components" language="js"
export default {
  title: 'Button',
  component: 'demo-button',
  // 👇 Applies to all stories in this file
  tags: ['stable'],
};

export const ExperimentalFeatureStory = {
  /**
   * 👇 For this particular story, remove the inherited
   *    `stable` tag and apply the `experimental` tag
   */
  tags: ['!stable', 'experimental'],
};
```

```js filename=".storybook/main.js" renderer="web-components" language="js"
export default {
  // ...
  framework: '@storybook/web-components-vite', // 👈 Add this
};
```

```js filename=".storybook/main.js" renderer="web-components" language="js"
export default {
  // ...
  // framework: '@storybook/react-webpack5', 👈 Remove this
  framework: '@storybook/nextjs', // 👈 Add this
};
```

```js filename="YourComponent.stories.js" renderer="web-components" language="js"
import { html } from 'lit';

export default {
  component: 'demo-your-component',
  decorators: [(story) => html`<div style="margin: 3em">${story()}</div>`],
};
```

```js filename="YourComponent.stories.js" renderer="web-components" language="js"
// This default export determines where your story goes in the story list
export default {
  component: 'demo-your-component',
};

export const FirstStory = {
  args: {
    // 👇 The args you need here will depend on your component
  },
};
```

