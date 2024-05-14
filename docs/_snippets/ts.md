```ts filename="src/polyfills.ts" renderer="angular" language="ts"
import '@angular/localize/init';
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import Button from './button.component';

const meta: Meta<Button> {
  component: Button,
  args: {
    // 👇 Create an action that appears when the onClick event is fired
    onClick: action('on-click'),
  },
};

export default meta;
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT, RESET_HIGHLIGHT } from '@storybook/addon-highlight';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

export const ResetHighlight: Story = {
  decorators: [
    componentWrapperDecorator((story) => {
      const emit = useChannel({});
      emit(RESET_HIGHLIGHT); //👈 Remove previously highlighted elements
      emit(HIGHLIGHT, {
        elements: ['header', 'section', 'footer'],
      });
      return story;
    }),
  ],
};
```

```ts filename=".storybook/main.ts" renderer="angular" language="ts"
import { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  // ...
  framework: '@storybook/angular', // 👈 Add this
};

export default config;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
  parameters: {
    docs: {
      controls: { exclude: ['style'] },
    },
  },
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Basic: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
  parameters: {
    docs: {
      controls: { exclude: ['style'] },
    },
  },
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

/**
 * # Button stories
 * These stories showcase the button
 */
const meta: Meta<Button> = {
  component: Button
  parameters: {
    docs: {
      description: {
        component: 'Another description, overriding the comments'
      },
    },
  },
};

export default meta;
type Story = StoryObj<Button>;

/**
 * # Primary Button
 * This is the primary button
 */
export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Another description on the story, overriding the comments'
      },
    },
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Basic: Story = {
  parameters: {
    docs: {
      source: { language: 'tsx' },
    },
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Basic: Story = {
  parameters: {
    docs: {
      story: { autoplay: true },
    },
  },
};
```

```ts filename="Example.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Example } from './Example';

const meta: Meta<Example> = {
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

export default meta;
```

```ts filename="Example.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Example } from './Example';

const meta: Meta<Example> = {
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

export default meta;
```

```ts filename="Example.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Example } from './Example';

const meta: Meta<Example> = {
  component: Example,
  argTypes: {
    value: {
      description: 'The value of the slider',
    },
  },
};

export default meta;
```

```ts filename="Example.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Example } from './Example';

const meta: Meta<Example> = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
  argTypes: {
    // 👇 All Button stories expect a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  argTypes: {
    // 👇 This story expects a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
};
```

```ts filename="Example.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Example } from './Example';

const meta: Meta<Example> = {
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

export default meta;
```

```ts filename="Example.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Example } from './Example';

const meta: Meta<Example> = {
  component: Example,
  argTypes: {
    actualArgName: {
      name: 'Friendly name',
    },
  },
};

export default meta;
```

```ts filename="Example.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Example } from './Example';

const meta: Meta<Example> = {
  component: Example,
  argTypes: {
    icon: {
      options: ['arrow-up', 'arrow-down', 'loading'],
    },
  },
};

export default meta;
```

```ts filename="Example.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Example } from './Example';

const meta: Meta<Example> = {
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

export default meta;
```

```ts filename="Example.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Example } from './Example';

const meta: Meta<Example> = {
  component: Example,
  argTypes: {
    value: { type: 'number' },
  },
};

export default meta;
```

```ts filename="Page.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';
import MockDate from 'mockdate';

// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { getUserFromSession } from '../../api/session.mock';
import { Page } from './Page';

const meta: Meta<Page> = {
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
export default meta;

type Story = StoryObj<Page>;

export const Default: Story = {
  async play({ canvasElement }) {
    // ... This will run with the mocked Date
  },
};
```

```ts filename="my-button.component.ts" renderer="angular" language="ts"
import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-button',
  template: ` <button type="button" [disabled]="isDisabled">
    {{ content }}
  </button>`,
  styleUrls: ['./button.css'],
})
export class ButtonComponent {
  /**
   * Checks if the button should be disabled
   */
  @Input()
  isDisabled: boolean;

  /**
  The display content of the button
  */
  @Input()
  content: string;
}
```

```ts filename="ButtonGroup.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { ButtonGroup } from './ButtonGroup.component';
import { Button } from './button.component';

//👇 Imports the Button stories
import * as ButtonStories from './Button.stories';

const meta: Meta<ButtonGroup> = {
  component: ButtonGroup,
  decorators: [
    moduleMetadata({
      declarations: [Button],
      imports: [CommonModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<ButtonGroup>;

export const Pair: Story = {
  args: {
    buttons: [{ ...ButtonStories.Primary.args }, { ...ButtonStories.Secondary.args }],
    orientation: 'horizontal',
  },
};
```

```ts filename="Button.component.ts" renderer="angular" language="ts"
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'button',
  template: `the component implementation markup`,
})
export class ButtonComponent {
  /**
   * Is this the principal call to action on the page?
   */
  @Input()
  primary = false;

  /**
   * What background color to use
   */
  @Input()
  backgroundColor?: string;

  /**
   * How large should the button be?
   */
  @Input()
  size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Button contents
   *
   * @required
   */
  @Input()
  label = 'Button';

  /**
   * Optional click handler
   */
  @Output()
  onClick = new EventEmitter<Event>();
}
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { withActions } from '@storybook/addon-actions/decorator';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
  parameters: {
    actions: {
      handles: ['mouseover', 'click .btn'],
    },
  },
  decorators: [withActions],
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

//👇 Throws a type error it the args don't match the component props
export const Primary: Story = {
  args: {
    primary: true,
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';

import { action } from '@storybook/addon-actions';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Text: Story = {
  render: (args) => ({
    props: args,
    // The argsToTemplate helper function converts the args to property and event bindings.
    // You could also write the template in plain HTML and bind to the component's inputs and outputs yourself:
    // <storybook-button ["label"]="label" (onClick)="onClick($event)">
    // We don't recommend the latter since it can conflict with how Storybook applies arguments via its controls addon.
    // Binding to the component's inputs and outputs yourself will conflict with default values set inside the component's class.
    // In edge-case scenarios, you may need to define the template yourself, though.
    template: `<storybook-button ${argsToTemplate(args)}></storybook-button>`,
  }),
  args: {
    label: 'Hello',
    onClick: action('clicked'),
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Text: Story = {
  args: {},
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

import { action } from '@storybook/addon-actions';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Text: Story = {
  render: () => ({
    props: {
      label: 'Button',
      onClick: action('clicked'),
    },
    template: `<storybook-button [label]="label" (onClick)="onClick($event)"></storybook-button>`,
  }),
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

import { Button } from './button.component';

import { Parent } from './parent.component'; // Parent contains ng-content

const meta: Meta<Button> = {
  component: Button,
  decorators: [
    moduleMetadata({
      declarations: [ParentComponent],
    }),
    // With template
    componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`),
    // With component which contains ng-content
    componentWrapperDecorator(Parent),
  ],
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
  argTypes: {
    variant: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
  },
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

import { Button } from './button.component';

import { Parent } from './parent.component'; // Parent contains ng-content

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  decorators: [componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`)],
};

export const InsideParent: Story = {
  decorators: [
    moduleMetadata({
      declarations: [Parent],
    }),
    componentWrapperDecorator(Parent),
  ],
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  component: Button,
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
  parameters: {
    myAddon: { disable: true }, // Disables the addon
  },
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Atoms/Button',
  component: Button,
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button as ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Atoms/Button',
  component: ButtonComponent,
};

export default meta;
type Story = StoryObj<ButtonComponent>;

// This is the only named export in the file, and it matches the component name
export const Button: Story = {};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
  parameters: { actions: { argTypesRegex: '^on.*' } },
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from '@storybook/test';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
  // 👇 Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked
  args: { onClick: fn() },
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    primary: false,
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const PrimaryLongName: Story = {
  args: {
    ...Primary.args,
    label: 'Primary with a really long name',
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  // 👇 Rename this story
  name: 'I am the primary',
  args: {
    label: 'Button',
    primary: true,
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  args: {
    label: 'Button',
    backgroundColor: '#ff0',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    label: '😄👍😍💯',
  },
};

export const Tertiary: Story = {
  args: {
    ...Primary.args,
    label: '📚📕📈🤓',
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
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

export default meta;
type Story = StoryObj<Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Basic: Story = {
  render: () => ({
    template: `<app-button>hello</<app-button>`,
  }),
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular/';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => ({
    props: {
      label: 'Button',
      backgroundColor: '#ff0',
    },
  }),
};

export const Secondary: Story = {
  render: () => ({
    props: {
      label: '😄👍😍💯',
      backgroundColor: '#ff0',
    },
  }),
};

export const Tertiary: Story = {
  render: () => ({
    props: {
      label: '📚📕📈🤓',
      backgroundColor: '#ff0',
    },
  }),
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  component: Button,
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
      ],
    },
  },
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => ({
    props: {
      label: 'Button',
      primary: true,
    },
  }),
};
```

```ts filename="CheckBox.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Checkbox } from './checkbox.component';

const meta: Meta<Checkbox> = {
  component: Checkbox,
};

export default meta;
type Story = StoryObj<Checkbox>;

export const Unchecked: Story = {
  args: {
    label: 'Unchecked',
  },
};
```

```ts filename="CheckBox.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Checkbox } from './checkbox.component';

const meta: Meta<Checkbox> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Atoms/Checkbox',
  component: CheckBox,
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
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

export default meta;
```

```ts filename="YourComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { YourComponent } from './your-component.component';

const meta: Meta<YourComponent> = {
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

export default meta;
type Story = StoryObj<YourComponent>;

const someFunction = (valuePropertyA: String, valuePropertyB: String) => {
  // Do some logic here
};

export const ExampleStory: Story = {
  render: (args) => {
    const { propertyA, propertyB } = args;
    //👇 Assigns the function result to a variable
    const someFunctionResult = someFunction(propertyA, propertyB);
    return {
      props: {
        ...args,
        someProperty: someFunctionResult,
      },
    };
  },
  args: { propertyA: 'Item One', propertyB: 'Another Item One' },
};
```

```ts filename="Icon.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import Icon from './icon.component';

import { IconA, IconB, IconC, IconD, IconE } from './icons';

// Maps the icons to a JSON serializable object to be safely used with the argTypes
const iconMap = { IconA, IconB, IconC, IconD, IconE };

const meta: Meta<Icon> = {
  title: 'My Story with Icons',
  component: Icon,
  argTypes: {
    icon: {
      options: Object.keys(iconMap),
    },
  },
};

export default meta;
type Story = StoryObj<Icon>;

const Template: Story = (args) => {
  // retrieves the appropriate icon passes it as a component prop
  const { icon } = args;
  const selectedIcon = iconMap[icon];
  return {
    component: Icon,
    props: {
      ...args,
      icon: selectedIcon,
    },
  };
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from './icons';

const arrows = { ArrowUp, ArrowDown, ArrowLeft, ArrowRight };

const meta: Meta<Button> = {
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

export default meta;
```

```ts filename="YourComponent.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { YourComponent } from './YourComponent.component';

const meta: Meta<YourComponent> = {
  component: YourComponent,
  argTypes: {
    // foo is the property we want to remove from the UI
    foo: {
      control: false,
    },
  },
};

export default meta;
```

```ts filename="YourComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { YourComponent } from './YourComponent.component';

const meta: Meta<YourComponent> = {
  component: YourComponent,
};

export default meta;
type Story = StoryObj<YourComponent>;

export const ArrayInclude: Story = {
  parameters: {
    controls: { include: ['foo', 'bar'] },
  },
};

export const RegexInclude: Story = {
  parameters: {
    controls: { include: /^hello*/ },
  },
};

export const ArrayExclude: Story = {
  parameters: {
    controls: { exclude: ['foo', 'bar'] },
  },
};

export const RegexExclude: Story = {
  parameters: {
    controls: { exclude: /^hello*/ },
  },
};
```

```ts filename="YourComponent.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { YourComponent } from './YourComponent.component';

const meta: Meta<YourComponent> = {
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

export default meta;
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular/';

import { MyComponent } from './MyComponent.component';

// More on default export: https://storybook.js.org/docs/writing-stories/#default-export
const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

export const Example: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Sample-File',
    },
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT } from '@storybook/addon-highlight';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

export const Highlighted: Story = {
  decorators: [
    componentWrapperDecorator((story) => {
      const emit = useChannel({});
      emit(HIGHLIGHT, {
        elements: ['h2', 'a', '.storybook-button'],
      });
      return story;
    }),
  ],
};
```

```ts filename="YourComponent.stories.ts" renderer="angular" language="ts"
import type { Meta } from  from '@storybook/angular';

import { YourComponent } from './YourComponent.component';

const meta: Meta<YourComponent> = {
  component: YourComponent,
  parameters: { controls: { sort: 'requiredFirst' } },
};

export default meta;
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAnImage: Story = {
  render: () => ({
    props: {
      src: 'https://storybook.js.org/images/placeholders/350x150.png',
      alt: 'My CDN placeholder',
    },
  }),
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { MyComponent } from './MyComponent.component';

import imageFile from './static/image.png';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

const image = {
  src: imageFile,
  alt: 'my image',
};

export const WithAnImage: Story = {
  render: () => ({
    props: {
      src: image.src,
      alt: image.alt,
    },
    template: `<img src="{{src}}" alt="{{alt}}" />`,
  }),
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

// Assume image.png is located in the "public" directory.
export const WithAnImage: Story = {
  render: () => ({
    props: {
      src: '/image.png',
      alt: 'my image',
    },
  }),
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './Button.component';

const meta: Meta<Button> = {
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<Button>;

// This is an accessible story
export const Accessible: Story = {
  args: {
    primary: false,
    label: 'Button',
  },
};
// This is not
export const Inaccessible: Story = {
  args: {
    ...Accessible.args,
    backgroundColor: 'red',
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { moduleMetadata, argsToTemplate } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { Layout } from './Layout.component';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
  decorators: [
    moduleMetadata({
      declarations: [Layout],
      imports: [CommonModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<MyComponent>;

// This story uses a render function to fully control how the component renders.
export const Example: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-layout>
        <header>
          <h1>Example</h1>
        </header>
        <article>
          <app-my-component ${argsToTemplate(args)}></app-my-component>
        </article>
      </app-layout>
    `,
  }),
};
```

```ts filename="form.component.spec.ts" renderer="angular" language="ts"
import { render, screen, fireEvent } from '@testing-library/angular';

import { FormComponent } from './LoginForm.component';

import { InvalidForm } from './Form.stories'; //👈 Our stories imported here.

test('Checks if the form is valid ', async () => {
  await render(FormComponent, {
    componentProperties: InvalidForm.args,
  });

  fireEvent.click(screen.getByText('Submit'));

  const isFormValid = screen.getByTestId('invalid-form');
  expect(isFormValid).toBeInTheDocument();
});
```

```ts filename="CSF 2" renderer="angular" language="ts"
import { Meta, Story } from '@storybook/angular';

import { Button } from './button.component';

export default {
  title: 'Button',
  component: Button,
} as Meta;

export const Primary: Story = (args) => ({
  props: args,
});
Primary.args = { primary: true };
```

```ts filename="CSF 2" renderer="angular" language="ts"
// Other imports and story implementation
export const Default: Story = (args) => ({
  props: args,
});
```

```ts filename="CSF 3 - explicit render function" renderer="angular" language="ts"
// Other imports and story implementation
export const Default: Story = {
  render: (args) => ({
    props: args,
  }),
};
```

```ts filename="CSF 3" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = { component: Button };
export default meta;

type Story = StoryObj<Button>;

export const Primary: Story = { args: { primary: true } };
```

```ts filename=".storybook/preview.ts" renderer="angular" language="ts"
import type { Preview } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';

const preview: Preview = {
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    componentWrapperDecorator((story, { parameters }) => {
      // 👇 Make it configurable by reading from parameters
      const { pageLayout } = parameters;
      switch (pageLayout) {
        case 'page':
          // Your page layout is probably a little more complex than this ;)
          return `<div class="page-layout">${story}</div>`;
        case 'page-mobile':
          return `<div class="page-mobile-layout">${story}</div>`;
        case default:
          // In the default case, don't apply a layout
          return story;
      }
    }),
  ],
};

export default preview;
```

```ts filename="YourPage.component.ts" renderer="angular" language="ts"
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'document-screen',
  template: `
    <div>
      <div *ngIf="error"><p>There was an error fetching the data!</p></div>
      <div *ngIf="loading"><p>Loading...</p></div>
      <div *ngIf="!loading && subdocuments.length > 0">
        <page-layout [user]="user">
          <document-header [document]="document"></document-header>
          <document-list [documents]="subdocuments"></document-list>
        </page-layout>
      </div>
    </div>
  `,
})
export class DocumentScreen implements OnInit {
  user: any = { id: 0, name: 'Some User' };

  document: any = { id: 0, title: 'Some Title' };

  subdocuments: any = [];

  error = false;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('https://your-restful-endpoint').subscribe({
      next: (data) => {
        this.loading = false;
        this.user = data.user;
        this.document = data.document;
        this.documents.data.subdocuments;
      },
      error: (error) => {
        this.error = true;
      },
    });
  }
}
```

```ts filename="YourPage.component.ts" renderer="angular" language="ts"
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'document-screen',
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error">There was an error fetching the data!</div>
    <div *ngIf="!loading && subdocuments.length > 0">
      <page-layout [user]="user">
        <document-header [document]="document"></document-header>
        <document-list [documents]="subdocuments"></document-list>
      </page-layout>
    </div>
  `,
})
export class SampleGraphqlComponent implements OnInit {
  user: any = { id: 0, name: 'Some User' };

  document: any = { id: 0, title: 'Some Title' };

  subdocuments: any = [];

  error = '';
  loading = true;

  constructor(private apollo: Apollo) {}
  ngOnInit() {
    this.apollo
      .watchQuery({
        query: gql`
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
        `,
      })
      .valueChanges.subscribe((result: any) => {
        this.user = result?.data?.user;
        this.document = result?.data?.document;
        this.subdocuments = result?.data?.subdocuments;
        this.loading = result.loading;

        // Errors is an array and we're getting the first item only
        this.error = result.errors[0].message;
      });
  }
}
```

```ts filename="FooBar.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Foo } from './Foo.component';

const meta: Meta<Foo> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Foo/Bar',
  component: Foo,
};

export default meta;
type Story = StoryObj<Foo>;

export const Baz: Story = {};
```

```ts filename="Gizmo.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Gizmo } from './Gizmo.component';

const meta: Meta<Gizmo> = {
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

export default meta;
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT } from '@storybook/addon-highlight';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

export const StyledHighlight: Story = {
  decorators: [
    componentWrapperDecorator((story) => {
      const emit = useChannel({});
      emit(HIGHLIGHT, {
        elements: ['h2', 'a', '.storybook-button'],
        color: 'blue',
        style: 'double', // 'dotted' | 'dashed' | 'solid' | 'double'
      });
      return story;
    }),
  ],
};
```

```ts filename="Histogram.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { HistogramComponent } from './histogram.component';

const meta: Meta<HistogramComponent> = {
  component: HistogramComponent,
};

export default meta;
type Story = StoryObj<HistogramComponent>;

export const Default: Story = {
  args: {
    dataType: 'latency',
    showHistogramLabels: true,
    histogramAccentColor: '#1EA7FD',
    label: 'Latency distribution',
  },
};
```

```ts filename="List.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { List } from './list.component';
import { ListItem } from './list-item.component';

const meta: Meta<List> = {
  component: List,
  decorators: [
    moduleMetadata({
      declarations: [List, ListItem],
      imports: [CommonModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<List>;

// Always an empty list, not super interesting
export const Empty: Story = {
  render: (args) => ({
    props: args,
    template: '<app-list></app-list>',
  }),
};

export const OneItem: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-list>
        <app-list-item></app-list-item>
      </app-list>`,
  }),
};

export const ManyItems: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-list>
        <app-list-item></app-list-item>
        <app-list-item></app-list-item>
        <app-list-item></app-list-item>
      </app-list>
    `,
  }),
};
```

```ts filename="List.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { List } from './list.component';
import { ListItem } from './list-item.component';

//👇 We're importing the necessary stories from ListItem
import { Selected, Unselected } from './ListItem.stories';

const meta: Meta<List> = {
  component: List,
  decorators: [
    moduleMetadata({
      declarations: [List, ListItem],
      imports: [CommonModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<List>;

export const ManyItems: Story = {
  args: {
    Selected: Selected.args.isSelected,
    Unselected: Unselected.args.isSelected,
  },
  render: (args) => ({
    props: args,
    template: `
      <app-list>
        <app-list-item [isSelected]="Selected"></app-list-item>
        <app-list-item [isSelected]="Unselected"></app-list-item>
        <app-list-item [isSelected]="Unselected"></app-list-item>
      </app-list>
    `,
  }),
};
```

```ts filename="List.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { List } from './list.component';

const meta: Meta<List> = {
  component: List,
  decorators: [
    moduleMetadata({
      declarations: [List],
      imports: [CommonModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<List>;

// Always an empty list, not super interesting
export const Empty: Story = {
  render: (args) => ({
    props: args,
    template: `<app-list></app-list>`,
  }),
};
```

```ts filename="List.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { List } from './list.component';
import { ListItem } from './list-item.component';

//👇 Imports a specific story from ListItem stories
import { Unchecked } from './ListItem.stories';

const meta: Meta<List> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
  decorators: [
    moduleMetadata({
      declarations: [List, ListItem],
      imports: [CommonModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<List>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
const ListTemplate: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-list>
        <div *ngFor="let item of items">
          <app-list-item [item]="item"></app-list-item>
        </div>
      </app-list>
    `,
  }),
};

export const Empty: Story = {
  ...ListTemplate,
  args: { items: [] },
};

export const OneItem: Story = {
  ...ListTemplate,
  args: {
    items: [{ ...Unchecked.args }],
  },
};
```

```ts filename="List.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { List } from './list.component';
import { ListItem } from './list-item.component';

//👇 Imports a specific story from ListItem stories
import { Unchecked } from './ListItem.stories';

const meta: Meta<List> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
  decorators: [
    moduleMetadata({
      declarations: [List, ListItem],
      imports: [CommonModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<List>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const OneItem: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-list>
        <app-list-item [item]="item"></app-list-item>
      </app-list>
   `,
  }),
  args: {
    ...Unchecked.args,
  },
};
```

```ts filename="List.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { List } from './list.component';
import { ListItem } from './list-item.component';

const meta: Meta<List> = {
  component: List,
  subcomponents: { ListItem }, //👈 Adds the ListItem component as a subcomponent
  decorators: [
    moduleMetadata({
      declarations: [List, ListItem],
      imports: [CommonModule],
    }),
  ],
};
export default meta;

type Story = StoryObj<List>;

export const Empty: Story = {};

export const OneItem: Story = {
  args: {},
  render: (args) => ({
    props: args,
    template: `
      <app-list>
        <app-list-item></app-list-item>
      </app-list>
  `,
  }),
};
```

```ts filename="TodoItem.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { moduleMetadata } from '@storybook/angular';

import fetch from 'node-fetch';

import { CommonModule } from '@angular/common';

import { TodoItem } from './TodoItem';

const meta: Meta<TodoItem> = {
  component: TodoItem,
  decorators: [
    moduleMetadata({
      declarations: [TodoItem],
      imports: [CommonModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<TodoItem>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args, { loaded: { todo } }) => ({
    props: {
      args,
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

```ts filename="LoginForm.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { userEvent, within, expect } from '@storybook/test';

import { LoginForm } from './LoginForm.component';

const meta: Meta<LoginForm> = {
  component: LoginForm,
};

export default meta;
type Story = StoryObj<LoginForm>;

export const EmptyForm: Story = {};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm: Story = {
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

```ts filename="YourPage.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { graphql, HttpResponse, delay } from 'msw';

import { DocumentHeader } from './DocumentHeader.component';
import { DocumentList } from './DocumentList.component';
import { PageLayout } from './PageLayout.component';
import { DocumentScreen } from './YourPage.component';
import { MockGraphQLModule } from './mock-graphql.module';

const meta: Meta<DocumentScreen> = {
  component: DocumentScreen,
  decorators: [
    moduleMetadata({
      declarations: [DocumentList, DocumentHeader, PageLayout],
      imports: [CommonModule, HttpClientModule, MockGraphQLModule],
    }),
  ],
};

export default meta;

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

type Story = StoryObj<DocumentScreen>;

export const MockedSuccess: Story = {
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

export const MockedError: Story = {
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

```ts filename="YourPage.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { http, HttpResponse, delay } from 'msw';

import { DocumentScreen } from './YourPage.component';

const meta: Meta<DocumentScreen> = {
  component: DocumentScreen,
};

export default meta;
type Story = StoryObj<DocumentScreen>;

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

export const MockedSuccess: Story = {
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

export const MockedError: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
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

export default meta;
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { MyComponent } from './MyComponent';

// To apply a set of backgrounds to all stories of Button:
const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

export const Default: Story = {
  args: {
    exampleProp: process.env.EXAMPLE_VAR,
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ExampleWithRole: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button', { name: / button label/i }));
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FirstStory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByTestId('an-element'), 'example-value');
  },
};

export const SecondStory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByTestId('other-element'), 'another value');
  },
};

export const CombinedStories: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Runs the FirstStory and Second story play function before running this story's play function
    await FirstStory.play({ canvasElement });
    await SecondStory.play({ canvasElement });
    await userEvent.type(canvas.getByTestId('another-element'), 'random value');
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/your-framework';

import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const AsyncExample: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Other steps

    // Waits for the component to be rendered before querying the element
    await canvas.findByRole('button', { name: / button label/i });
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { userEvent, waitFor, within } from '@storybook/test';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ExampleAsyncStory: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

export const ExampleStory: Story = {
  play: async ({ canvasElement }) => {
    // Assigns canvas to the component root element
    const canvas = within(canvasElement);

    // Starts querying from the component's root element
    await userEvent.type(canvas.getByTestId('example-element'), 'something');
    await userEvent.click(canvas.getByRole('another-element'));
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { fireEvent, userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ClickExample: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button'));
  },
};

export const FireEventExample: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await fireEvent.click(canvas.getByTestId('data-testid'));
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const DelayedStory: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

// Function to emulate pausing between interactions
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ExampleChangeEvent: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

export const Default: Story = {};

export const WithProp: Story = {
  render: () => ({
    props: {
      prop: 'value',
    },
  }),
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
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

export default meta;
type Story = StoryObj<MyComponent>;

export const MyStory: Story = {
  render: () => ({
    template: '<MyComponent></MyComponent>',
  }),
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Path/To/MyComponent',
  component: MyComponent,
  decorators: [ ... ],
  parameters: { ... },
};

export default meta;
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

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

export const StoryWithLocale: Story = {
  render: (args, { globals: { locale } }) => {
    const caption = getCaptionForLocale(locale);
    return {
      template: `<p>${caption}</p>`,
    };
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { MyComponent } from './MyComponent.component';

import someData from './data.json';

const meta: Meta<MyComponent> = {
  component: MyComponent,
  includeStories: ['SimpleStory', 'ComplexStory'], // 👈 Storybook loads these stories
  excludeStories: /.*Data$/, // 👈 Storybook ignores anything that contains Data
};

export default meta;

export const simpleData = { foo: 1, bar: 'baz' };
export const complexData = { foo: 1, foobar: { bar: 'baz', baz: someData } };

type Story = StoryObj<MyComponent>;

export const SimpleStory: Story = {
  args: {
    data: simpleData,
  },
};

export const ComplexStory: Story = {
  args: {
    data: complexData,
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { MyComponent } from './MyComponent.component';

const meta: Meta<Button> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

export const Simple: Story = {
  decorators: [],
  name: 'So simple!',
  parameters: {},
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

export const ExampleStory: Story = {
  args: {
    propertyA: process.env.STORYBOOK_DATA_KEY,
  },
};
```

```ts filename="FooBar.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Foo } from './Foo.component';

const meta: Meta<Foo> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'OtherFoo/Bar',
  component: Foo,
  id: 'Foo/Bar', // Or 'foo-bar' if you prefer
};

export default meta;
type Story = StoryObj<Foo>;

export const Baz: Story = {
  name: 'Insert name here',
};
```

```ts filename="Page.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';

import { Page } from './page.component';

type PagePropsAndCustomArgs = Page & { footer?: string };

const meta: Meta<PagePropsAndCustomArgs> = {
  component: Page,
  render: ({ footer, ...args }) => ({
    props: args,
    template: `
      <storybook-page ${argsToTemplate(args)}>
        <ng-container footer>${footer}</ng-container>
      </storybook-page>`,
  }),
};
export default meta;

type Story = StoryObj<PagePropsAndCustomArgs>;

export const CustomFooter: Story = {
  args: {
    footer: 'Built with Storybook',
  },
};
```

```ts filename="YourPage.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { DocumentScreen } from './YourPage.component';

// 👇 Imports the required stories
import * as PageLayout from './PageLayout.stories';
import * as DocumentHeader from './DocumentHeader.stories';
import * as DocumentList from './DocumentList.stories';

const meta: Meta<DocumentScreen> = {
  component: DocumentScreen,
};

export default meta;
type Story = StoryObj<DocumentScreen>;

export const Simple: Story = {
  args: {
    user: PageLayout.Simple.args.user,
    document: DocumentHeader.Simple.args.document,
    subdocuments: DocumentList.Simple.args.documents,
  },
};
```

```ts filename="Page.stories.ts" renderer="angular" language="ts"
import { moduleMetadata } from '@storybook/angular';

import type { Meta, StoryObj } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { Button } from './button.component';
import { Header } from './header.component';
import { Page } from './page.component';

//👇 Imports all Header stories
import * as HeaderStories from './Header.stories';

const meta: Meta<Page> = {
  component: Page,
  decorators: [
    moduleMetadata({
      declarations: [Button, Header],
      imports: [CommonModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<Page>;

export const LoggedIn: Story = {
  args: {
    ...HeaderStories.LoggedIn.args,
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Primary: Story = {
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

```ts filename="RegistrationForm.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { userEvent, within } from '@storybook/test';

import { RegistrationForm } from './RegistrationForm.component';

const meta: Meta<RegistrationForm> = {
  component: RegistrationForm,
};

export default meta;
type Story = StoryObj<RegistrationForm>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm: Story = {
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

```ts filename="YourPage.component.ts" renderer="angular" language="ts"
import { Component, Input } from '@angular/core';

@Component({
  selector: 'document-screen',
  template: `
    <page-layout [user]="user">
      <document-header [document]="document"></document-header>
      <document-list [documents]="subdocuments"></document-list>
    </page-layout>
  `,
})
export class DocumentScreen {
  @Input()
  user: any = { id: 0, name: 'Some User' };

  @Input()
  document: any = { id: 0, title: 'Some Title' };

  @Input()
  subdocuments: any = [];
}
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { MyComponent } from './MyComponent';

const meta: Meta<MyComponent> = {
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

export default meta;
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

export const NonA11yStory: Story = {
  parameters: {
    a11y: {
      // This option disables all a11y checks on this story
      disabled: true,
    },
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

export const ExampleStory: Story = {
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

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

// To apply a set of backgrounds to all stories of Button:
const meta: Meta<Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

// To apply a set of backgrounds to all stories of Button:
const meta: Meta<Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Large: Story = {
  parameters: {
    backgrounds: { disable: true },
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Large: Story = {
  parameters: {
    backgrounds: {
      grid: {
        disable: true,
      },
    },
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const Large: Story = {
  parameters: {
    backgrounds: { default: 'facebook' },
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
  // Sets the layout parameter component wide.
  parameters: {
    layout: 'centered',
  },
};
```

```ts filename="components/MyComponent/MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  component: MyComponent,
  title: 'components/MyComponent/MyComponent',
};

export default meta;
type Story = StoryObj<MyComponent>;

export const Default: Story = {
  args: {
    something: 'Something else',
  },
};
```

```ts filename="Form.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { userEvent, waitFor, within, expect, fn } from '@storybook/test';

import { Form } from './Form.component';

const meta: Meta<Form> = {
  component: MyComponent,
  args: {
    // 👇 Use `fn` to spy on the onSubmit arg
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<Form>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const Submitted: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent.component';

const meta: Meta<MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<MyComponent>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const Submitted: Story = {
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

```ts filename=".storybook/preview.ts" renderer="angular" language="ts"
import type { Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';

import docJson from '../documentation.json'; // The path to your generated json file from Compodoc contains all your documentation information.

setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="angular" language="ts"
import type { Preview } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';

const preview: Preview = {
  decorators: [componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`)],
};

export default preview;
```

```ts filename=".storybook/preview.js" renderer="angular" language="ts"
import type { Preview } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';

const preview: Preview = {
  decorators: [
    componentWrapperDecorator(
      (story) => `<div [class]="myTheme">${story}</div>`,
      ({ globals }) => {
        return { myTheme: globals['theme'] };
      },
    ),
  ],
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="angular" language="ts"
import { componentWrapperDecorator } from '@storybook/angular';
import type { Preview } from '@storybook/angular';

import { ThemeProvider } from './theme-provider.component';

const preview: Preview = {
  decorators: [
    moduleMetadata({ declarations: [ThemeProvider] }),
    componentWrapperDecorator(
      (story) => `<theme-provider class="default">${story}</theme-provider>`,
    ),
  ],
};
export default preview;

// or with globals of story context
const preview: Preview = {
  decorators: [
    moduleMetadata({ declarations: [ThemeProvider] }),
    componentWrapperDecorator(
      (story) => `<theme-provider [class]="theme">${story}</theme-provider>`,
      ({ globals }) => ({ theme: globals.theme }),
    ),
  ],
};
export default preview;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<Button>;

export const WithLayout: Story = {
  parameters: {
    layout: 'centered',
  },
};
```

```ts filename="NoteUI.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';
import { expect, userEvent, within } from '@storybook/test';

// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { saveNote } from '../../app/actions.mock';
import { createNotes } from '../../mocks/notes';
import NoteUI from './note-ui';

const meta: Meta<NoteUI> = {
  title: 'Mocked/NoteUI',
  component: NoteUI,
};
export default meta;

type Story = StoryObj<NoteUI>;

const notes = createNotes();

export const SaveFlow: Story = {
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

```ts filename="Page.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { getUserFromSession } from '../../api/session.mock';
import { Page } from './Page';

const meta: Meta<Page> = {
  component: Page,
};
export default meta;

type Story = StoryObj<Page>;

export const Default: Story = {
  async beforeEach() {
    // 👇 Set the return value for the getUserFromSession function
    getUserFromSession.mockReturnValue({ id: '1', name: 'Alice' });
  },
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta } from '@storybook/angular';

import { Button } from './Button';

const meta: Meta<Button> = {
  component: Button,
  //👇 Enables auto-generated documentation for this component and includes all stories in this file
  tags: ['autodocs'],
};
export default meta;
```

```ts filename="Page.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Page } from './Page';

const meta: Meta<Page> = {
  component: Page,
  // 👇 Disable auto-generated documentation for this component
  tags: ['!autodocs'],
};
export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './Button';

const meta: Meta<Button> = {
  component: Button,
  //👇 Enables auto-generated documentation for this component and includes all stories in this file
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<Button>;

export const UndocumentedStory: Story = {
  // 👇 Removes this story from auto-generated documentation
  tags: ['!autodocs'],
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './Button';

const meta: Meta<Button> = {
  component: Button,
};
export default meta;

type Story = StoryObj<Button>;

export const Variant1: Story = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 1 },
};

export const Variant2: Story = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 2 },
};

// Etc...

export const Combo: Story = {
  // 👇 This story should not be tested, but will appear in the sidebar and docs page
  tags: ['!test'],
  render: () => ({
    template: `
      <div>
        <demo-button variant={1}>
        <demo-button variant={2}>
        {/* Etc... */}
      </div>
    `,
  }),
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './Button';

const meta: Meta<Button> = {
  component: Button,
  /**
   * 👇 All stories in this file will:
   *    - Be included in the docs page
   *    - Not appear in Storybook's sidebar
   */
  tags: ['autodocs', '!dev'],
};
export default meta;
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './Button';

const meta: Meta<Button> = {
  component: Button,
  /**
   * 👇 All stories in this file will have these tags applied:
   *    - autodocs
   *    - dev (implicit default, inherited from preview)
   *    - test (implicit default, inherited from preview)
   */
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<Button>;

export const ExperimentalFeatureStory: Story = {
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

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './Button';

const meta: Meta<Button> = {
  component: Button,
  // 👇 Applies to all stories in this file
  tags: ['stable'],
};
export default meta;

type Story = StoryObj<Button>;

export const ExperimentalFeatureStory: Story = {
  /**
   * 👇 For this particular story, remove the inherited
   *    `stable` tag and apply the `experimental` tag
   */
  tags: ['!stable', 'experimental'],
};
```

```ts filename="Button.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { Button } from './button.component';

const meta: Meta<Button> = {
  component: Button,
};
export default meta;

type Story = StoryObj<Button>;

export const Basic: Story = {};

export const Primary: Story = {
  args: {
    primary: true,
  },
};
```

```ts filename="YourComponent.stories.ts" renderer="angular" language="ts"
import { componentWrapperDecorator } from '@storybook/angular';

import type { Meta } from '@storybook/angular';

import { YourComponent } from './your.component';

const meta: Meta<YourComponent> = {
  component: YourComponent,
  decorators: [componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`)],
};

export default meta;
```

```ts filename="YourComponent.stories.ts" renderer="angular" language="ts"
import type { Meta, StoryObj } from '@storybook/angular';

import { YourComponent } from './your.component';

//👇 This default export determines where your story goes in the story list
const meta: Meta<YourComponent> = {
  component: YourComponent,
};

export default meta;
type Story = StoryObj<YourComponent>;

export const FirstStory: Story = {
  args: {
    //👇 The args you need here will depend on your component
  },
};
```

```ts filename="Button.stories.ts" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';
import { action } from '@storybook/addon-actions';

import Button from './Button';

const meta: Meta<typeof Button> {
  component: Button,
  args: {
    // 👇 Create an action that appears when the onClick event is fired
    onClick: action('on-click'),
  },
};

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    docs: {
      controls: { exclude: ['style'] },
    },
  },
};

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    docs: {
      controls: { exclude: ['style'] },
    },
  },
};

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

/**
 * # Button stories
 * These stories showcase the button
 */
const meta: Meta<typeof Button> = {
  component: Button
  parameters: {
    docs: {
      description: {
        component: 'Another description, overriding the comments'
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * # Primary Button
 * This is the primary button
 */
export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Another description on the story, overriding the comments'
      },
    },
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  parameters: {
    docs: {
      source: { language: 'tsx' },
    },
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  parameters: {
    docs: {
      story: { autoplay: true },
    },
  },
};
```

```ts filename="Example.stories.ts|tsx" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Meta } from '@storybook/your-renderer';

import { Example } from './Example';

const meta: Meta<typeof Example> = {
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

export default meta;
```

```ts filename="Example.stories.ts|tsx" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Meta } from '@storybook/your-renderer';

import { Example } from './Example';

const meta: Meta<typeof Example> = {
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

export default meta;
```

```ts filename="Example.stories.ts|tsx" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Meta } from '@storybook/your-renderer';

import { Example } from './Example';

const meta: Meta<typeof Example> = {
  component: Example,
  argTypes: {
    value: {
      description: 'The value of the slider',
    },
  },
};

export default meta;
```

```ts filename="Example.stories.ts|tsx" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Meta } from '@storybook/your-renderer';

import { Example } from './Example';

const meta: Meta<typeof Example> = {
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

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Meta } from '@storybook/your-renderer';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    // 👇 All Button stories expect a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
};

export default meta;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Preview } from '@storybook/your-renderer';

const preview: Preview = {
  argTypes: {
    // 👇 All stories expect a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
};

export default preview;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Meta, StoryObj } from '@storybook/your-renderer';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  argTypes: {
    // 👇 This story expects a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
};
```

```ts filename="Example.stories.ts|tsx" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Meta } from '@storybook/your-renderer';

import { Example } from './Example';

const meta: Meta<typeof Example> = {
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

export default meta;
```

```ts filename="Example.stories.ts|tsx" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Meta } from '@storybook/your-renderer';

import { Example } from './Example';

const meta: Meta<typeof Example> = {
  component: Example,
  argTypes: {
    actualArgName: {
      name: 'Friendly name',
    },
  },
};

export default meta;
```

```ts filename="Example.stories.ts|tsx" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Meta } from '@storybook/your-renderer';

import { Example } from './Example';

const meta: Meta<typeof Example> = {
  component: Example,
  argTypes: {
    icon: {
      options: ['arrow-up', 'arrow-down', 'loading'],
    },
  },
};

export default meta;
```

```ts filename="Example.stories.ts|tsx" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Meta } from '@storybook/your-renderer';

import { Example } from './Example';

const meta: Meta<typeof Example> = {
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

export default meta;
```

```ts filename="Example.stories.ts|tsx" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import type { Meta } from '@storybook/your-renderer';

import { Example } from './Example';

const meta: Meta<typeof Example> = {
  component: Example,
  argTypes: {
    value: { type: 'number' },
  },
};

export default meta;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3, angular, etc.)
import { Preview } from '@storybook/your-renderer';

const preview: Preview = {
  // The default value of the theme arg for all stories
  args: { theme: 'light' },
};

export default preview;
```

```ts filename="Page.stories.ts" renderer="common" language="ts"
// Replace your-renderer with the name of your renderer (e.g. react, vue3)
import type { Meta, StoryObj } from '@storybook/your-renderer';
import MockDate from 'mockdate';

// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { getUserFromSession } from '../../api/session.mock';
import { Page } from './Page';

const meta: Meta<typeof Page> = {
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
export default meta;

type Story = StoryObj<typeof Page>;

export const Default: Story = {
  async play({ canvasElement }) {
    // ... This will run with the mocked Date
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { withActions } from '@storybook/addon-actions/decorator';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    actions: {
      handles: ['mouseover', 'click .btn'],
    },
  },
  decorators: [withActions],
};

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

//👇 Throws a type error it the args don't match the component props
export const Primary: Story = {
  args: {
    primary: true,
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    variant: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
  },
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
  component: Button,
};

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Atoms/Button',
  component: Button,
};

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button as ButtonComponent } from './Button';

const meta: Meta<typeof ButtonComponent> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Atoms/Button',
  component: ButtonComponent,
};

export default meta;
type Story = StoryObj<typeof ButtonComponent>;

// This is the only named export in the file, and it matches the component name
export const Button: Story = {};
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Sample: Story = {
  render: () => ({
    template: '<button :label=label />',
    data: {
      label: 'hello button',
    },
  }),
};
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: { actions: { argTypesRegex: '^on.*' } },
};

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';
import { fn } from '@storybook/test';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  // 👇 Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked
  args: { onClick: fn() },
};

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    primary: false,
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const PrimaryLongName: Story = {
  args: {
    ...Primary.args,
    label: 'Primary with a really long name',
  },
};
```

```ts filename="Checkbox.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: {
    label: 'Unchecked',
  },
};
```

```ts filename="CheckBox.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { CheckBox } from './Checkbox';

const meta: Meta<typeof CheckBox> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Design System/Atoms/Checkbox',
  component: CheckBox,
};

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from './icons';

const arrows = { ArrowUp, ArrowDown, ArrowLeft, ArrowRight };

const meta: Meta<typeof Button> = {
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

export default meta;
```

```ts filename="YourComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  component: YourComponent,
  argTypes: {
    // foo is the property we want to remove from the UI
    foo: {
      control: false,
    },
  },
};

export default meta;
```

```ts filename="YourComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  component: YourComponent,
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

export const ArrayInclude: Story = {
  parameters: {
    controls: { include: ['foo', 'bar'] },
  },
};

export const RegexInclude: Story = {
  parameters: {
    controls: { include: /^hello*/ },
  },
};

export const ArrayExclude: Story = {
  parameters: {
    controls: { exclude: ['foo', 'bar'] },
  },
};

export const RegexExclude: Story = {
  parameters: {
    controls: { exclude: /^hello*/ },
  },
};
```

```ts filename="YourComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
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

export default meta;
```

```ts filename="YourComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  component: YourComponent,
  parameters: { controls: { sort: 'requiredFirst' } },
};

export default meta;
```

```ts filename="CSF 3" renderer="common" language="ts"
export const PrimaryOnDark: Story = {
  ...Primary,
  parameters: { background: { default: 'dark' } },
};
```

```ts filename="src/components/Button/Button.stories.tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<Button> = {
  // Sets the name for the stories container
  title: 'components/Button',
  // The component name will be used if `title` is not set
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

// The story variable name will be used if `name` is not set
const Primary: Story = {
  // Sets the name for that particular story
  name: 'Primary',
  args: {
    label: 'Button',
  },
};
```

```ts filename="FooBar.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Foo } from './Foo';

const meta: Meta<typeof Foo> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Foo/Bar',
  component: Foo,
};

export default meta;
type Story = StoryObj<typeof Foo>;

export const Baz: Story = {};
```

```ts filename="Gizmo.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Gizmo } from './Gizmo';

const meta: Meta<typeof Gizmo> = {
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

export default meta;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    crossOriginIsolated: true,
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    disableProjectJson: true,
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    disableTelemetry: true,
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    disableWhatsNewNotifications: true,
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    disableWebpackDefaults: true,
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    enableCrashReports: true, // 👈 Appends the crash reports to the telemetry events
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  docs: {
    autodocs: 'tag',
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  docs: {
    defaultName: 'Documentation',
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  docs: {
    docsMode: true,
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  features: {
    argTypeTargetsV7: true,
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  features: {
    legacyDecoratorFileOrder: true,
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace react-vite with the framework you are using (e.g., react-webpack5)
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {
      legacyRootApi: true,
    },
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
import type { Indexer } from '@storybook/types';

import fs from 'fs/promises';

const jsonStoriesIndexer: Indexer = {
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

const config: StorybookConfig = {
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

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
import type { Indexer } from '@storybook/types';

const combosIndexer: Indexer = {
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

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  experimental_indexers: async (existingIndexers) => [...existingIndexers, combosIndexer];
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  logLevel: 'debug',
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  managerHead: (head) => `
    ${head}
    <link rel="preload" href="/fonts/my-custom-manager-font.woff2" />
  `,
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  previewBody: (body) => `
    ${body}
    ${
      process.env.ANALYTICS_ID ? '<script src="https://cdn.example.com/analytics.js"></script>' : ''
    }
  `,
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  previewHead: (head) => `
    ${head}
    ${
      process.env.ANALYTICS_ID ? '<script src="https://cdn.example.com/analytics.js"></script>' : ''
    }
  `,
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  refs: {
    'package-name': { disable: true },
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: [{ from: '../my-custom-assets/images', to: '/assets' }],
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../public', '../static'],
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';
import type { StoriesEntry } from '@storybook/types';

async function findStories(): Promise<StoriesEntry[]> {
  // your custom logic returns a list of files
}

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: async (list: StoriesEntry[]) => [
    ...list,
    // 👇 Add your found stories to the existing list of story files
    ...(await findStories()),
  ],
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the webpack-based framework you are using (e.g., react-webpack5)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
import type { Options } from '@swc/core';
// Replace your-framework with the webpack-based framework you are using (e.g., react-webpack5)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/your-framework',
    options: {},
  },
  swc: (config: Options, options): Options => {
    return {
      ...config,
      // Apply your custom SWC configuration
    };
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableAutoDocs: false,
    },
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableBlocks: false,
    },
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableDocgen: false,
    },
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableMDXEntries: false,
    },
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableSourcemaps: false,
    },
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  build: {
    test: {
      disableTreeShaking: false,
    },
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-webpack5)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    check: true,
    checkOptions: {
      eslint: true,
    },
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-webpack5)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    check: true,
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    skipCompiler: true,
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  // Required
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

```js filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename="YourPage.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework (e.g. nextjs, vue3-vite)
import type { Meta, StoryObj } from '@storybook/your-framework';

import { http, HttpResponse, delay } from 'msw';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: DocumentScreen,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

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

export const MockedSuccess: Story = {
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

export const MockedError: Story = {
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

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue, etc.)
import { Preview } from '@storybook/your-renderer';

import { initialize, mswLoader } from 'msw-storybook-addon';

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize();

const preview: Preview = {
  // ... rest of preview configuration
  loaders: [mswLoader], // 👈 Add the MSW loader to all stories
};

export default preview;
```

```ts filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
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

export default meta;
```

```ts filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: {
    exampleProp: process.env.EXAMPLE_VAR,
  },
};
```

```ts filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ExampleWithRole: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button', { name: / button label/i }));
  },
};
```

```ts filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FirstStory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByTestId('an-element'), 'example-value');
  },
};

export const SecondStory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByTestId('other-element'), 'another value');
  },
};

export const CombinedStories: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    // Runs the FirstStory and Second story play function before running this story's play function
    await FirstStory.play(context);
    await SecondStory.play(context);
    await userEvent.type(canvas.getByTestId('another-element'), 'random value');
  },
};
```

```ts filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const AsyncExample: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Other steps

    // Waits for the component to be rendered before querying the element
    await canvas.findByRole('button', { name: / button label/i });
  },
};
```

```ts filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { userEvent, waitFor, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ExampleAsyncStory: Story = {
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

```ts filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const ExampleStory: Story = {
  play: async ({ canvasElement }) => {
    // Assigns canvas to the component root element
    const canvas = within(canvasElement);

    // Starts querying from the component's root element
    await userEvent.type(canvas.getByTestId('example-element'), 'something');
    await userEvent.click(canvas.getByRole('another-element'));
  },
};
```

```ts filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { fireEvent, userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ClickExample: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button'));
  },
};

export const FireEventExample: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await fireEvent.click(canvas.getByTestId('data-testid'));
  },
};
```

```ts filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const DelayedStory: Story = {
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

```ts filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

// Function to emulate pausing between interactions
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ExampleChangeEvent: Story = {
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

```ts filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Path/To/MyComponent',
  component: MyComponent,
  decorators: [ ... ],
  parameters: { ... },
};

export default meta;
```

```ts filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Simple: Story = {
  decorators: [],
  name: 'So simple!',
  parameters: {},
};
```

```tsx filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const ExampleStory: Story = {
  args: {
    propertyA: import.meta.env.STORYBOOK_DATA_KEY,
    propertyB: import.meta.env.VITE_CUSTOM_VAR,
  },
};
```

```ts filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const ExampleStory: Story = {
  args: {
    propertyA: process.env.STORYBOOK_DATA_KEY,
  },
};
```

```ts filename="FooBar.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Foo } from './Foo';

const meta: Meta<typeof Foo> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'OtherFoo/Bar',
  component: Foo,
  id: 'Foo/Bar', // Or 'foo-bar' if you prefer
};

export default meta;
type Story = StoryObj<typeof Foo>;

export const Baz: Story = {
  name: 'Insert name here',
};
```

```ts filename="YourPage.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { DocumentScreen } from './YourPage';

// 👇 Imports the required stories
import * as PageLayout from './PageLayout.stories';
import * as DocumentHeader from './DocumentHeader.stories';
import * as DocumentList from './DocumentList.stories';

const meta: Meta<typeof DocumentScreen> = {
  component: DocumentScreen,
};

export default meta;
type Story = StoryObj<typeof DocumentScreen>;

export const Simple: Story = {
  args: {
    user: PageLayout.Simple.args.user,
    document: DocumentHeader.Simple.args.document,
    subdocuments: DocumentList.Simple.args.documents,
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  // 👇 Meta-level parameters
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Basic: Story = {};
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-renderer';

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [
        { name: 'light', value: '#fff' },
        { name: 'dark', value: '#333' },
      ],
    },
  },
};

export default preview;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const OnDark: Story = {
  // 👇 Story-level parameters
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};
```

```ts filename="storybook.test.ts" renderer="common" language="ts"
import path from 'path';
import * as glob from 'glob';

// Replace your-framework with one of the supported Storybook frameworks (react, vue3)
import type { Meta, StoryFn } from '@storybook/your-framework';

import { describe, test, expect } from '@jest/globals';

// Replace your-testing-library with one of the supported testing libraries (e.g., react, vue)
import { render } from '@testing-library/your-testing-library';

// Adjust the import based on the supported framework or Storybook's testing libraries (e.g., react, testing-vue3)
import { composeStories } from '@storybook/your-framework';

type StoryFile = {
  default: Meta;
  [name: string]: StoryFn | Meta;
};

const compose = (entry: StoryFile): ReturnType<typeof composeStories<StoryFile>> => {
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

```ts filename="storybook.test.ts" renderer="common" language="ts"
// @vitest-environment jsdom

// Replace your-framework with one of the supported Storybook frameworks (react, vue3)
import type { Meta, StoryFn } from '@storybook/your-framework';

import { describe, expect, test } from 'vitest';

// Replace your-testing-library with one of the supported testing libraries (e.g., react, vue)
import { render } from '@testing-library/your-testing-library';

// Adjust the import based on the supported framework or Storybook's testing libraries (e.g., react, testing-vue3)
import { composeStories } from '@storybook/your-framework';

type StoryFile = {
  default: Meta;
  [name: string]: StoryFn | Meta;
};

const compose = (entry: StoryFile): ReturnType<typeof composeStories<StoryFile>> => {
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
    import.meta.glob<StoryFile>('./stories/**/*.(stories|story).@(js|jsx|mjs|ts|tsx)', {
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

```ts filename="RegistrationForm.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { userEvent, within } from '@storybook/test';

import { RegistrationForm } from './RegistrationForm';

const meta: Meta<typeof RegistrationForm> = {
  component: RegistrationForm,
};

export default meta;
type Story = StoryObj<typeof RegistrationForm>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm: Story = {
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

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    // Other Storybook addons
    '@storybook/addon-a11y', //👈 The a11y addon goes here
  ],
};

export default config;
```

```ts filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
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

export default meta;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
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

export default preview;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

// To apply a set of backgrounds to all stories of Button:
const meta: Meta<typeof Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

// To apply a set of backgrounds to all stories of Button:
const meta: Meta<typeof Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Large: Story = {
  parameters: {
    backgrounds: { disable: true },
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Large: Story = {
  parameters: {
    backgrounds: {
      grid: {
        disable: true,
      },
    },
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Large: Story = {
  parameters: {
    backgrounds: { default: 'facebook' },
  },
};
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

```ts filename="src/OutlineCSS.ts" renderer="common" language="ts"
import { dedent } from 'ts-dedent';

export default function outlineCSS(selector: string) {
  return dedent/* css */ `
    ${selector} body {
      outline: 1px solid #2980b9 !important;
    }

    ${selector} article {
      outline: 1px solid #3498db !important;
    }

    ${selector} nav {
      outline: 1px solid #0088c3 !important;
    }

    ${selector} aside {
      outline: 1px solid #33a0ce !important;
    }

    ${selector} section {
      outline: 1px solid #66b8da !important;
    }

    ${selector} header {
      outline: 1px solid #99cfe7 !important;
    }

    ${selector} footer {
      outline: 1px solid #cce7f3 !important;
    }

    ${selector} h1 {
      outline: 1px solid #162544 !important;
    }

    ${selector} h2 {
      outline: 1px solid #314e6e !important;
    }

    ${selector} h3 {
      outline: 1px solid #3e5e85 !important;
    }

    ${selector} h4 {
      outline: 1px solid #449baf !important;
    }

    ${selector} h5 {
      outline: 1px solid #c7d1cb !important;
    }

    ${selector} h6 {
      outline: 1px solid #4371d0 !important;
    }

    ${selector} main {
      outline: 1px solid #2f4f90 !important;
    }

    ${selector} address {
      outline: 1px solid #1a2c51 !important;
    }

    ${selector} div {
      outline: 1px solid #036cdb !important;
    }

    ${selector} p {
      outline: 1px solid #ac050b !important;
    }

    ${selector} hr {
      outline: 1px solid #ff063f !important;
    }

    ${selector} pre {
      outline: 1px solid #850440 !important;
    }

    ${selector} blockquote {
      outline: 1px solid #f1b8e7 !important;
    }

    ${selector} ol {
      outline: 1px solid #ff050c !important;
    }

    ${selector} ul {
      outline: 1px solid #d90416 !important;
    }

    ${selector} li {
      outline: 1px solid #d90416 !important;
    }

    ${selector} dl {
      outline: 1px solid #fd3427 !important;
    }

    ${selector} dt {
      outline: 1px solid #ff0043 !important;
    }

    ${selector} dd {
      outline: 1px solid #e80174 !important;
    }

    ${selector} figure {
      outline: 1px solid #ff00bb !important;
    }

    ${selector} figcaption {
      outline: 1px solid #bf0032 !important;
    }

    ${selector} table {
      outline: 1px solid #00cc99 !important;
    }

    ${selector} caption {
      outline: 1px solid #37ffc4 !important;
    }

    ${selector} thead {
      outline: 1px solid #98daca !important;
    }

    ${selector} tbody {
      outline: 1px solid #64a7a0 !important;
    }

    ${selector} tfoot {
      outline: 1px solid #22746b !important;
    }

    ${selector} tr {
      outline: 1px solid #86c0b2 !important;
    }

    ${selector} th {
      outline: 1px solid #a1e7d6 !important;
    }

    ${selector} td {
      outline: 1px solid #3f5a54 !important;
    }

    ${selector} col {
      outline: 1px solid #6c9a8f !important;
    }

    ${selector} colgroup {
      outline: 1px solid #6c9a9d !important;
    }

    ${selector} button {
      outline: 1px solid #da8301 !important;
    }

    ${selector} datalist {
      outline: 1px solid #c06000 !important;
    }

    ${selector} fieldset {
      outline: 1px solid #d95100 !important;
    }

    ${selector} form {
      outline: 1px solid #d23600 !important;
    }

    ${selector} input {
      outline: 1px solid #fca600 !important;
    }

    ${selector} keygen {
      outline: 1px solid #b31e00 !important;
    }

    ${selector} label {
      outline: 1px solid #ee8900 !important;
    }

    ${selector} legend {
      outline: 1px solid #de6d00 !important;
    }

    ${selector} meter {
      outline: 1px solid #e8630c !important;
    }

    ${selector} optgroup {
      outline: 1px solid #b33600 !important;
    }

    ${selector} option {
      outline: 1px solid #ff8a00 !important;
    }

    ${selector} output {
      outline: 1px solid #ff9619 !important;
    }

    ${selector} progress {
      outline: 1px solid #e57c00 !important;
    }

    ${selector} select {
      outline: 1px solid #e26e0f !important;
    }

    ${selector} textarea {
      outline: 1px solid #cc5400 !important;
    }

    ${selector} details {
      outline: 1px solid #33848f !important;
    }

    ${selector} summary {
      outline: 1px solid #60a1a6 !important;
    }

    ${selector} command {
      outline: 1px solid #438da1 !important;
    }

    ${selector} menu {
      outline: 1px solid #449da6 !important;
    }

    ${selector} del {
      outline: 1px solid #bf0000 !important;
    }

    ${selector} ins {
      outline: 1px solid #400000 !important;
    }

    ${selector} img {
      outline: 1px solid #22746b !important;
    }

    ${selector} iframe {
      outline: 1px solid #64a7a0 !important;
    }

    ${selector} embed {
      outline: 1px solid #98daca !important;
    }

    ${selector} object {
      outline: 1px solid #00cc99 !important;
    }

    ${selector} param {
      outline: 1px solid #37ffc4 !important;
    }

    ${selector} video {
      outline: 1px solid #6ee866 !important;
    }

    ${selector} audio {
      outline: 1px solid #027353 !important;
    }

    ${selector} source {
      outline: 1px solid #012426 !important;
    }

    ${selector} canvas {
      outline: 1px solid #a2f570 !important;
    }

    ${selector} track {
      outline: 1px solid #59a600 !important;
    }

    ${selector} map {
      outline: 1px solid #7be500 !important;
    }

    ${selector} area {
      outline: 1px solid #305900 !important;
    }

    ${selector} a {
      outline: 1px solid #ff62ab !important;
    }

    ${selector} em {
      outline: 1px solid #800b41 !important;
    }

    ${selector} strong {
      outline: 1px solid #ff1583 !important;
    }

    ${selector} i {
      outline: 1px solid #803156 !important;
    }

    ${selector} b {
      outline: 1px solid #cc1169 !important;
    }

    ${selector} u {
      outline: 1px solid #ff0430 !important;
    }

    ${selector} s {
      outline: 1px solid #f805e3 !important;
    }

    ${selector} small {
      outline: 1px solid #d107b2 !important;
    }

    ${selector} abbr {
      outline: 1px solid #4a0263 !important;
    }

    ${selector} q {
      outline: 1px solid #240018 !important;
    }

    ${selector} cite {
      outline: 1px solid #64003c !important;
    }

    ${selector} dfn {
      outline: 1px solid #b4005a !important;
    }

    ${selector} sub {
      outline: 1px solid #dba0c8 !important;
    }

    ${selector} sup {
      outline: 1px solid #cc0256 !important;
    }

    ${selector} time {
      outline: 1px solid #d6606d !important;
    }

    ${selector} code {
      outline: 1px solid #e04251 !important;
    }

    ${selector} kbd {
      outline: 1px solid #5e001f !important;
    }

    ${selector} samp {
      outline: 1px solid #9c0033 !important;
    }

    ${selector} var {
      outline: 1px solid #d90047 !important;
    }

    ${selector} mark {
      outline: 1px solid #ff0053 !important;
    }

    ${selector} bdi {
      outline: 1px solid #bf3668 !important;
    }

    ${selector} bdo {
      outline: 1px solid #6f1400 !important;
    }

    ${selector} ruby {
      outline: 1px solid #ff7b93 !important;
    }

    ${selector} rt {
      outline: 1px solid #ff2f54 !important;
    }

    ${selector} rp {
      outline: 1px solid #803e49 !important;
    }

    ${selector} span {
      outline: 1px solid #cc2643 !important;
    }

    ${selector} br {
      outline: 1px solid #db687d !important;
    }

    ${selector} wbr {
      outline: 1px solid #db175b !important;
    }`;
}
```

```ts filename="src/helpers.ts" renderer="common" language="ts"
import { global } from '@storybook/global';

export const clearStyles = (selector: string | string[]) => {
  const selectors = Array.isArray(selector) ? selector : [selector];
  selectors.forEach(clearStyle);
};

const clearStyle = (input: string | string[]) => {
  const selector = typeof input === 'string' ? input : input.join('');
  const element = global.document.getElementById(selector);
  if (element && element.parentElement) {
    element.parentElement.removeChild(element);
  }
};

export const addOutlineStyles = (selector: string, css: string) => {
  const existingStyle = global.document.getElementById(selector);
  if (existingStyle) {
    if (existingStyle.innerHTML !== css) {
      existingStyle.innerHTML = css;
    }
  } else {
    const style = global.document.createElement('style');
    style.setAttribute('id', selector);
    style.innerHTML = css;
    global.document.head.appendChild(style);
  }
};
```

```ts filename="src/manager.ts" renderer="common" language="ts"
import { addons, types } from '@storybook/manager-api';
import { ADDON_ID, TOOL_ID } from './constants';
import { Tool } from './Tool';

// Register the addon
addons.register(ADDON_ID, () => {
  // Register the tool
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'My addon',
    match: ({ tabId, viewMode }) => !tabId && viewMode === 'story',
    render: Tool,
  });
});
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-renderer with the framework you are using (e.g., react, vue3)
import { Preview, Renderer } from '@storybook/your-renderer';
import { withThemeByClassName } from '@storybook/addon-themes';

import '../src/index.css'; // Your application's global CSS file

const preview: Preview = {
  decorators: [
    withThemeByClassName<Renderer>({
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

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-renderer with the framework you are using (e.g., react, vue3)
import { Preview, Renderer } from '@storybook/your-renderer';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

import '../src/index.css'; // Your application's global CSS file

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute<Renderer>({
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

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-renderer with the framework you are using (e.g., react, vue3)
import { Preview, Renderer } from '@storybook/your-renderer';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';

import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../src/themes';

const GlobalStyles = createGlobalStyle`
  body {
    font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
`;

const preview: Preview = {
  decorators: [
  withThemeFromJSXProvider<Renderer>({
  themes: {
    light: lightTheme,
    dark: darkTheme,
  }
  defaultTheme: 'light',
  Provider: ThemeProvider,
  GlobalStyles,
})]
};

export default preview;
```

```tsx filename="src/Tool.tsx" renderer="common" language="ts"
import React, { memo, useCallback, useEffect } from 'react';

import { useGlobals, useStorybookApi } from '@storybook/manager-api';
import { IconButton } from '@storybook/components';
import { LightningIcon } from '@storybook/icons';

import { ADDON_ID, PARAM_KEY, TOOL_ID } from './constants';

export const Tool = memo(function MyAddonSelector() {
  const [globals, updateGlobals] = useGlobals();
  const api = useStorybookApi();

  const isActive = [true, 'true'].includes(globals[PARAM_KEY]);

  const toggleMyTool = useCallback(() => {
    updateGlobals({
      [PARAM_KEY]: !isActive,
    });
  }, [isActive]);

  useEffect(() => {
    api.setAddonShortcut(ADDON_ID, {
      label: 'Toggle Addon [8]',
      defaultShortcut: ['8'],
      actionName: 'myaddon',
      showInMenu: false,
      action: toggleMyTool,
    });
  }, [toggleMyTool, api]);

  return (
    <IconButton key={TOOL_ID} active={isActive} title="Enable my addon" onClick={toggleMyTool}>
      <LightningIcon />
    </IconButton>
  );
});
```

```ts filename="src/withGlobals.ts" renderer="common" language="ts"
import type { Renderer, PartialStoryFn as StoryFunction, StoryContext } from '@storybook/types';

import { useEffect, useMemo, useGlobals } from '@storybook/preview-api';
import { PARAM_KEY } from './constants';

import { clearStyles, addOutlineStyles } from './helpers';

import outlineCSS from './outlineCSS';

export const withGlobals = (StoryFn: StoryFunction<Renderer>, context: StoryContext<Renderer>) => {
  const [globals] = useGlobals();

  const isActive = [true, 'true'].includes(globals[PARAM_KEY]);

  // Is the addon being used in the docs panel
  const isInDocs = context.viewMode === 'docs';

  const outlineStyles = useMemo(() => {
    const selector = isInDocs ? `#anchor--${context.id} .docs-story` : '.sb-show-main';

    return outlineCSS(selector);
  }, [context.id]);
  useEffect(() => {
    const selectorId = isInDocs ? `my-addon-docs-${context.id}` : `my-addon`;

    if (!isActive) {
      clearStyles(selectorId);
      return;
    }

    addOutlineStyles(selectorId, outlineStyles);

    return () => {
      clearStyles(selectorId);
    };
  }, [isActive, outlineStyles, context.id]);

  return StoryFn();
};
```

```ts filename="example-addon/src/preset.ts" renderer="common" language="ts"
import { webpackFinal as webpack } from './webpack/webpackFinal';

import { viteFinal as vite } from './vite/viteFinal';

import { babelDefault as babel } from './babel/babelDefault';

export const webpackFinal = webpack as any;

export const viteFinal = vite as any;

export const babelDefault = babel as any;
```

```ts filename="example-addon/src/babel/babelDefault.ts" renderer="common" language="ts"
import { TransformOptions } from '@babel/core';

export function babelDefault(config: TransformOptions) {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      [require.resolve('@babel/plugin-transform-react-jsx'), {}, 'preset'],
    ],
  };
}
```

```ts filename="example-addon/src/preview.ts" renderer="common" language="ts"
import type { Renderer, ProjectAnnotations } from '@storybook/types';
import { PARAM_KEY } from './constants';
import { CustomDecorator } from './decorators';

const preview: ProjectAnnotations<Renderer> = {
  decorators: [CustomDecorator],
  globals: {
    [PARAM_KEY]: false,
  },
};

export default preview;
```

```ts filename="example-addon/src/vite/viteFinal.ts" renderer="common" language="ts"
export function ViteFinal(config: any, options: any = {}) {
  config.plugins.push(
    new MyCustomPlugin({
      someOption: true,
    }),
  );

  return config;
}
```

```ts filename="example-addon/src/webpack/webpackFinal.ts" renderer="common" language="ts"
import type { Configuration as WebpackConfig } from 'webpack';

export function webpackFinal(config: WebpackConfig, options: any = {}) {
  const rules = [
    ...(config.module?.rules || []),
    {
      test: /\.custom-file$/,
      loader: require.resolve(`custom-loader`),
    },
  ];
  config.module.rules = rules;

  return config;
}
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  docs: {
    //👇 See the table below for the list of supported options
    defaultName: 'Documentation',
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: [
    //👇 Your documentation written in MDX along with your stories goes here
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials'],
};

export default config;
```

```ts renderer="common" language="ts"
import { TransformOptions } from '@babel/core';

export function babelDefault(config: TransformOptions) {
  return {
    plugins: [[require.resolve('@babel/plugin-transform-react-jsx'), {}, 'preset']],
  };
}
```

```ts filename="build.ts" renderer="common" language="ts"
import { build as viteBuild } from 'vite';
import { stringifyProcessEnvs } from './envs';
import { commonConfig } from './vite-config';

import type { EnvsRaw, ExtendedOptions } from './types';

export async function build(options: ExtendedOptions) {
  const { presets } = options;

  const baseConfig = await commonConfig(options, 'build');
  const config = {
    ...baseConfig,
    build: {
      outDir: options.outputDir,
      emptyOutDir: false,
      sourcemap: true,
    },
  };

  const finalConfig = await presets.apply('viteFinal', config, options);

  const envsRaw = await presets.apply<Promise<EnvsRaw>>('env');
  // Stringify env variables after getting `envPrefix` from the final config
  const envs = stringifyProcessEnvs(envsRaw, finalConfig.envPrefix);
  // Update `define`
  finalConfig.define = {
    ...finalConfig.define,
    ...envs,
  };

  await viteBuild(finalConfig);
}
```

```ts filename="vite-server.ts" renderer="common" language="ts"
import { stringifyProcessEnvs } from './envs';
import { getOptimizeDeps } from './optimizeDeps';
import { commonConfig } from './vite-config';

import type { EnvsRaw, ExtendedOptions } from './types';

export async function createViteServer(options: ExtendedOptions, devServer: Server) {
  const { port, presets } = options;

  // Defines the baseline config.
  const baseConfig = await commonConfig(options, 'development');
  const defaultConfig = {
    ...baseConfig,
    server: {
      middlewareMode: true,
      hmr: {
        port,
        server: devServer,
      },
      fs: {
        strict: true,
      },
    },
    optimizeDeps: await getOptimizeDeps(baseConfig, options),
  };

  const finalConfig = await presets.apply('viteFinal', defaultConfig, options);

  const envsRaw = await presets.apply<Promise<EnvsRaw>>('env');

  // Remainder implementation
}
```

```ts filename="server.ts" renderer="common" language="ts"
import { createServer } from 'vite';

export async function createViteServer(options: ExtendedOptions, devServer: Server) {
  const { port } = options;
  // Remainder server configuration

  // Creates the server.
  return createServer({
    // The server configuration goes here
    server: {
      middlewareMode: true,
      hmr: {
        port,
        server: devServer,
      },
    },
  });
}
```

```ts renderer="common" language="ts"
export interface Builder<Config, Stats> {
  start: (args: {
    options: Options;
    startTime: ReturnType<typeof process.hrtime>;
    router: Router;
    server: Server;
  }) => Promise<void | {
    stats?: Stats;
    totalTime: ReturnType<typeof process.hrtime>;
    bail: (e?: Error) => Promise<void>;
  }>;
  build: (arg: {
    options: Options;
    startTime: ReturnType<typeof process.hrtime>;
  }) => Promise<void | Stats>;
  bail: (e?: Error) => Promise<void>;
  getConfig: (options: Options) => Promise<Config>;
  corePresets?: string[];
  overridePresets?: string[];
}
```

```ts filename="mdx-plugin.ts" renderer="common" language="ts"
import mdx from 'vite-plugin-mdx';

import { createCompiler } from '@storybook/csf-tools/mdx';

export function mdxPlugin() {
  return mdx((filename) => {
    const compilers = [];

    if (filename.endsWith('stories.mdx') || filename.endsWith('story.mdx')) {
      compilers.push(createCompiler({}));
    }
    return {
      compilers,
    };
  });
}
```

```ts renderer="common" language="ts"
import { virtualPreviewFile, virtualStoriesFile } from './virtual-file-names';
import { transformAbsPath } from './utils/transform-abs-path';
import type { ExtendedOptions } from './types';

export async function generateIframeScriptCode(options: ExtendedOptions) {
  const { presets, frameworkPath, framework } = options;
  const frameworkImportPath = frameworkPath || `@storybook/${framework}`;

  const presetEntries = await presets.apply('config', [], options);
  const configEntries = [...presetEntries].filter(Boolean);

  const absoluteFilesToImport = (files: string[], name: string) =>
    files
      .map((el, i) => `import ${name ? `* as ${name}_${i} from ` : ''}'${transformAbsPath(el)}'`)
      .join('\n');

  const importArray = (name: string, length: number) =>
    new Array(length).fill(0).map((_, i) => `${name}_${i}`);

  const code = `
    // Ensure that the client API is initialized by the framework before any other iframe code
    // is loaded. That way our client-apis can assume the existence of the API+store
    import { configure } from '${frameworkImportPath}';

    import {
      addDecorator,
      addParameters,
      addArgTypesEnhancer,
      addArgsEnhancer,
      setGlobalRender
    } from '@storybook/preview-api';
    import { logger } from '@storybook/client-logger';
    ${absoluteFilesToImport(configEntries, 'config')}
    import * as preview from '${virtualPreviewFile}';
    import { configStories } from '${virtualStoriesFile}';

    const configs = [${importArray('config', configEntries.length)
      .concat('preview.default')
      .join(',')}].filter(Boolean)

    configs.forEach(config => {
      Object.keys(config).forEach((key) => {
        const value = config[key];
        switch (key) {
          case 'args':
          case 'argTypes': {
            return logger.warn('Invalid args/argTypes in config, ignoring.', JSON.stringify(value));
          }
          case 'decorators': {
            return value.forEach((decorator) => addDecorator(decorator, false));
          }
          case 'parameters': {
            return addParameters({ ...value }, false);
          }
          case 'render': {
            return setGlobalRender(value)
          }
          case 'globals':
          case 'globalTypes': {
            const v = {};
            v[key] = value;
            return addParameters(v, false);
          }
          case 'decorateStory':
          case 'renderToCanvas': {
            return null;
          }
          default: {
            // eslint-disable-next-line prefer-template
            return console.log(key + ' was not supported :( !');
          }
        }
      });
    })
    configStories(configure);
    `.trim();
  return code;
}
```

```ts filename="index.ts" renderer="common" language="ts"
import { createViteServer } from './vite-server';

let server: ViteDevServer;
export async function bail(): Promise<void> {
  return server?.close();
}

export const start: ViteBuilder['start'] = async ({ options, server: devServer }) => {
  // Remainder implementation goes here
  server = await createViteServer(options as ExtendedOptions, devServer);

  return {
    bail,
    totalTime: process.hrtime(startTime),
  };
};
```

```tsx filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { ColorItem, ColorPalette } from '@storybook/blocks';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

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
export const Colors: Story = {
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

```ts filename="vue/src/client/preview/globals.ts" renderer="common" language="ts"
import { global } from '@storybook/global';

const { window: globalWindow } = global;

globalWindow.STORYBOOK_ENV = 'vue';
```

```ts filename="your-framework/src/client/preview/index.ts" renderer="common" language="ts"
import { start } from '@storybook/preview-api';

import './globals';

import render from './render';

const api = start(render);

// the boilerplate code
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  // Sets the layout parameter component wide.
  parameters: {
    layout: 'centered',
  },
};

export default meta;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// For Vite support add the following import
// import type { AddonOptionsVite } from '@storybook/addon-coverage';

import type { AddonOptionsWebpack } from '@storybook/addon-coverage';

// Replace your-framework with the framework and builder you are using (e.g., react-webpack5, vue3-webpack5)
import type { StorybookConfig } from '@storybook/your-framework';

const coverageConfig: AddonOptionsWebpack = {
  istanbul: {
    include: ['**/stories/**'],
    exclude: ['**/exampleDirectory/**'],
  },
};

const config: StorybookConfig = {
  stories: [],
  addons: [
    // Other Storybook addons
    {
      name: '@storybook/addon-coverage',
      options: coverageConfig,
    },
  ],
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework and builder you are using (e.g., react-webpack5, vue3-webpack5)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  stories: [],
  addons: [
    // Other Storybook addons
    '@storybook/addon-coverage', //👈 Registers the addon
  ],
};

export default config;
```

```ts filename="components/MyComponent/MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  component: MyComponent,
  title: 'components/MyComponent/MyComponent',
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: {
    something: 'Something else',
  },
};
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  managerHead: (head) => `
    ${head}
    <link rel="icon" type="image/png" href="/logo192.png" sizes="192x192" />
  `,
};

export default config;
```

```ts filename="MyComponent.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta } from '@storybook/your-framework';

// ❌ Don't use the package's index file to import the component.
import { MyComponent } from '@component-package';

// ✅ Use the component's export to import it directly.
import { MyComponent } from '@component-package/src/MyComponent';

const meta: Meta<typeof MyComponent> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'MyComponent',
  component: MyComponent,
};

export default meta;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    // Other Storybook addons
    '@storybook/addon-interactions', // 👈 Register the addon
  ],
};

export default config;
```

```ts filename="Form.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { userEvent, waitFor, within, expect, fn } from '@storybook/test';

import { Form } from './Form';

const meta: Meta<typeof Form> = {
  component: Form,
  args: {
    // 👇 Use `fn` to spy on the onSubmit arg
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const Submitted: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { userEvent, within } from '@storybook/test';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const Submitted: Story = {
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

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: [
    {
      directory: '../src',
      titlePrefix: 'Custom', // 👈 Configure the title prefix
    },
  ],
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
import remarkGfm from 'remark-gfm';

// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    check: false,
    checkOptions: {},
    skipCompiler: false,
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    // Other Storybook addons
    '@storybook/addon-designs', // 👈 Addon is registered here
  ],
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    // Overrides the default Typescript configuration to allow multi-package components to be documented via Autodocs.
    reactDocgen: 'react-docgen',
    check: false,
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../my-project/src/components/*.@(js|md)'],
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

import path from 'path';

const getAbsolutePath = (packageName: string): any =>
  path.dirname(require.resolve(path.join(packageName, 'package.json')));

const config: StorybookConfig = {
  framework: {
    // Replace your-framework with the same one you've imported above.
    name: getAbsolutePath('@storybook/your-framework'),
    options: {},
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    //👇 Use getAbsolutePath when referencing Storybook's addons and frameworks
    getAbsolutePath('@storybook/addon-essentials'),
  ],
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials'], // 👈 Register addon-essentials
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  addons: [
    // Other Storybook addons
    '@storybook/addon-a11y',
  ],
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-actions'],
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
   webpackFinal: async (config) => {
    config.plugins.push(...);
    return config;
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
import path from 'path';
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

import custom from '../webpack.config.js'; // 👈 Custom Webpack configuration being imported.

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  webpackFinal: async (config) => {
    return {
      ...config,
      module: { ...config.module, rules: [...config.module.rules, ...custom.module.rules] },
    };
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
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

export default config;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
import * as React from 'react';

// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

import { DocsContainer } from '@storybook/blocks';

const ExampleContainer = ({ children, ...props }) => {
  return <DocsContainer {...props}>{children}</DocsContainer>;
};

const preview: Preview = {
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

export default preview;
```

```ts filename=".storybook/preview.tsx" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/blocks';

const preview: Preview = {
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

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

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

const preview: Preview = {
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

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

import { themes, ensure } from '@storybook/theming';

const preview: Preview = {
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

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: newViewports, // newViewports would be an ViewportMap. (see below for examples)
      defaultViewport: 'someDefault',
    },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
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

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
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

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

import { MyCanvas } from './MyCanvas';

const preview: Preview = {
  parameters: {
    docs: {
      components: {
        Canvas: MyCanvas,
      },
    },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

import { CodeBlock } from './CodeBlock';

const preview: Preview = {
  parameters: {
    docs: {
      components: {
        code: CodeBlock,
      },
    },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
      ],
    },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
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

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    docs: {
      controls: { exclude: ['style'] },
    },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

import { themes } from '@storybook/theming';

const preview: Preview = {
  parameters: {
    docs: {
      theme: themes.dark,
    },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
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

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    docs: {
      toc: true, // 👈 Enables the table of contents
    },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  loaders: [
    async () => ({
      currentUser: await (await fetch('https://jsonplaceholder.typicode.com/users/1')).json(),
    }),
  ],
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [
        { name: 'red', value: '#f00' },
        { name: 'green', value: '#0f0' },
      ],
    },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';

const preview: Preview = {
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

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

import '../src/styles/global.css';

const preview: Preview = {
  parameters: {},
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    layout: 'centered',
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
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

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on.*' },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

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

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: {
        ...MINIMAL_VIEWPORTS,
        ...customViewports,
      },
    },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    docs: {
      // Opt-out of inline rendering
      story: { inline: false },
    },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    controls: {
      presetColors: [{ color: '#ff4785', title: 'Coral' }, 'rgba(0, 159, 183, 1)', '#fe4a49'],
    },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';

// Registers and enables scss language support
SyntaxHighlighter.registerLanguage('scss', scss);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    options: {
      // The `a` and `b` arguments in this function have a type of `import('@storybook/types').IndexEntry`. Remember that the function is executed in a JavaScript environment, so use JSDoc for IntelliSense to introspect it.
      storySort: (a, b) =>
        a.id === b.id ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true }),
    },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., solid, qwik)
import { Preview } from '@storybook/your-framework';

import { MyThemes } from '../my-theme-folder/my-theme-file';

const preview: Preview = {
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

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    viewport: { viewports: customViewports },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Intro', 'Pages', ['Home', 'Login', 'Admin'], 'Components', '*', 'WIP'],
      },
    },
  },
};

export default preview;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Intro', 'Pages', ['Home', 'Login', 'Admin'], 'Components'],
      },
    },
  },
};

export default preview;
```

```ts filename="my-framework/src/server/options.ts" renderer="common" language="ts"
import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'my-framework',
  frameworkPath: '@my-framework/storybook',
  frameworkPresets: [require.resolve('./framework-preset-my-framework.js')],
};
```

```ts filename="vue/src/server/options.ts" renderer="common" language="ts"
import { sync } from 'read-pkg-up';

export default {
  packageJson: sync({ cwd: __dirname }).packageJson,
  framework: 'vue',
  frameworkPresets: [require.resolve('./framework-preset-vue.js')],
};
```

```ts filename="your-framework/src/server/index.ts" renderer="common" language="ts"
import { buildDev } from '@storybook/core/server';

import options from './options';

buildDev(options);
```

```ts filename="Button.stories.ts|tsx" renderer="common" language="ts"
// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const WithLayout: Story = {
  parameters: {
    layout: 'centered',
  },
};
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  // 👇 Storybook will load all existing stories within the MyStories folder
  stories: ['../packages/MyStories'],
};

export default config;
```

```ts filename="NoteUI.stories.ts" renderer="common" language="ts"
// Replace your-renderer with the name of your renderer (e.g. react, vue3)
import type { Meta, StoryObj } from '@storybook/your-renderer';
import { expect, userEvent, within } from '@storybook/test';

// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { saveNote } from '../../app/actions.mock';
import { createNotes } from '../../mocks/notes';
import NoteUI from './note-ui';

const meta: Meta<typeof NoteUI> = {
  title: 'Mocked/NoteUI',
  component: NoteUI,
};
export default meta;

type Story = StoryObj<typeof NoteUI>;

const notes = createNotes();

export const SaveFlow: Story = {
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

```ts filename="lib/session.mock.ts" renderer="common" language="ts"
import { fn } from '@storybook/test';
import * as actual from './session';

export * from './session';
export const getUserFromSession = fn(actual.getUserFromSession).mockName('getUserFromSession');
```

```ts filename="Page.stories.ts" renderer="common" language="ts"
// Replace your-renderer with the name of your renderer (e.g. react, vue3)
import type { Meta, StoryObj } from '@storybook/your-renderer';

// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { getUserFromSession } from '../../api/session.mock';
import { Page } from './Page';

const meta: Meta<typeof Page> = {
  component: Page,
};
export default meta;

type Story = StoryObj<typeof Page>;

export const Default: Story = {
  async beforeEach() {
    // 👇 Set the return value for the getUserFromSession function
    getUserFromSession.mockReturnValue({ id: '1', name: 'Alice' });
  },
};
```

```ts filename=".storybook/main.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., react-vite, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  async viteFinal(config, options) {
    // Add your configuration here
    return config;
  },
};

export default config;
```

```ts filename="Button.stories.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., nextjs, vue3-vite)
import type { Meta } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  //👇 Enables auto-generated documentation for this component and includes all stories in this file
  tags: ['autodocs'],
};
export default meta;
```

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3)
import type { Preview } from '@storybook/your-renderer';

const preview: Preview = {
  // ...rest of preview
  //👇 Enables auto-generated documentation for all stories
  tags: ['autodocs'],
};

export default preview;
```

```ts filename="Page.stories.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., nextjs, vue3-vite)
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Page } from './Page';

const meta: Meta<typeof Page> = {
  component: Page,
  // 👇 Disable auto-generated documentation for this component
  tags: ['!autodocs'],
};
export default meta;
```

```ts filename="Button.stories.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., nextjs, vue3-vite)
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  //👇 Enables auto-generated documentation for this component and includes all stories in this file
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const UndocumentedStory: Story = {
  // 👇 Removes this story from auto-generated documentation
  tags: ['!autodocs'],
};
```

```ts filename="Button.stories.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., nextjs, vue3-vite)
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  /**
   * 👇 All stories in this file will:
   *    - Be included in the docs page
   *    - Not appear in Storybook's sidebar
   */
  tags: ['autodocs', '!dev'],
};
export default meta;
```

```ts filename="Button.stories.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., nextjs, vue3-vite)
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  /**
   * 👇 All stories in this file will have these tags applied:
   *    - autodocs
   *    - dev (implicit default, inherited from preview)
   *    - test (implicit default, inherited from preview)
   */
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const ExperimentalFeatureStory: Story = {
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

```ts filename=".storybook/preview.ts" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3)
import type { Preview } from '@storybook/your-renderer';

const preview: Preview = {
  // ...rest of preview
  /**
   * 👇 All stories in your project will have these tags applied:
   *    - autodocs
   *    - dev (implicit default)
   *    - test (implicit default)
   */
  tags: ['autodocs'],
};

export default preview;
```

```ts filename="Button.stories.ts" renderer="common" language="ts"
// Replace your-framework with the framework you are using (e.g., nextjs, vue3-vite)
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  // 👇 Applies to all stories in this file
  tags: ['stable'],
};
export default meta;

type Story = StoryObj<typeof Button>;

export const ExperimentalFeatureStory: Story = {
  /**
   * 👇 For this particular story, remove the inherited
   *    `stable` tag and apply the `experimental` tag
   */
  tags: ['!stable', 'experimental'],
};
```

```ts filename=".storybook/test-runner.ts" renderer="common" language="ts"
import type { TestRunnerConfig } from '@storybook/test-runner';
import { injectAxe, checkA11y } from 'axe-playwright';

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
const config: TestRunnerConfig = {
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

export default config;
```

```ts filename=".storybook/test-runner.ts" renderer="common" language="ts"
import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';

import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
const config: TestRunnerConfig = {
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

export default config;
```

```ts filename=".storybook/test-runner.ts" renderer="common" language="ts"
import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';

import { injectAxe, checkA11y } from 'axe-playwright';

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
const config: TestRunnerConfig = {
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

export default config;
```

```ts filename=".storybook/test-runner.ts" renderer="common" language="ts"
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  getHttpHeaders: async (url) => {
    const token = url.includes('prod') ? 'prod-token' : 'dev-token';
    return {
      Authorization: `Bearer ${token}`,
    };
  },
};

export default config;
```

```ts filename=".storybook/test-runner.js" renderer="common" language="ts"
import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';

const { MINIMAL_VIEWPORTS } = require('@storybook/addon-viewport');

const DEFAULT_VIEWPORT_SIZE = { width: 1280, height: 720 };

const config: TestRunnerConfig = {
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

export default config;
```

```ts filename=".storybook/test-runner.ts" renderer="common" language="ts"
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    // the #storybook-root element wraps the story. In Storybook 6.x, the selector is #root
    const elementHandler = await page.$('#storybook-root');
    const innerHTML = await elementHandler.innerHTML();
    expect(innerHTML).toMatchSnapshot();
  },
};

export default config;
```

```ts filename=".storybook/test-runner.ts" renderer="common" language="ts"
import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext, waitForPageReady } from '@storybook/test-runner';

const config: TestRunnerConfig = {
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

export default config;
```

```ts filename=".storybook/test-runner.ts" renderer="common" language="ts"
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
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

export default config;
```

```ts filename=".storybook/test-runner.ts" renderer="common" language="ts"
import { TestRunnerConfig, waitForPageReady } from '@storybook/test-runner';

import { toMatchImageSnapshot } from 'jest-image-snapshot';

const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    // Waits for the page to be ready before taking a screenshot to ensure consistent results
    await waitForPageReady(page);

    // To capture a screenshot for for different browsers, add page.context().browser().browserType().name() to get the browser name to prefix the file name
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir,
      customSnapshotIdentifier: context.id,
    });
  },
};
export default config;
```

```ts filename=".storybook/test-runner.ts" renderer="common" language="ts"
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  tags: {
    include: ['test-only', 'pages'],
    exclude: ['no-tests', 'tokens'],
    skip: ['skip-test', 'layout'],
  },
};

export default config;
```

```ts filename=".storybook/test-runner.ts" renderer="common" language="ts"
import type { TestRunnerConfig } from '@storybook/test-runner';

import { waitForPageReady } from '@storybook/test-runner';

import { toMatchImageSnapshot } from 'jest-image-snapshot';

const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

const config: TestRunnerConfig = {
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

export default config;
```

```ts filename="Button.stories.ts" renderer="common" language="ts"
// Replace your-renderer with the renderer you are using (e.g., react, vue3, etc.)
import type { Meta, StoryObj } from '@storybook/your-renderer';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Basic: Story = {};

export const Primary: Story = {
  args: {
    primary: true,
  },
};
```

```ts filename="Button.stories.ts" renderer="html" language="ts"
import type { Meta, StoryObj } from '@storybook/html';

import { createButton, ButtonArgs } from './Button';

const meta: Meta<ButtonArgs> = {
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

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {
  render: (args) => createButton(args),
};
```

```ts filename="Button.stories.ts" renderer="html" language="ts"
import type { Meta } from '@storybook/html';

import { createButton, ButtonArgs } from './Button';

const meta: Meta<ButtonArgs> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="html" language="ts"
import type { Meta, StoryObj } from '@storybook/html';

import { createButton, ButtonArgs } from './Button';

const meta: Meta<ButtonArgs> = {
  render: (args) => createButton(args),
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {
  // 👇 Rename this story
  name: 'I am the primary',
  args: {
    label: 'Button',
    primary: true,
  },
};
```

```ts filename="Button.stories.ts" renderer="html" language="ts"
import type { Meta, StoryObj } from '@storybook/html';
import { createButton, ButtonArgs } from './Button';

const meta: Meta<ButtonArgs> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
};

export default meta;
type Story = StoryObj<ButtonArgs>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args) => createButton(args),
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  render: (args) => createButton(args),
  args: {
    ...Primary.args,
    label: '😄👍😍💯',
  },
};

export const Tertiary: Story = {
  render: (args) => createButton(args),
  args: {
    ...Primary.args,
    label: '📚📕📈🤓',
  },
};
```

```ts filename="Button.stories.ts" renderer="html" language="ts"
import type { Meta, StoryObj } from '@storybook/html';

type ButtonArgs = {
  primary: boolean;
  label: string;
};

const meta: Meta<ButtonArgs> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
};

export default meta;
type Story = StoryObj<ButtonArgs>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
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

```ts filename="Button.stories.ts" renderer="html" language="ts"
import type { Meta, StoryObj } from '@storybook/html';
import { createButton, ButtonArgs } from './Button';

const meta: Meta<ButtonArgs> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
};

export default meta;
type Story = StoryObj<ButtonArgs>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: (args) => createButton({ backgroundColor: '#ff0', label: 'Button' }),
};

export const Secondary: Story = {
  render: (args) => createButton({ backgroundColor: '#ff0', label: '😄👍😍💯' }),
};

export const Tertiary: Story = {
  render: (args) => createButton({ backgroundColor: '#ff0', label: '📚📕📈🤓' }),
};
```

```ts filename="Button.stories.ts" renderer="html" language="ts"
import type { Meta, StoryObj } from '@storybook/html';

const meta: Meta = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Button',
};

export default meta;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: StoryObj = {
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

```ts filename="Histogram.stories.ts" renderer="html" language="ts"
import type { Meta, StoryObj } from '@storybook/html';

import { createHistogram, HistogramProps } from './Histogram';

const meta: Meta<HistogramProps> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Histogram',
};

export default meta;
type Story = StoryObj<HistogramProps>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
  render: (args) => createHistogram(args),
  args: {
    dataType: 'latency',
    showHistogramLabels: true,
    histogramAccentColor: '#1EA7FD',
    label: 'Latency distribution',
  },
};
```

```ts filename="List.stories.ts" renderer="html" language="ts"
import type { Meta, StoryObj } from '@storybook/html';

import { createList, ListArgs } from './List';
import { createListItem } from './ListItem';

const meta: Meta<ListArgs> = {
  title: 'List',
};

export default meta;
type Story = StoryObj<ListArgs>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Empty: Story = {
  render: () => createList(args),
};

export const OneItem: Story = {
  render: (args) => {
    const list = createList(args);
    list.appendChild(createListItem());
    return list;
  },
};

export const ManyItems: Story = {
  render: (args) => {
    const list = createList(args);
    list.appendChild(createListItem());
    list.appendChild(createListItem());
    list.appendChild(createListItem());
    return list;
  },
};
```

```ts filename="List.stories.ts" renderer="html" language="ts"
import type { Meta, StoryObj } from '@storybook/html';

import { createList, ListArgs } from './List';
import { createListItem } from './ListItem';

// 👇 We're importing the necessary stories from ListItem
import { Selected, Unselected } from './ListItem.stories';

const meta: Meta<ListArgs> = {
  title: 'List',
};

export default meta;
type Story = StoryObj<ListArgs>;

export const ManyItems: Story = {
  render: (args) => {
    const list = createList(args);
    list.appendChild(createListItem(Selected.args));
    list.appendChild(createListItem(Unselected.args));
    list.appendChild(createListItem(Unselected.args));
    return list;
  },
};
```

```ts filename="List.stories.ts" renderer="html" language="ts"
import type { Meta, StoryObj } from '@storybook/html';

import { createList, ListArgs } from './List';

const meta: Meta<ListArgs> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
};

export default meta;
type Story = StoryObj<ListArgs>;

// Always an empty list, not super interesting
export const Empty: Story = {
  render: (args) => createList(args),
};
```

```ts filename="YourComponent.stories.ts" renderer="html" language="ts"
import type { Meta, StoryObj } from '@storybook/html';

import { createYourComponent, ComponentProps } from './YourComponent';

//👇 This default export determines where your story goes in the story list
const meta: Meta<ComponentProps> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'YourComponent',
};

export default meta;
type Story = StoryObj<ComponentProps>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const FirstStory: Story = {
  render: (args) => createYourComponent(args),
  args: {
    // 👇 The args you need here will depend on your component
  },
};
```

```ts filename="MyComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT, RESET_HIGHLIGHT } from '@storybook/addon-highlight';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const ResetHighlight: Story = {
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

```tsx filename="Button.ts|tsx" renderer="react" language="ts"
export interface ButtonProps {
  /**
   * Checks if the button should be disabled
   */
  isDisabled: boolean;
  /**
  The display content of the button
  */
  content: string;
}

export const Button: React.FC<ButtonProps> = ({ isDisabled = false, content = '' }) => {
  return (
    <button type="button" disabled={isDisabled}>
      {content}
    </button>
  );
};
```

```ts filename="ButtonGroup.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { ButtonGroup } from '../ButtonGroup';

//👇 Imports the Button stories
import * as ButtonStories from './Button.stories';

const meta: Meta<typeof ButtonGroup> = {
  component: ButtonGroup,
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Pair: Story = {
  args: {
    buttons: [{ ...ButtonStories.Primary.args }, { ...ButtonStories.Secondary.args }],
    orientation: 'horizontal',
  },
};
```

```tsx filename="Button.ts|tsx" renderer="react" language="ts"
export interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Primary UI component for user interaction
 */
export const Button: React.FC<ButtonProps> = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}) => {
  // the component implementation
};
```

```ts filename="Button.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { action } from '@storybook/addon-actions';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Text = {
  args: {
    label: 'Hello',
    onClick: action('clicked'),
  },
  render: ({ label, onClick }) => <Button label={label} onClick={onClick} />,
};
```

```ts filename="Button.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Text: Story = {
  args: {},
};
```

```ts filename="Button.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { action } from '@storybook/addon-actions';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  render: () => <Button label="Hello" onClick={action('clicked')} />,
};
```

```ts filename="Button.stories.ts|tsx" renderer="react" language="ts"
import type { Meta } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
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

export default meta;
type Story = StoryObj<typeof Button>;
```

```ts filename="Button.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
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

```ts filename="Button.stories.ts|tsx" renderer="react" language="ts"
import type { Meta } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  // 👇 Rename this story
  name: 'I am the primary',
  args: {
    label: 'Button',
    primary: true,
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    backgroundColor: '#ff0',
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    label: '😄👍😍💯',
  },
};

export const Tertiary: Story = {
  args: {
    ...Primary.args,
    label: '📚📕📈🤓',
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
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

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Basic: Story = {
  render: () => <Button>Hello</Button>,
};
```

```ts filename="Button.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Button, ButtonProps } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <Button backgroundColor="#ff0" label="Button" />,
};

export const Secondary: Story = {
  render: () => <Button backgroundColor="#ff0" label="😄👍😍💯" />,
};

export const Tertiary: Story = {
  render: () => <Button backgroundColor="#ff0" label="📚📕📈🤓" />,
};
```

```ts filename="Button.stories.ts|tsx" renderer="react" language="ts"
import { Button } from './Button';

import type { Meta } from '@storybook/react';

const meta: Meta<typeof Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <Button primary label="Button" />,
};
```

```tsx filename="YourComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { YourComponent } from './your-component';

const meta: Meta<typeof YourComponent> = {
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

export default meta;
type Story = StoryObj<typeof YourComponent>;

const someFunction = (valuePropertyA, valuePropertyB) => {
  // Do some logic here
};

export const ExampleStory: Story = {
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

```ts filename="MyComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { MyComponent } from './MyComponent';

// More on default export: https://storybook.js.org/docs/writing-stories/#default-export
const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Example: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Sample-File',
    },
  },
};
```

```ts filename="MyComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT } from '@storybook/addon-highlight';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Highlighted: Story = {
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

```tsx filename=" MyComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const WithAnImage: Story = {
  render: () => (
    <img src="https://storybook.js.org/images/placeholders/350x150.png" alt="My CDN placeholder" />
  ),
};
```

```tsx filename=" MyComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import imageFile from './static/image.png';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

const image = {
  src: imageFile,
  alt: 'my image',
};

export const WithAnImage: Story = {
  render: () => <img src={image.src} alt={image.alt} />,
};
```

```tsx filename=" MyComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

// Assume image.png is located in the "public" directory.
export const WithAnImage: Story = {
  render: () => <img src="/image.png" alt="my image" />,
};
```

```ts filename="Button.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// This is an accessible story
export const Accessible: Story = {
  args: {
    primary: false,
    label: 'Button',
  },
};

// This is not
export const Inaccessible: Story = {
  args: {
    ...Accessible.args,
    backgroundColor: 'red',
  },
};
```

```tsx filename="MyComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Layout } from './Layout';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

// This story uses a render function to fully control how the component renders.
export const Example: Story = {
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

```ts filename="Form.test.ts|tsx" renderer="react" language="ts"
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

```ts filename="Button.stories.ts" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

// Wrapped in light theme
export const Default: Story = {};

// Wrapped in dark theme
export const Dark: Story = {
  parameters: {
    theme: 'dark',
  },
};
```

```tsx filename="CSF 2" renderer="react" language="ts"
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Button } from './Button';

export default {
  title: 'Button',
  component: Button,
} as ComponentMeta<typeof Button>;

export const Primary: ComponentStory<typeof Button> = (args) => <Button {...args} />;
Primary.args = { primary: true };
```

```ts filename="CSF 2" renderer="react" language="ts"
// Other imports and story implementation
export const Default: ComponentStory<typeof Button> = (args) => <Button {...args} />;
```

```ts filename="CSF 3 - explicit render function" renderer="react" language="ts"
// Other imports and story implementation
export const Default: Story = {
  render: (args) => <Button {...args} />,
};
```

```ts filename="CSF 3" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = { component: Button };
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { primary: true } };
```

```tsx filename=".storybook/preview.tsx" renderer="react" language="ts"
import React from 'react';

import type { Preview } from '@storybook/react';

const preview: Preview = {
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

export default preview;
```

```ts filename="YourPage.tsx" renderer="react" language="ts"
import React, { useState, useEffect } from 'react';

import { PageLayout } from './PageLayout';
import { DocumentHeader } from './DocumentHeader';
import { DocumentList } from './DocumentList';

// Example hook to retrieve data from an external endpoint
function useFetchData() {
  const [status, setStatus] = useState<string>('idle');
  const [data, setData] = useState<any[]>([]);
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

```ts filename="YourPage.ts|tsx" renderer="react" language="ts"
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

interface Data {
  allInfo: {
    user: {
      userID: number;
      name: string;
      opening_crawl: boolean;
    };
    document: {
      id: number;
      userID: number;
      title: string;
      brief: string;
      status: string;
    };
    subdocuments: {
      id: number;
      userID: number;
      title: string;
      content: string;
      status: string;
    };
  };
}

function useFetchInfo() {
  const { loading, error, data } = useQuery<Data>(AllInfoQuery);

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

```ts filename="MyComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT } from '@storybook/addon-highlight';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const StyledHighlight: Story = {
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

```ts filename="Histogram.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Histogram } from './Histogram';

const meta: Meta<typeof Histogram> = {
  component: Histogram,
};

export default meta;
type Story = StoryObj<typeof Histogram>;

export const Default: Story = {
  args: {
    dataType: 'latency',
    showHistogramLabels: true,
    histogramAccentColor: '#1EA7FD',
    label: 'Latency distribution',
  },
};
```

```tsx filename="List.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { List } from './List';
import { ListItem } from './ListItem';

const meta: Meta<typeof List> = {
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

export const Empty: Story = {};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const OneItem: Story = {
  render: (args) => (
    <List {...args}>
      <ListItem />
    </List>
  ),
};

export const ManyItems: Story = {
  render: (args) => (
    <List {...args}>
      <ListItem />
      <ListItem />
      <ListItem />
    </List>
  ),
};
```

```tsx filename="List.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { List } from './List';
import { ListItem } from './ListItem';

//👇 We're importing the necessary stories from ListItem
import { Selected, Unselected } from './ListItem.stories';

const meta: Meta<typeof List> = {
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

export const ManyItems: Story = {
  render: (args) => (
    <List {...args}>
      <ListItem {...Selected.args} />
      <ListItem {...Unselected.args} />
      <ListItem {...Unselected.args} />
    </List>
  ),
};
```

```ts filename="List.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { List } from './List';

const meta: Meta<typeof List> = {
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

//👇 Always an empty list, not super interesting
export const Empty: Story = {};
```

```ts filename="List.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { List } from './List';
import { ListItem } from './ListItem';

//👇 Imports a specific story from ListItem stories
import { Unchecked } from './ListItem.stories';

const meta: Meta<typeof List> = {
  /* 👇 The title prop is optional.
   * Seehttps://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

//👇 The ListTemplate construct will be spread to the existing stories.
const ListTemplate: Story = {
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
    items: [{ ...Unchecked.args }],
  },
};
```

```tsx filename="List.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { List } from './List';

//👇 Instead of importing ListItem, we import the stories
import { Unchecked } from './ListItem.stories';

export const meta: Meta<typeof List> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

export const OneItem: Story = {
  render: (args) => (
    <List {...args}>
      <Unchecked {...Unchecked.args} />
    </List>
  ),
};
```

```tsx filename="List.stories.ts|tsx" renderer="react" language="ts"
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { List } from './List';
import { ListItem } from './ListItem';

const meta: Meta<typeof List> = {
  component: List,
  subcomponents: { ListItem }, //👈 Adds the ListItem component as a subcomponent
};
export default meta;

type Story = StoryObj<typeof List>;

export const Empty: Story = {};

export const OneItem: Story = {
  render: (args) => (
    <List {...args}>
      <ListItem />
    </List>
  ),
};
```

```ts filename="List.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { List } from './List';

//👇 Instead of importing ListItem, we import the stories
import { Unchecked } from './ListItem.stories';

const meta: Meta<typeof List> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

export const OneItem: Story = {
  args: {
    children: <Unchecked {...Unchecked.args} />,
  },
};
```

```tsx filename="MyComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import fetch from 'node-fetch';

import { TodoItem } from './TodoItem';

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
const meta: Meta<typeof TodoItem> = {
  component: TodoItem,
  render: (args, { loaded: { todo } }) => <TodoItem {...args} {...todo} />,
};

export default meta;
type Story = StoryObj<typeof TodoItem>;

export const Primary: Story = {
  loaders: [
    async () => ({
      todo: await (await fetch('https://jsonplaceholder.typicode.com/todos/1')).json(),
    }),
  ],
};
```

```ts filename="LoginForm.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { userEvent, within, expect } from '@storybook/test';

import { LoginForm } from './LoginForm';

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const EmptyForm: Story = {};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm: Story = {
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

```ts filename=".storybook/main.ts" renderer="react" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, react-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      // 👇 Default prop filter, which excludes props from node_modules
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="react" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, react-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    reactDocgen: 'react-docgen',
  },
};

export default config;
```

```ts filename=".storybook/preview.ts" renderer="react" language="ts"
import React from 'react';

// Replace your-framework with the framework you are using (e.g., react, vue3)
import { Preview } from '@storybook/your-framework';

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

const preview: Preview = {
  decorators: [AppDecorator],
};

export default preview;
```

```tsx filename=".storybook/preview.tsx" renderer="react" language="ts"
import React from 'react';

import type { Preview } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

// themes = { light, dark }
import * as themes from '../src/themes';

const preview: Preview = {
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

export default preview;
```

```ts filename="YourPage.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

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
const meta: Meta<typeof DocumentScreen> = {
  component: DocumentScreen,
  decorators: [
    (Story) => (
      <ApolloProvider client={mockedClient}>
        <Story />
      </ApolloProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SampleComponent>;

export const MockedSuccess: Story = {
  parameters: {
    msw: {
      handlers: [
        graphql.query('AllInfoQuery', () => {
          return new HttpResponse.json({
            data: {
              allInfo: {
                ...TestData,
              },
            }
          });
        }),
      ],
    },
  },
};

export const MockedError: Story = {
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

```ts filename="Form.test.ts|tsx" renderer="react" language="ts"
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

```tsx filename="MyComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Basic: Story = {};

export const WithProp: Story = {
  render: () => <MyComponent prop="value" />,
};
```

```ts filename="MyComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
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

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const MyStory: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
};
```

```tsx filename="MyComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

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

```ts filename="MyComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { MyComponent } from './MyComponent';

import someData from './data.json';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
  includeStories: ['SimpleStory', 'ComplexStory'], // 👈 Storybook loads these stories
  excludeStories: /.*Data$/, // 👈 Storybook ignores anything that contains Data
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const simpleData = { foo: 1, bar: 'baz' };
export const complexData = { foo: 1, foobar: { bar: 'baz', baz: someData } };

export const SimpleStory: Story = {
  args: {
    data: simpleData,
  },
};

export const ComplexStory: Story = {
  args: {
    data: complexData,
  },
};
```

```ts filename=".storybook/main.ts" renderer="react" language="ts"
import { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  // ...
  // framework: '@storybook/react-webpack5', 👈 Remove this
  framework: '@storybook/nextjs', // 👈 Add this
};

export default config;
```

```ts filename="NavigationBasedComponent.stories.ts" renderer="react" language="ts"
import { Meta, StoryObj } from '@storybook/react';

import NavigationBasedComponent from './NavigationBasedComponent';

const meta: Meta<typeof NavigationBasedComponent> = {
  component: NavigationBasedComponent,
  parameters: {
    nextjs: {
      appDirectory: true, // 👈 Set this
    },
  },
};
export default meta;
```

```ts filename=".storybook/preview.ts" renderer="react" language="ts"
import { Preview } from '@storybook/react';

const preview: Preview = {
  // ...
  parameters: {
    // ...
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
```

```ts filename="MyForm.stories.ts" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { revalidatePath } from '@storybook/nextjs/cache.mock';

import MyForm from './my-form';

const meta: Meta<typeof MyForm> = {
  component: MyForm,
};

export default meta;

type Story = StoryObj<typeof MyForm>;

export const Submitted: Story = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);

    const submitButton = canvas.getByRole('button', { name: /submit/i });
    await userEvent.click(saveButton);
    // 👇 Use any mock assertions on the function
    await expect(revalidatePath).toHaveBeenCalledWith('/');
  },
};
```

```ts filename=".storybook/main.ts" renderer="react" language="ts"
import { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
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

export default config;
```

```ts filename="MyForm.stories.ts" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, userEvent, within } from '@storybook/test';
// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { cookies, headers } from '@storybook/nextjs/headers.mock';

import MyForm from './my-form';

const meta: Meta<typeof MyForm> = {
  component: MyForm,
};

export default meta;

type Story = StoryObj<typeof MyForm>;

export const LoggedInEurope: Story = {
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

```ts filename=".storybook/main.ts" renderer="react" language="ts"
import { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  // ...
  staticDirs: [
    {
      from: '../src/components/fonts',
      to: 'src/components/fonts',
    },
  ],
};

export default config;
```

```ts filename="MyForm.stories.ts" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, userEvent, within } from '@storybook/test';
// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { redirect, getRouter } from '@storybook/nextjs/navigation.mock';

import MyForm from './my-form';

const meta: Meta<typeof MyForm> = {
  component: MyForm,
  parameters: {
    nextjs: {
      // 👇 As in the Next.js application, next/navigation only works using App Router
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof MyForm>;

export const Unauthenticated: Story = {
  async play() => {
    // 👇 Assert that your component called redirect()
    await expect(redirect).toHaveBeenCalledWith('/login', 'replace');
  },
};

export const GoBack: Story = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const backBtn = await canvas.findByText('Go back');

    await userEvent.click(backBtn);
    // 👇 Assert that your component called back()
    await expect(getRouter().back).toHaveBeenCalled();
  },
};
```

```ts filename="NavigationBasedComponent.stories.ts" renderer="react" language="ts"
import { Meta, StoryObj } from '@storybook/react';

import NavigationBasedComponent from './NavigationBasedComponent';

const meta: Meta<typeof NavigationBasedComponent> = {
  component: NavigationBasedComponent,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};
export default meta;

type Story = StoryObj<typeof NavigationBasedComponent>;

// If you have the actions addon,
// you can interact with the links and see the route change events there
export const Example: Story = {
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

```ts filename="NavigationBasedComponent.stories.ts" renderer="react" language="ts"
import { Meta, StoryObj } from '@storybook/react';

import NavigationBasedComponent from './NavigationBasedComponent';

const meta: Meta<typeof NavigationBasedComponent> = {
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
export default meta;
```

```ts filename="NavigationBasedComponent.stories.ts" renderer="react" language="ts"
import { Meta, StoryObj } from '@storybook/react';

import NavigationBasedComponent from './NavigationBasedComponent';

const meta: Meta<typeof NavigationBasedComponent> = {
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
export default meta;
```

```ts filename=".storybook/main.ts" renderer="react" language="ts"
import { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  // ...
  addons: [
    // ...
    // 👇 These can both be removed
    // 'storybook-addon-next',
    // 'storybook-addon-next-router',
  ],
};

export default config;
```

```ts filename="MyForm.stories.ts" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, userEvent, within } from '@storybook/test';
// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { getRouter } from '@storybook/nextjs/router.mock';

import MyForm from './my-form';

const meta: Meta<typeof MyForm> = {
  component: MyForm,
};

export default meta;

type Story = StoryObj<typeof MyForm>;

export const GoBack: Story = {
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const backBtn = await canvas.findByText('Go back');

    await userEvent.click(backBtn);
    // 👇 Assert that your component called back()
    await expect(getRouter().back).toHaveBeenCalled();
  },
};
```

```ts filename="RouterBasedComponent.stories.ts" renderer="react" language="ts"
import { Meta, StoryObj } from '@storybook/react';

import RouterBasedComponent from './RouterBasedComponent';

const meta: Meta<typeof RouterBasedComponent> = {
  component: RouterBasedComponent,
};
export default meta;

type Story = StoryObj<typeof RouterBasedComponent>;

// If you have the actions addon,
// you can interact with the links and see the route change events there
export const Example: Story = {
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

```ts filename="my-component/component.stories.ts|tsx" renderer="react" language="ts"
import { StoryObj, Meta } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Inputs/Checkbox',
  component: Checkbox,
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Example: Story = {
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

```tsx filename="Page.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Page } from './Page';

type PagePropsAndCustomArgs = React.ComponentProps<typeof Page> & { footer?: string };

const meta: Meta<PagePropsAndCustomArgs> = {
  component: Page,
  render: ({ footer, ...args }) => (
    <Page {...args}>
      <footer>{footer}</footer>
    </Page>
  ),
};
export default meta;

type Story = StoryObj<PagePropsAndCustomArgs>;

export const CustomFooter: Story = {
  args: {
    footer: 'Built with Storybook',
  },
};
```

```ts filename="Page.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Page } from './Page';

//👇 Imports all Header stories
import * as HeaderStories from './Header.stories';

const meta: Meta<typeof Page> = {
  component: Page,
};

export default meta;
type Story = StoryObj<typeof Page>;

export const LoggedIn: Story = {
  args: {
    ...HeaderStories.LoggedIn.args,
  },
};
```

```tsx filename="Button.test.tsx" renderer="react" language="ts"
import { test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
// 👉 Using Next.js? Import from @storybook/nextjs instead
import { composeStories } from '@storybook/react';

// Import all stories and the component annotations from the stories file
import * as stories from './Button.stories';

// Every component that is returned maps 1:1 with the stories,
// but they already contain all annotations from story, meta, and project levels
const { Primary, Secondary } = composeStories(stories);

test('renders primary button with default args', () => {
  render(<Primary />);
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});

test('renders primary button with overridden props', () => {
  // You can override props and they will get merged with values from the story's args
  render(<Primary>Hello world</Primary>);
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

```tsx filename="Button.test.tsx" renderer="react" language="ts"
import { jest, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
// 👉 Using Next.js? Import from @storybook/nextjs instead
import { composeStory } from '@storybook/react';

import meta, { Primary } from './Button.stories';

test('onclick handler is called', () => {
  // Returns a story which already contains all annotations from story, meta and global levels
  const PrimaryStory = composeStory(Primary, meta);

  const onClickSpy = jest.fn();
  render(<PrimaryStory onClick={onClickSpy} />);
  const buttonElement = screen.getByRole('button');
  buttonElement.click();
  expect(onClickSpy).toHaveBeenCalled();
});
```

```tsx filename="Button.test.tsx" renderer="react" language="ts"
import { test } from '@jest/globals';
import { render } from '@testing-library/react';
// 👉 Using Next.js? Import from @storybook/nextjs instead
import { composeStory } from '@storybook/react';

import meta, { Primary } from './Button.stories';

test('renders in English', async () => {
  const PrimaryStory = composeStory(
    Primary,
    meta,
    { globals: { locale: 'en' } }, // 👈 Project annotations to override the locale
  );

  render(<PrimaryStory />);
});

test('renders in Spanish', async () => {
  const PrimaryStory = composeStory(Primary, meta, { globals: { locale: 'es' } });

  render(<PrimaryStory />);
});
```

```tsx filename="Button.test.tsx" renderer="react" language="ts"
import { test } from '@jest/globals';
import { render } from '@testing-library/react';
// 👉 Using Next.js? Import from @storybook/nextjs instead
import { composeStory } from '@storybook/react';

import meta, { Primary } from './Button.stories';

test('applies the loaders and renders', async () => {
  const PrimaryStory = composeStory(Primary, meta);

  // First, load the data for the story
  await PrimaryStory.load();

  // Then, render the story
  render(<PrimaryStory />);
});
```

```tsx filename="Button.test.tsx" renderer="react" language="ts"
import { test } from '@jest/globals';
import { render } from '@testing-library/react';
// 👉 Using Next.js? Import from @storybook/nextjs instead
import { composeStory } from '@storybook/react';

import meta, { Primary } from './Button.stories';

test('renders and executes the play function', async () => {
  const PrimaryStory = composeStory(Primary, meta);

  // First, render the story
  render(<PrimaryStory />);

  // Then, execute the play function
  await PrimaryStory.play();
});
```

```tsx filename="Button.playwright.test.tsx" renderer="react" language="ts"
import { createTest } from '@storybook/react/experimental-playwright';
import { test as base } from '@playwright/experimental-ct-react';

// See explanation below for `.portable` stories file
import stories from './Button.stories.portable';

const test = createTest(base);

test('renders primary button', async ({ mount }) => {
  // The mount function will execute all the necessary steps in the story,
  // such as loaders, render, and play function
  await mount(<stories.Primary />);
});

test('renders primary button with overridden props', async ({ mount }) => {
  // You can pass custom props to your component via JSX
  const component = await mount(<stories.Primary label="label from test" />);
  await expect(component).toContainText('label from test');
  await expect(component.getByRole('button')).toHaveClass(/storybook-button--primary/);
});
```

```tsx filename="Button.test.tsx" renderer="react" language="ts"
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';

// Import all stories and the component annotations from the stories file
import * as stories from './Button.stories';

// Every component that is returned maps 1:1 with the stories,
// but they already contain all annotations from story, meta, and project levels
const { Primary, Secondary } = composeStories(stories);

test('renders primary button with default args', () => {
  render(<Primary />);
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});

test('renders primary button with overridden props', () => {
  // You can override props and they will get merged with values from the story's args
  render(<Primary>Hello world</Primary>);
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

```tsx filename="Button.test.tsx" renderer="react" language="ts"
import { vi, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStory } from '@storybook/react';

import meta, { Primary } from './Button.stories';

test('onclick handler is called', () => {
  // Returns a story which already contains all annotations from story, meta and global levels
  const PrimaryStory = composeStory(Primary, meta);

  const onClickSpy = vi.fn();
  render(<PrimaryStory onClick={onClickSpy} />);
  const buttonElement = screen.getByRole('button');
  buttonElement.click();
  expect(onClickSpy).toHaveBeenCalled();
});
```

```tsx filename="Button.test.tsx" renderer="react" language="ts"
import { test } from 'vitest';
import { render } from '@testing-library/react';
import { composeStory } from '@storybook/react';

import meta, { Primary } from './Button.stories';

test('renders in English', async () => {
  const PrimaryStory = composeStory(
    Primary,
    meta,
    { globals: { locale: 'en' } }, // 👈 Project annotations to override the locale
  );

  render(<PrimaryStory />);
});

test('renders in Spanish', async () => {
  const PrimaryStory = composeStory(Primary, meta, { globals: { locale: 'es' } });

  render(<PrimaryStory />);
});
```

```tsx filename="Button.test.tsx" renderer="react" language="ts"
import { test } from 'vitest';
import { render } from '@testing-library/react';
import { composeStory } from '@storybook/react';

import meta, { Primary } from './Button.stories';

test('applies the loaders and renders', async () => {
  const PrimaryStory = composeStory(Primary, meta);

  // First, load the data for the story
  await PrimaryStory.load();

  // Then, render the story
  render(<PrimaryStory />);
});
```

```tsx filename="Button.test.tsx" renderer="react" language="ts"
import { test } from 'vitest';
import { render } from '@testing-library/react';
import { composeStory } from '@storybook/react';

import meta, { Primary } from './Button.stories';

test('renders and executes the play function', async () => {
  const PrimaryStory = composeStory(Primary, meta);

  // First, render the story
  render(<PrimaryStory />);

  // Then, execute the play function
  await PrimaryStory.play();
});
```

```ts filename=".storybook/main.ts" renderer="react" language="ts"
import { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // ...
  // framework: '@storybook/react-webpack5', 👈 Remove this
  framework: '@storybook/react-vite', // 👈 Add this
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="react" language="ts"
import { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  // ...
  framework: '@storybook/react-webpack5', // 👈 Add this
};

export default config;
```

```ts filename="Button.test.ts|tsx" renderer="react" language="ts"
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

```ts filename=".storybook/main.ts" renderer="react" language="ts"
import { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  // ...
  features: {
    experimentalRSC: true,
  },
};

export default config;
```

```ts filename="MyServerComponent.stories.ts" renderer="react" language="ts"
import { Meta, StoryObj } from '@storybook/react';

import MyServerComponent from './MyServerComponent';

const meta: Meta<typeof MyServerComponent> = {
  component: MyServerComponent,
  parameters: {
    react: { rsc: false },
  },
};
export default meta;
```

```tsx filename="YourPage.ts|tsx" renderer="react" language="ts"
import PageLayout from './PageLayout';
import Document from './Document';
import SubDocuments from './SubDocuments';
import DocumentHeader from './DocumentHeader';
import DocumentList from './DocumentList';

export interface DocumentScreenProps {
  user?: {};
  document?: Document;
  subdocuments?: SubDocuments[];
}

export function DocumentScreen({ user, document, subdocuments }: DocumentScreenProps) {
  return (
    <PageLayout user={user}>
      <DocumentHeader document={document} />
      <DocumentList documents={subdocuments} />
    </PageLayout>
  );
}
```

```ts filename="Form.test.ts|tsx" renderer="react" language="ts"
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

```ts filename="MyComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const NonA11yStory: Story = {
  parameters: {
    a11y: {
      // This option disables all a11y checks on this story
      disable: true,
    },
  },
};
```

```ts filename="MyComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const ExampleStory: Story = {
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

```ts filename=".storybook/main.ts" renderer="react" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, react-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen',
    reactDocgenTypescriptOptions: {}, // Available only when reactDocgen is set to 'react-docgen-typescript'
    skipCompiler: true,
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="react" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, react-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      // Filter out third-party props from node_modules except @mui packages.
      propFilter: (prop) =>
        prop.parent ? !/node_modules\/(?!@mui)/.test(prop.parent.fileName) : true,
    },
  },
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="react" language="ts"
// Replace your-framework with the framework you are using (e.g., react-webpack5, react-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    // Provide your own options if necessary.
    // See https://storybook.js.org/docs/configure/typescript for more information.
    reactDocgenTypescriptOptions: {},
  },
};

export default config;
```

```tsx filename=".storybook/preview.tsx" renderer="react" language="ts"
import React from 'react';

import { Preview } from '@storybook/react';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};

export default preview;
```

```tsx filename=".storybook/preview.ts|tsx" renderer="react" language="ts"
import type { Preview } from '@storybook/react';

import { ThemeProvider } from 'styled-components';

import { MyThemes } from '../my-theme-folder/my-theme-file';

const preview: Preview = {
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

```tsx filename=".storybook/preview.tsx" renderer="react" language="ts"
import React from 'react';

import { Preview } from '@storybook/react';

import { ThemeProvider } from 'styled-components';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme="default">
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
```

```tsx filename="Button.stories.tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Variant1: Story = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 1 },
};

export const Variant2: Story = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 2 },
};

// Etc...

export const Combo: Story = {
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

```ts filename="YourComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta } from '@storybook/react';

import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
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

export default meta;
```

```ts filename="YourComponent.stories.ts|tsx" renderer="react" language="ts"
import type { Meta, StoryObj } from '@storybook/react';

import { YourComponent } from './YourComponent';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof YourComponent> = {
  component: YourComponent,
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

export const FirstStory: Story = {
  args: {
    //👇 The args you need here will depend on your component
  },
};
```

```tsx filename="ButtonGroup.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { ButtonGroup } from '../ButtonGroup';

//👇 Imports the Button stories
import * as ButtonStories from './Button.stories';

const meta: Meta<typeof ButtonGroup> = {
  component: ButtonGroup,
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Pair: Story = {
  args: {
    buttons: [{ ...ButtonStories.Primary.args }, { ...ButtonStories.Secondary.args }],
    orientation: 'horizontal',
  },
};
```

```ts filename="Button.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { action } from '@storybook/addon-actions';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Text = {
  args: {
    label: 'Hello',
    onClick: action('clicked'),
  },
  render: ({ label, onClick }) => <Button label={label} onClick={onClick} />,
};
```

```ts filename="Button.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Text: Story = {
  args: {},
};
```

```tsx filename="Button.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { action } from '@storybook/addon-actions';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Basic: Story = {
  render: () => <Button label="Hello" onClick={action('clicked')} />,
};
```

```tsx filename="Button.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
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

export default meta;
type Story = StoryObj<typeof Button>;
```

```tsx filename="Button.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta } from 'storybook-solidjs';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
```

```ts filename="Button.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
};
```

```tsx filename="Button.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta } from 'storybook-solidjs';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
```

```tsx filename="Button.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  // 👇 Rename this story
  name: 'I am the primary',
  args: {
    label: 'Button',
    primary: true,
  },
};
```

```tsx filename="Button.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    backgroundColor: '#ff0',
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    label: '😄👍😍💯',
  },
};

export const Tertiary: Story = {
  args: {
    ...Primary.args,
    label: '📚📕📈🤓',
  },
};
```

```tsx filename="Button.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
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

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Basic: Story = {
  render: () => <Button>Hello</Button>,
};
```

```tsx filename="Button.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};
```

```tsx filename="Button.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <Button backgroundColor="#ff0" label="Button" />,
};

export const Secondary: Story = {
  render: () => <Button backgroundColor="#ff0" label="😄👍😍💯" />,
};

export const Tertiary: Story = {
  render: () => <Button backgroundColor="#ff0" label="📚📕📈🤓" />,
};
```

```tsx filename="Button.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <Button primary label="Button" />,
};
```

```tsx filename="YourComponent.stories.ts|tsx" renderer="solid" language="ts"
import { createSignal, createEffect } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { YourComponent } from './your-component';

const meta: Meta<typeof YourComponent> = {
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

export default meta;
type Story = StoryObj<typeof YourComponent>;

const someFunction = (valuePropertyA, valuePropertyB) => {
  // Do some logic here
};

export const ExampleStory: Story = {
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

```tsx filename="MyComponent.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Example: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Sample-File',
    },
  },
};
```

```tsx filename=" MyComponent.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const WithAnImage: Story = {
  render: () => (
    <img src="https://storybook.js.org/images/placeholders/350x150.png" alt="My CDN placeholder" />
  ),
};
```

```tsx filename=" MyComponent.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import imageFile from './static/image.png';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

const image = {
  src: imageFile,
  alt: 'my image',
};

export const WithAnImage: Story = {
  render: () => <img src={image.src} alt={image.alt} />,
};
```

```tsx filename=" MyComponent.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

// Assume image.png is located in the "public" directory.
export const WithAnImage: Story = {
  render: () => <img src="/image.png" alt="my image" />,
};
```

```tsx filename="Button.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// This is an accessible story
export const Accessible: Story = {
  args: {
    primary: false,
    label: 'Button',
  },
};

// This is not
export const Inaccessible: Story = {
  args: {
    ...Accessible.args,
    backgroundColor: 'red',
  },
};
```

```tsx filename="MyComponent.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Layout } from './Layout';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

// This story uses a render function to fully control how the component renders.
export const Example: Story = {
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

```tsx filename="CSF 2" renderer="solid" language="ts"
import { ComponentStory, ComponentMeta } from 'storybook-solidjs';

import { Button } from './Button';

export default {
  title: 'Button',
  component: Button,
} as ComponentMeta<typeof Button>;

export const Primary: ComponentStory<typeof Button> = (args) => <Button {...args} />;
Primary.args = { primary: true };
```

```ts filename="CSF 2" renderer="solid" language="ts"
// Other imports and story implementation
export const Default: ComponentStory<typeof Button> = (args) => <Button {...args} />;
```

```ts filename="CSF 3 - explicit render function" renderer="solid" language="ts"
// Other imports and story implementation
export const Default: Story = {
  render: (args) => <Button {...args} />,
};
```

```ts filename="CSF 3" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Button } from './Button';

const meta: Meta<typeof Button> = { component: Button };
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { primary: true } };
```

```tsx filename=".storybook/preview.tsx" renderer="solid" language="ts"
import { Preview } from 'storybook-solidjs';

const preview: Preview = {
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

export default preview;
```

```ts filename="YourPage.ts|tsx" renderer="solid" language="ts"
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

interface Data {
  allInfo: {
    user: {
      userID: number;
      name: string;
      opening_crawl: boolean;
    };
    document: {
      id: number;
      userID: number;
      title: string;
      brief: string;
      status: string;
    };
    subdocuments: {
      id: number;
      userID: number;
      title: string;
      content: string;
      status: string;
    };
  };
}

function useFetchInfo() {
  const [data] = newQuery<Data>(AllInfoQuery, { path: 'home' });
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

```ts filename="Histogram.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Histogram } from './Histogram';

const meta: Meta<typeof Histogram> = {
  component: Histogram,
};

export default meta;
type Story = StoryObj<typeof Histogram>;

export const Default: Story = {
  args: {
    dataType: 'latency',
    showHistogramLabels: true,
    histogramAccentColor: '#1EA7FD',
    label: 'Latency distribution',
  },
};
```

```tsx filename="List.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { List } from './List';
import { ListItem } from './ListItem';

const meta: Meta<typeof List> = {
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

export const Empty: Story = {};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const OneItem: Story = {
  render: (args) => (
    <List {...args}>
      <ListItem />
    </List>
  ),
};

export const ManyItems: Story = {
  render: (args) => (
    <List {...args}>
      <ListItem />
      <ListItem />
      <ListItem />
    </List>
  ),
};
```

```tsx filename="List.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { List } from './List';
import { ListItem } from './ListItem';

//👇 All ListItem stories are imported
import { Selected, Unselected } from './ListItem.stories';

const meta: Meta<typeof List> = {
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

export const ManyItems: Story = {
  render: (args) => (
    <List {...args}>
      <ListItem {...Selected.args} />
      <ListItem {...Unselected.args} />
      <ListItem {...Unselected.args} />
    </List>
  ),
};
```

```tsx filename="List.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { List } from './List';

const meta: Meta<typeof List> = {
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

//👇 Always an empty list, not super interesting
export const Empty: Story = {};
```

```tsx filename="List.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { List } from './List';
import { ListItem } from './ListItem';

//👇 Imports a specific story from ListItem stories
import { Unchecked } from './ListItem.stories';

const meta: Meta<typeof List> = {
  /* 👇 The title prop is optional.
   * Seehttps://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

//👇 The ListTemplate construct will be spread to the existing stories.
const ListTemplate: Story = {
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
    items: [{ ...Unchecked.args }],
  },
};
```

```tsx filename="List.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { List } from './List';

//👇 Instead of importing ListItem, we import the stories
import { Unchecked } from './ListItem.stories';

export const meta: Meta<typeof List> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

export const OneItem: Story = {
  render: (args) => (
    <List {...args}>
      <Unchecked {...Unchecked.args} />
    </List>
  ),
};
```

```tsx filename="List.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { List } from './List';
import { ListItem } from './ListItem';

const meta: Meta<typeof List> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
  subcomponents: { ListItem }, //👈 Adds the ListItem component as a subcomponent
};

export default meta;
type Story = StoryObj<typeof List>;

export const Empty: Story = {};

export const OneItem: Story = {
  render: (args) => (
    <List {...args}>
      <ListItem />
    </List>
  ),
};
```

```tsx filename="List.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { List } from './List';

//👇 Instead of importing ListItem, we import the stories
import { Unchecked } from './ListItem.stories';

const meta: Meta<typeof List> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/configure/#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'List',
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

export const OneItem: Story = {
  args: {
    children: <Unchecked {...Unchecked.args} />,
  },
};
```

```tsx filename="MyComponent.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { TodoItem } from './TodoItem';

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
const meta: Meta<typeof TodoItem> = {
  component: TodoItem,
  render: (args, { loaded: { todo } }) => <TodoItem {...args} {...todo} />,
};

export default meta;
type Story = StoryObj<typeof TodoItem>;

export const Primary: Story = {
  loaders: [
    async () => ({
      todo: await (await fetch('https://jsonplaceholder.typicode.com/todos/1')).json(),
    }),
  ],
};
```

```tsx filename="LoginForm.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { within, userEvent } from '@storybook/testing-library';

import { expect } from '@storybook/test';

import { LoginForm } from './LoginForm';

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const EmptyForm: Story = {};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm: Story = {
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

```ts filename="Replace your-framework with the framework you are using (e.g., react, vue3)" renderer="solid" language="ts"
import { Preview } from '@storybook/your-framework';

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

const preview: Preview = {
  decorators: [AppDecorator],
};

export default preview;
```

```tsx filename="MyComponent.story.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Basic: Story = {};

export const WithProp: Story = {
  render: () => <MyComponent prop="value" />,
};
```

```tsx filename="MyComponent.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
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

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const MyStory: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
};
```

```tsx filename="MyComponent.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

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

```tsx filename="MyComponent.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { MyComponent } from './MyComponent';

import someData from './data.json';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
  includeStories: ['SimpleStory', 'ComplexStory'], // 👈 Storybook loads these stories
  excludeStories: /.*Data$/, // 👈 Storybook ignores anything that contains Data
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const simpleData = { foo: 1, bar: 'baz' };
export const complexData = { foo: 1, foobar: { bar: 'baz', baz: someData } };

export const SimpleStory: Story = {
  args: {
    data: simpleData,
  },
};

export const ComplexStory: Story = {
  args: {
    data: complexData,
  },
};
```

```tsx filename="Page.stories.ts|tsx" renderer="solid" language="ts"
import type { ComponentProps } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Page } from './Page';

type PagePropsAndCustomArgs = ComponentProps<typeof Page> & { footer?: string };

const meta: Meta<PagePropsAndCustomArgs> = {
  component: Page,
  render: ({ footer, ...args }) => (
    <Page {...args}>
      <footer>{footer}</footer>
    </Page>
  ),
};
export default meta;

type Story = StoryObj<PagePropsAndCustomArgs>;

export const CustomFooter: Story = {
  args: {
    footer: 'Built with Storybook',
  },
};
```

```tsx filename="Page.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Page } from './Page';

//👇 Imports all Header stories
import * as HeaderStories from './Header.stories';

const meta: Meta<typeof Page> = {
  component: Page,
};

export default meta;
type Story = StoryObj<typeof Page>;

export const LoggedIn: Story = {
  args: {
    ...HeaderStories.LoggedIn.args,
  },
};
```

```tsx filename="YourPage.ts|tsx" renderer="solid" language="ts"
import PageLayout from './PageLayout';
import Document from './Document';
import SubDocuments from './SubDocuments';
import DocumentHeader from './DocumentHeader';
import DocumentList from './DocumentList';

export interface DocumentScreen {
  user?: {};
  document?: Document;
  subdocuments?: SubDocuments[];
}

function DocumentScreen({ user, document, subdocuments }) {
  return (
    <PageLayout user={user}>
      <DocumentHeader document={document} />
      <DocumentList documents={subdocuments} />
    </PageLayout>
  );
}
```

```js filename=".storybook/preview.tsx" renderer="solid" language="ts"
import { Preview } from 'storybook-solidjs';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
```

```tsx filename=".storybook/preview.tsx" renderer="solid" language="ts"
import { Preview } from 'storybook-solidjs';
import { ThemeProvider, DefaultTheme } from 'solid-styled-components';

const theme: DefaultTheme = {
  colors: {
    primary: 'hotpink',
  },
};

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
```

```tsx filename="Button.stories.tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Variant1: Story = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 1 },
};

export const Variant2: Story = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 2 },
};

// Etc...

export const Combo: Story = {
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

```tsx filename="YourComponent.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta } from 'storybook-solidjs';

import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  component: YourComponent,
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
```

```tsx filename="YourComponent.stories.ts|tsx" renderer="solid" language="ts"
import type { Meta, StoryObj } from 'storybook-solidjs';

import { YourComponent } from './YourComponent';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof YourComponent> = {
  component: YourComponent,
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

export const FirstStory: Story = {
  args: {
    //👇 The args you need here will depend on your component
  },
};
```

```ts filename="ButtonGroup.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import ButtonGroup from './ButtonGroup.svelte';

//👇 Imports the Button stories
import * as ButtonStories from './Button.stories';

const meta: Meta<typeof ButtonGroup> = {
  component: ButtonGroup,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Pair: Story = {
  args: {
    buttons: [{ ...ButtonStories.Primary.args }, { ...ButtonStories.Secondary.args }],
    orientation: 'horizontal',
  },
};
```

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';

import Button from './Button.svelte';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
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

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import Button from './Button.svelte';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {...},
};
```

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';
import { action } from '@storybook/addon-actions';

import Button from './Button.svelte';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
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

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import type { Meta } from '@storybook/svelte';

import Button from './Button.svelte';

const meta: Meta<typeof Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import type { Meta } from '@storybook/svelte';

import Button from './Button.svelte';
import MarginDecorator from './MarginDecorator.svelte';

const meta: Meta<typeof Button> = {
  component: Button,
  decorators: [() => MarginDecorator],
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import { Meta, StoryObj } from '@storybook/svelte';

import Button from './Button.svelte';
import MarginDecorator from './MarginDecorator.svelte';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  decorators: [() => MarginDecorator],
};
```

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import type { Meta } from '@storybook/svelte';

import Button from './Button.svelte';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import Button from './Button.svelte';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = ({
  // 👇 Rename this story
  name: 'I am the primary',
  args: {
    label: 'Button',
    primary: true,
  },
};
```

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import Button from './Button.svelte';

//👇This default export determines where your story goes in the story list
const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    backgroundColor: '#ff0',
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    label: '😄👍😍💯',
  },
};

export const Tertiary: Story = {
  args: {
    ...Primary.args,
    label: '📚📕📈🤓',
  },
};
```

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import Button from './Button.svelte';

const meta: Meta<typeof Button> = {
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

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
```

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import Button from './Button.svelte';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};
```

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import Button from './Button.svelte';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof meta>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/svelte/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => ({
    Component: Button,
    props: {
      backgroundColor: '#ff0',
      label: 'Button',
    },
  }),
};

export const Secondary: Story = {
  render: () => ({
    Component: Button,
    props: {
      backgroundColor: '#ff0',
      label: '😄👍😍💯',
    },
  }),
};

export const Tertiary: Story = {
  render: () => ({
    Component: Button,
    props: {
      backgroundColor: '#ff0',
      label: '📚📕📈🤓',
    },
  }),
};
```

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import Button from './Button.svelte';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof meta>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => ({
    Component: Button,
    props: {
      primary: true,
      label: 'Button',
    },
  }),
};
```

```ts filename="YourComponent.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import YourComponent from './YourComponent.svelte';

const meta: Meta<typeof YourComponent> = {
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

export default meta;
type Story = StoryObj<typeof meta>;

const someFunction = (valuePropertyA, valuePropertyB) => {
  // Do some logic here
};

export const ExampleStory: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import MyComponent from './MyComponent.svelte';

// More on default export: https://storybook.js.org/docs/svelte/writing-stories/introduction#default-export
const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Sample-File',
    },
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import MyComponent from './MyComponent.svelte';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAnImage: Story = {
  render: () => ({
    Component: MyComponent,
    props: {
      src: 'https://storybook.js.org/images/placeholders/350x150.png',
      alt: 'My CDN placeholder',
    },
  }),
};
```

```ts filename="MyComponent.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import MyComponent from './MyComponent.svelte';

import imageFile from './static/image.png';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

const image = {
  src: imageFile,
  alt: 'my image',
};

export const WithAnImage: Story = {
  render: () => ({
    Component: MyComponent,
    props: image,
  }),
};
```

```ts filename="MyComponent.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import MyComponent from './MyComponent.svelte';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

// Assume image.png is located in the "public" directory.
export const WithAnImage: Story = {
  render: () => ({
    Component: MyComponent,
    props: {
      src: '/image.png',
      alt: 'my image',
    },
  }),
};
```

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import Button from './Button.svelte';

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// This is an accessible story
export const Accessible: Story = {
  args: {
    primary: false,
    label: 'Button',
  },
};

// This is not
export const Inaccessible: Story = {
  args: {
    ...Accessible.args,
    backgroundColor: 'red',
  },
};
```

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryFn } from '@storybook/svelte';

import Button from './Button.svelte';

export default {
  title: 'Button',
  component: Button,
} as Meta<typeof Button>;

export const Primary: StoryFn<typeof Button> = (args) => ({
  Component: Button,
  props: args,
});
Primary.args = { primary: true };
```

```ts filename="CSF 2" renderer="svelte" language="ts"
// Other imports and story implementation
export const Primary: StoryFn<typeof Button> = (args) => ({
  Component: Button,
  props: args,
});
```

```ts filename="CSF 3 - explicit render function" renderer="svelte" language="ts"
// Other imports and story implementation
export const Default: Story = {
  render: (args) => ({
    Component: Button,
    props: args,
  }),
};
```

```ts filename="Button.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import Button from './Button.svelte';

const meta: Meta<typeof Button> = { component: Button };
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { primary: true } };
```

```html renderer="svelte" language="ts"
{/* YourPage.svelte */}

<script lang="ts">
  import { onMount } from 'svelte';

  import PageLayout from './PageLayout.svelte';
  import DocumentHeader from './DocumentHeader.svelte';
  import DocumentList from './DocumentList.svelte';

  export let user: Record<string, unknown> = {};
  export let document: Record<string, unknown> = {};
  export let subdocuments: Record<string, unknown>[] = [];
  export let status: 'error' | 'loading' | 'success' = 'loading';

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

```html renderer="svelte" language="ts"
{/* YourPage.svelte */}

<script lang="ts">
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

```ts filename="Histogram.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import Histogram from './Histogram.svelte';

const meta: Meta<typeof Histogram> = {
  component: Histogram,
};

export default meta;
type Story = StoryObj<typeof meta>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
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

```ts filename="TodoItem.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import fetch from 'node-fetch';

import TodoItem from './TodoItem.svelte';

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/svelte/api/csf
 * to learn how to use render functions.
 */
const meta: Meta<typeof TodoItem> = {
  component: TodoItem,
  render: (args, { loaded: { todo } }) => ({
    Component: TodoItem,
    props: {
      ...args,
      ...todo,
    },
  }),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  loaders: [
    async () => ({
      todo: await (await fetch('https://jsonplaceholder.typicode.com/todos/1')).json(),
    }),
  ],
};
```

```ts filename="LoginForm.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';
import { expect, userEvent, within } from '@storybook/test';

import LoginForm from './LoginForm.svelte';

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyForm: Story = {};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm: Story = {
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

```ts filename=".storybook/main.ts" renderer="svelte" language="ts"
// Replace sveltekit with svelte-vite if you are not working with SvelteKit
import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
  framework: '@storybook/sveltekit',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    // Other Storybook addons
    '@storybook/addon-svelte-csf', //👈 The Svelte CSF addon goes here
  ],
};

export default config;
```

```ts filename="YourPage.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import { graphql, HttpResponse, delay } from 'msw';

import MockApolloWrapperClient from './MockApolloWrapperClient.svelte';
import DocumentScreen from './YourPage.svelte';

const meta: Meta<typeof DocumentScreen> = {
  component: DocumentScreen,
  decorators: [() => MockApolloWrapperClient],
};

export default meta;
type Story = StoryObj<typeof meta>;

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

export const MockedSuccess: Story = {
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

export const MockedError: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import MyComponent from './MyComponent.svelte';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const WithProp: Story = {
  render: () => ({
    Component: MyComponent,
    props: {
      prop: 'value',
    },
  }),
};
```

```ts filename="MyComponent.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import MyComponent from './MyComponent.svelte';

const meta: Meta<typeof MyComponent> = {
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

export default meta;
type Story = StoryObj<typeof meta>;

export const MyStory: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import MyComponent from './YourComponent.svelte';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

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

export const StoryWithLocale: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import MyComponent from './MyComponent.svelte';

import someData from './data.json';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
  includeStories: ['SimpleStory', 'ComplexStory'], // 👈 Storybook loads these stories
  excludeStories: /.*Data$/, // 👈 Storybook ignores anything that contains Data
};

export default meta;
type Story = StoryObj<typeof meta>;

export const simpleData = { foo: 1, bar: 'baz' };
export const complexData = { foo: 1, foobar: { bar: 'baz', baz: someData } };

export const SimpleStory: Story = {
  args: {
    data: simpleData,
  },
};

export const ComplexStory: Story = {
  args: {
    data: complexData,
  },
};
```

```ts filename="Page.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import Page from './Page.svelte';

//👇 Imports all Header stories
import * as HeaderStories from './Header.stories';

const meta: Meta<typeof Page> = {
  component: Page,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    ...HeaderStories.LoggedIn.args,
  },
};
```

```ts filename="Button.test.ts" renderer="svelte" language="ts"
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { composeStories } from '@storybook/svelte';

// Import all stories and the component annotations from the stories file
import * as stories from './Button.stories';

// Every component that is returned maps 1:1 with the stories,
// but they already contain all annotations from story, meta, and project levels
const { Primary, Secondary } = composeStories(stories);

test('renders primary button with default args', () => {
  render(Primary.Component, Primary.props);
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});
```

```ts filename="Button.test.ts" renderer="svelte" language="ts"
import { vi, test, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { composeStory } from '@storybook/svelte';

import meta, { Primary } from './Button.stories';

test('renders primary button with default args', () => {
  // Returns a story which already contains all annotations from story, meta and global levels
  const PrimaryStory = composeStory(Primary, meta);

  render(PrimaryStory.Component, PrimaryStory.props);
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});

test('renders primary button with overridden props', () => {
  // You can override props and they will get merged with values from the story's args
  const PrimaryStory = composeStory({ ...Primary, args: { label: 'Hello world' } }, meta);

  render(PrimaryStory.Component, PrimaryStory.props);
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

```ts filename="Button.test.ts" renderer="svelte" language="ts"
import { test } from 'vitest';
import { render } from '@testing-library/svelte';
import { composeStory } from '@storybook/svelte';

import meta, { Primary } from './Button.stories';

test('renders in English', async () => {
  const PrimaryStory = composeStory(
    Primary,
    meta,
    { globals: { locale: 'en' } }, // 👈 Project annotations to override the locale
  );

  render(PrimaryStory.Component, PrimaryStory.props);
});

test('renders in Spanish', async () => {
  const PrimaryStory = composeStory(Primary, meta, { globals: { locale: 'es' } });

  render(PrimaryStory.Component, PrimaryStory.props);
});
```

```ts filename="Button.test.ts" renderer="svelte" language="ts"
import { test } from 'vitest';
import { render } from '@testing-library/svelte';
import { composeStory } from '@storybook/svelte';

import meta, { Primary } from './Button.stories';

test('applies the loaders and renders', async () => {
  const PrimaryStory = composeStory(Primary, meta);

  // First, load the data for the story
  await PrimaryStory.load();

  // Then, render the story
  render(PrimaryStory.Component, PrimaryStory.props);
});
```

```ts filename="Button.test.ts" renderer="svelte" language="ts"
import { test } from 'vitest';
import { render } from '@testing-library/svelte';
import { composeStory } from '@storybook/svelte';

import meta, { Primary } from './Button.stories';

test('renders and executes the play function', async () => {
  const PrimaryStory = composeStory(Primary, meta);

  // First, render the story
  render(PrimaryStory.Component, PrimaryStory.props);

  // Then, execute the play function
  await PrimaryStory.play();
});
```

```html renderer="svelte" language="ts"
{/* YourPage.svelte */}

<script lang="ts">
  import PageLayout from './PageLayout.svelte';
  import DocumentHeader from './DocumentHeader.svelte';
  import DocumentList from './DocumentList.svelte';

  export let user: Record<string, unknown> = {};
  export let document: Record<string, unknown> = {};
  export let subdocuments: Record<string, unknown>[] = [];
</script>

<div>
  <PageLayout {user}>
    <DocumentHeader {document} />
    <DocumentList documents="{subdocuments}" />
  </PageLayout>
</div>
```

```ts filename="MyComponent.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import MyComponent from './MyComponent.svelte';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NonA11yStory: Story = {
  parameters: {
    a11y: {
      // This option disables all a11y checks on this story
      disable: true,
    },
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import MyComponent from './MyComponent.svelte';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ExampleStory: Story = {
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

```ts filename=".storybook/preview.ts" renderer="svelte" language="ts"
import type { Preview } from '@storybook/svelte';

import MarginDecorator from './MarginDecorator.svelte';

const preview: Preview = {
  decorators: [() => MarginDecorator],
};

export default preview;
```

```ts filename=".storybook/main.ts" renderer="svelte" language="ts"
import { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
  // ...
  framework: '@storybook/svelte-vite', // 👈 Add this
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="svelte" language="ts"
import { StorybookConfig } from '@storybook/svelte-webpack5';

const config: StorybookConfig = {
  // ...
  framework: '@storybook/svelte-webpack5', // 👈 Add this
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="svelte" language="ts"
import { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  // ...
  framework: '@storybook/sveltekit', // 👈 Add this
  // svelteOptions: { ... }, 👈 Remove this
};

export default config;
```

```ts filename="YourComponent.stories.ts" renderer="svelte" language="ts"
import type { Meta } from '@storybook/svelte';

import YourComponent from './YourComponent.svelte';
import MarginDecorator from './MarginDecorator.svelte';

const meta: Meta<typeof YourComponent> = {
  component: YourComponent,
  decorators: [() => MarginDecorator],
};

export default meta;
```

```ts filename="YourComponent.stories.ts" renderer="svelte" language="ts"
import type { Meta, StoryObj } from '@storybook/svelte';

import YourComponent from './YourComponent.svelte';

//👇This default export determines where your story goes in the story list
const meta: Meta<typeof YourComponent> = {
  component: YourComponent,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstStory: Story = {
  args: {
    //👇 The args you need here will depend on your component
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT, RESET_HIGHLIGHT } from '@storybook/addon-highlight';

import MyComponent from './MyComponent.vue';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const ResetHighlight: Story = {
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

```ts filename="Button.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import Button from './Button.vue';

const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  argTypes: {
    onClick: {},
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Text: Story = {
  args: {},
};
```

```ts filename="Button.stories.ts" renderer="vue" language="ts"
import type { Meta } from '@storybook/vue3';

import Button from './Button.vue';

const meta: Meta<typeof Button> = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="vue" language="ts"
import type { Meta } from '@storybook/vue3';

import Button from './Button.vue';

const meta: Meta<typeof Button> = {
  component: Button,
  decorators: [() => ({ template: '<div style="margin: 3em;"><story /></div>' })],
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import Button from './Button.vue';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => ({
    components: { Button },
    template: '<Button primary label="Hello World" />',
  }),
  decorators: [() => ({ template: '<div style="margin: 3em;"><story /></div>' })],
};
```

```ts filename="Button.stories.ts" renderer="vue" language="ts"
import type { Meta } from '@storybook/vue3';

import Button from './Button.vue';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import Button from './Button.vue';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  // 👇 Rename this story
  name: 'I am the primary',
  args: {
    label: 'Button',
    primary: true,
  },
};
```

```ts filename="Button.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import Button from './Button.vue';

const meta: Meta<typeof Button> = {
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

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Basic: Story = {
  render: () => ({
    components: { Button },
    template: '<Button label="Hello" />',
  }),
};
```

```ts filename="Button.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import Button from './Button.vue';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => ({
    components: { Button },
    template: '<Button background="#ff0" label="Button" />',
  }),
};

export const Secondary: Story = {
  render: () => ({
    components: { Button },
    template: '<Button background="#ff0" label="😄👍😍💯" />',
  }),
};

export const Tertiary: Story = {
  render: () => ({
    components: { Button },
    template: '<Button background="#ff0" label="📚📕📈🤓" />',
  }),
};
```

```ts filename="Button.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import Button from './Button.vue';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => ({
    components: { Button },
    template: '<Button primary label="Button" />',
  }),
};
```

```ts filename="YourComponent.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import YourComponent from './YourComponent.vue';

const meta: Meta<typeof YourComponent> = {
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

export default meta;
type Story = StoryObj<typeof YourComponent>;

export const ExampleStory: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import MyComponent from './MyComponent.vue';

// More on default export: https://storybook.js.org/docs/writing-stories/#default-export
const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Example: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Sample-File',
    },
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT } from '@storybook/addon-highlight';

import MyComponent from './MyComponent.vue';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Highlighted: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import MyComponent from './MyComponent.vue';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const WithAnImage: Story = {
  render: () => ({
    template:
      '<img src="https://storybook.js.org/images/placeholders/350x150.png" alt="My CDN placeholder"/>',
  }),
};
```

```ts filename="MyComponent.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import MyComponent from './MyComponent.vue';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const WithAnImage: Story = {
  render: () => ({
    template: '<img src="image.png" alt="my image" />',
  }),
};
```

```ts filename="MyComponent.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import Layout from './Layout.vue';

import MyComponent from './MyComponent.vue';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

// This story uses a render function to fully control how the component renders.
export const Example: Story = {
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

```ts filename="CSF 3" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import Button from './Button.vue';

const meta: Meta<typeof Button> = { component: Button };

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { primary: true } };
```

```ts filename=".storybook/preview.ts" renderer="vue" language="ts"
import type { Preview } from '@storybook/vue3';

const preview: Preview = {
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

export default preview;
```

```ts filename="MyComponent.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT } from '@storybook/addon-highlight';

import MyComponent from './MyComponent.vue';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const StyledHighlight: Story = {
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

```ts filename="List.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import List from './ListComponent.vue';
import ListItem from './ListItem.vue';

const meta: Meta<typeof List> = {
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Empty: Story = {
  render: () => ({
    components: { List },
    template: '<List/>',
  }),
};

export const OneItem: Story = {
  render: () => ({
    components: { List, ListItem },
    template: `
      <List>
        <list-item/>
      </List>`,
  }),
};

export const ManyItems: Story = {
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

```ts filename="List.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import List from './ListComponent.vue';

const meta: Meta<typeof List> = {
  component: List,
};

export default meta;
type Story = StoryObj<typeof List>;

// Always an empty list, not super interesting
export const Empty: Story = {
  render: () => ({
    components: { List },
    template: '<List/>',
  }),
};
```

```ts filename="List.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import List from './List.vue';
import ListItem from './ListItem.vue';

const meta: Meta<typeof List> = {
  component: List,
  subcomponents: { ListItem }, //👈 Adds the ListItem component as a subcomponent
};
export default meta;

type Story = StoryObj<typeof List>;

export const Empty: Story = {
  render: () => ({
    components: { List },
    template: '<List />',
  }),
};

export const OneItem: Story = {
  render: (args) => ({
    components: { List, ListItem },
    setup() {
      return { args }
    }
    template: '<List v-bind="args"><ListItem /></List>',
  }),
};
```

```ts filename="TodoItem.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import TodoItem from './TodoItem.vue';

import fetch from 'node-fetch';

const meta: Meta<typeof TodoItem> = {
  component: TodoItem,
};

export default meta;
type Story = StoryObj<typeof TodoItem>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
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

```ts filename="LoginForm.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import { userEvent, within, expect } from '@storybook/test';

import LoginForm from './LoginForm.vue';

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const EmptyForm: Story = {
  render: () => ({
    components: { LoginForm },
    template: `<LoginForm />`,
  }),
};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm: Story = {
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

```ts filename="YourPage.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import { graphql, HttpResponse, delay } from 'msw';

import WrapperComponent from './ApolloWrapperClient.vue';
import DocumentScreen from './YourPage.vue';

const meta: Meta<typeof DocumentScreen> = {
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

export default meta;
type Story = StoryObj<typeof DocumentScreen>;

export const MockedSuccess: Story = {
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

export const MockedError: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import MyComponent from './MyComponent.vue';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Basic: Story = {
  render: () => ({
    components: { MyComponent },
    template: '<MyComponent />',
  }),
};

export const WithProp: Story = {
  render: () => ({
    components: { MyComponent },
    template: '<MyComponent prop="value"/>',
  }),
};
```

```ts filename="MyComponent.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import MyComponent from './MyComponent.vue';

const meta: Meta<typeof MyComponent> = {
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

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const MyStory: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import MyComponent from './MyComponent.vue';

const meta: Meta<typeof MyComponent> = {
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

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const MyStory: Story = {
  render: (args, { globals: { locale } }) => {
    const caption = getCaptionForLocale(locale);
    return {
      template: `<p>${caption}</p>`,
    };
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import MyComponent from './MyComponent.vue';

import someData from './data.json';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
  includeStories: ['SimpleStory', 'ComplexStory'],
  excludeStories: /.*Data$/, // 👈 Storybook ignores anything that contains Data
};

export const simpleData = { foo: 1, bar: 'baz' };
export const complexData = { foo: 1, foobar: { bar: 'baz', baz: someData } };

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const SimpleStory: Story = {
  args: {
    data: simpleData,
  },
};

export const ComplexStory: Story = {
  args: {
    data: complexData,
  },
};
```

```ts filename="Button.test.ts" renderer="vue" language="ts"
import { test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/vue';
import { composeStories } from '@storybook/vue3';

// Import all stories and the component annotations from the stories file
import * as stories from './Button.stories';

// Every component that is returned maps 1:1 with the stories,
// but they already contain all annotations from story, meta, and project levels
const { Primary, Secondary } = composeStories(stories);

test('renders primary button with default args', () => {
  render(Primary);
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});

test('renders primary button with overridden props', () => {
  // You can override props and they will get merged with values from the story's args
  render(Primary, { props: { label: 'Hello world' } });
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

```ts filename="Button.test.ts" renderer="vue" language="ts"
import { jest, test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/vue';
import { composeStory } from '@storybook/vue3';

import meta, { Primary } from './Button.stories';

test('onclick handler is called', () => {
  // Returns a story which already contains all annotations from story, meta and global levels
  const PrimaryStory = composeStory(Primary, meta);

  const onClickSpy = jest.fn();
  render(Primary, { props: { onClick: onClickSpy } });
  const buttonElement = screen.getByRole('button');
  buttonElement.click();
  expect(onClickSpy).toHaveBeenCalled();
});
```

```ts filename="Button.test.ts" renderer="vue" language="ts"
import { test } from '@jest/globals';
import { render } from '@testing-library/vue';
import { composeStory } from '@storybook/vue3';

import meta, { Primary } from './Button.stories';

test('renders in English', async () => {
  const PrimaryStory = composeStory(
    Primary,
    meta,
    { globals: { locale: 'en' } }, // 👈 Project annotations to override the locale
  );

  render(PrimaryStory);
});

test('renders in Spanish', async () => {
  const PrimaryStory = composeStory(Primary, meta, { globals: { locale: 'es' } });

  render(PrimaryStory);
});
```

```ts filename="Button.test.ts" renderer="vue" language="ts"
import { test } from '@jest/globals';
import { render } from '@testing-library/vue';
import { composeStory } from '@storybook/vue3';

import meta, { Primary } from './Button.stories';

test('applies the loaders and renders', async () => {
  const PrimaryStory = composeStory(Primary, meta);

  // First, load the data for the story
  await PrimaryStory.load();

  // Then, render the story
  render(PrimaryStory);
});
```

```ts filename="Button.test.ts" renderer="vue" language="ts"
import { test } from '@jest/globals';
import { render } from '@testing-library/vue';
import { composeStory } from '@storybook/vue3';

import meta, { Primary } from './Button.stories';

test('renders and executes the play function', async () => {
  const PrimaryStory = composeStory(Primary, meta);

  // First, render the story
  render(PrimaryStory);

  // Then, execute the play function
  await PrimaryStory.play();
});
```

```ts filename="Button.playwright.test.ts" renderer="vue" language="ts"
import { createTest } from '@storybook/vue3/experimental-playwright';
import { test as base } from '@playwright/experimental-ct-vue';

// See explanation below for `.portable` stories file
import stories from './Button.stories.portable';

const test = createTest(base);

// 👉 Important: Due to current limitations, you can only reference your stories as JSX elements.

test('renders primary button', async ({ mount }) => {
  // The mount function will execute all the necessary steps in the story,
  // such as loaders, render, and play function
  await mount(<stories.Primary />);
});

test('renders primary button with overridden props', async ({ mount }) => {
  // You can pass custom props to your component via JSX
  const component = await mount(<stories.Primary label="label from test" />);
  await expect(component).toContainText('label from test');
  await expect(component.getByRole('button')).toHaveClass(/storybook-button--primary/);
});
```

```ts filename="Button.test.ts" renderer="vue" language="ts"
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { composeStories } from '@storybook/vue3';

// Import all stories and the component annotations from the stories file
import * as stories from './Button.stories';

// Every component that is returned maps 1:1 with the stories,
// but they already contain all annotations from story, meta, and project levels
const { Primary, Secondary } = composeStories(stories);

test('renders primary button with default args', () => {
  render(Primary);
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});

test('renders primary button with overridden props', () => {
  // You can override props and they will get merged with values from the story's args
  render(Primary, { props: { label: 'Hello world' } });
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

```ts filename="Button.test.ts" renderer="vue" language="ts"
import { vi, test, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { composeStory } from '@storybook/vue3';

import meta, { Primary } from './Button.stories';

test('onclick handler is called', () => {
  // Returns a story which already contains all annotations from story, meta and global levels
  const PrimaryStory = composeStory(Primary, meta);

  const onClickSpy = vi.fn();
  render(Primary, { props: { onClick: onClickSpy } });
  const buttonElement = screen.getByRole('button');
  buttonElement.click();
  expect(onClickSpy).toHaveBeenCalled();
});
```

```ts filename="Button.test.ts" renderer="vue" language="ts"
import { test } from 'vitest';
import { render } from '@testing-library/vue';
import { composeStory } from '@storybook/vue3';

import meta, { Primary } from './Button.stories';

test('renders in English', async () => {
  const PrimaryStory = composeStory(
    Primary,
    meta,
    { globals: { locale: 'en' } }, // 👈 Project annotations to override the locale
  );

  render(PrimaryStory);
});

test('renders in Spanish', async () => {
  const PrimaryStory = composeStory(Primary, meta, { globals: { locale: 'es' } });

  render(PrimaryStory);
});
```

```ts filename="Button.test.ts" renderer="vue" language="ts"
import { test } from 'vitest';
import { render } from '@testing-library/vue';
import { composeStory } from '@storybook/vue3';

import meta, { Primary } from './Button.stories';

test('applies the loaders and renders', async () => {
  const PrimaryStory = composeStory(Primary, meta);

  // First, load the data for the story
  await PrimaryStory.load();

  // Then, render the story
  render(PrimaryStory);
});
```

```ts filename="Button.test.ts" renderer="vue" language="ts"
import { test } from 'vitest';
import { render } from '@testing-library/vue';
import { composeStory } from '@storybook/vue3';

import meta, { Primary } from './Button.stories';

test('renders and executes the play function', async () => {
  const PrimaryStory = composeStory(Primary, meta);

  // First, render the story
  render(PrimaryStory);

  // Then, execute the play function
  await PrimaryStory.play();
});
```

```ts filename="MyComponent.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import MyComponent from './MyComponent.vue';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const NonA11yStory: Story = {
  parameters: {
    a11y: {
      // This option disables all a11y checks on this story
      disable: true,
    },
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import MyComponent from './MyComponent.vue';

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

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

```ts filename=".storybook/preview.ts" renderer="vue" language="ts"
import { Preview } from '@storybook/vue3';

const preview: Preview = {
  decorators: [
    (story) => ({
      components: { story },
      template: '<div style="margin: 3em;"><story /></div>',
    }),
  ],
};
export default preview;
```

```ts filename="Button.stories.ts" renderer="vue" language="ts"
import type { Meta, StoryObj } from '@storybook/vue3';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Variant1: Story = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 1 },
};

export const Variant2: Story = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 2 },
};

// Etc...

export const Combo: Story = {
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

```ts filename=".storybook/main.ts" renderer="vue" language="ts"
import { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  // ...
  framework: '@storybook/vue3-vite', // 👈 Add this
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="vue" language="ts"
import { StorybookConfig } from '@storybook/vue3-webpack5';

const config: StorybookConfig = {
  // ...
  framework: '@storybook/vue3-webpack5', // 👈 Add this
};

export default config;
```

```ts filename="YourComponent.stories.ts" renderer="vue" language="ts"
import type { Meta } from '@storybook/vue3';

import YourComponent from './YourComponent.vue';

const meta: Meta<typeof YourComponent> = {
  component: YourComponent,
  decorators: [() => ({ template: '<div style="margin: 3em;"><story/></div>' })],
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

const meta: Meta {
  component: 'demo-button',
  args: {
    // 👇 Create an action that appears when the onClick event is fired
    onClick: action('on-click'),
  },
};

export default meta;
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT, RESET_HIGHLIGHT } from '@storybook/addon-highlight';

const meta: Meta = {
  component: 'my-component',
};

export default meta;
type Story = StoryObj;

export const ResetHighlight: Story = {
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

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Button',
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  parameters: {
    docs: {
      canvas: { sourceState: 'shown' },
    },
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  title: 'Button',
  component: 'demo-button',
  parameters: {
    docs: {
      controls: { exclude: ['style'] },
    },
  },
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

/**
 * # Button stories
 * These stories showcase the button
 */
const meta: Meta = {
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

export default meta;
type Story = StoryObj;

/**
 * # Primary Button
 * This is the primary button
 */
export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Another description on the story, overriding the comments',
      },
    },
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Button',
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  parameters: {
    docs: {
      source: { language: 'tsx' },
    },
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Button',
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  parameters: {
    docs: {
      story: { autoplay: true },
    },
  },
};
```

```ts filename="Example.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
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

export default meta;
```

```ts filename="Example.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
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

export default meta;
```

```ts filename="Example.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-example',
  argTypes: {
    value: {
      description: 'The value of the slider',
    },
  },
};

export default meta;
```

```ts filename="Example.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
  argTypes: {
    // 👇 All Button stories expect a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  argTypes: {
    // 👇 This story expects a label arg
    label: {
      control: 'text',
      description: 'Overwritten description',
    },
  },
};
```

```ts filename="Example.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

import { html } from 'lit';

const meta: Meta = {
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

export default meta;
```

```ts filename="Example.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-example',
  argTypes: {
    actualArgName: {
      name: 'Friendly name',
    },
  },
};

export default meta;
```

```ts filename="Example.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-example',
  argTypes: {
    icon: {
      options: ['arrow-up', 'arrow-down', 'loading'],
    },
  },
};

export default meta;
```

```ts filename="Example.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
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

export default meta;
```

```ts filename="Example.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-example',
  argTypes: {
    value: { type: 'number' },
  },
};

export default meta;
```

```ts filename="Page.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import MockDate from 'mockdate';

// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { getUserFromSession } from '../../api/session.mock';

const meta: Meta = {
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
export default meta;

type Story = StoryObj;

export const Default: Story = {
  async play({ canvasElement }) {
    // ... This will run with the mocked Date
  },
};
```

```ts filename="Button.ts" renderer="web-components" language="ts"
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @prop {string} content - The display label of the button
 * @prop {boolean} isDisabled - Checks if the button should be disabled
 * @summary This is a custom button element
 * @tag custom-button
 */

@customElement('custom-button')
export class CustomButton extends LitElement {
  @property()
  content?: string = 'One';
  @property()
  isDisabled?: boolean = false;

  render() {
    return html` <button type="button" ?disabled=${this.isDisabled}>${this.content}</button> `;
  }
}
```

```ts filename="ButtonGroup.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

// 👇 Imports the Button stories
import * as ButtonStories from './Button.stories';

const meta: Meta = {
  component: 'demo-button-group',
};

export default meta;
type Story = StoryObj;

export const Pair: Story = {
  args: {
    buttons: [{ ...ButtonStories.Primary.args }, { ...ButtonStories.Secondary.args }],
    orientation: 'horizontal',
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';

const meta: Meta = {
  component: 'demo-button',
  parameters: {
    actions: {
      handles: ['mouseover', 'click .btn'],
    },
  },
  decorators: [withActions],
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

//👇 Throws a type error it the args don't match the component props
export const Primary: Story = {
  args: {
    primary: true,
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { action } from '@storybook/addon-actions';

import { html } from 'lit';

const meta: Meta = {
  component: 'custom-button',
};

export default meta;
type Story = StoryObj;

export const Text: Story = {
  render: ({ label, onClick }) =>
    html`<custom-button label="${label}" @click=${onClick}></custom-button>`,
  args: {
    label: 'Hello',
    onClick: action('clicked'),
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'custom-button',
  argTypes: {
    onClick: { action: 'onClick' },
  },
};

export default meta;
type Story = StoryObj;

export const Text: Story = {
  args: {},
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { action } from '@storybook/addon-actions';

import { html } from 'lit';

const meta: Meta = {
  component: 'custom-button',
};

export default meta;
type Story = StoryObj;

export const Text: Story = {
  render: () => html`<custom-button label="Hello" @click=${action('clicked')}></custom-button>`,
};
```

```js filename="Button.stories.js" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

const meta: Meta = {
  component: 'demo-button',
  decorators: [(story) => html`<div style="margin: 3em">${story()}</div>`],
};

export default meta;
type Story = StoryObj;

export const Example: Story = {};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
  argTypes: {
    variant: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
  },
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  decorators: [(story) => html`<div style="margin: 3em">${story()}</div>`],
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  title: 'Button',
  component: 'demo-button',
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  title: 'Button',
  component: 'demo-button',
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
  parameters: {
    myAddon: { disable: true }, // Disables the addon
  },
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  title: 'Design System/Atoms/Button',
  component: 'demo-button',
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/your-framework';

const meta: Meta = {
  title: 'Design System/Atoms/Button',
  component: 'demo-component',
};

export default meta;
type Story = StoryObj;

// This is the only named export in the file, and it matches the component name
export const Button: Story = {};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
  parameters: { actions: { argTypesRegex: '^on.*' } },
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    primary: false,
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const PrimaryLongName: Story = {
  args: {
    ...Primary.args,
    label: 'Primary with a really long name',
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  // 👇 Rename this story
  name: 'I am the primary',
  args: {
    label: 'Button',
    primary: true,
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: {
    background: '#ff0',
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    label: '😄👍😍💯',
  },
};

export const Tertiary: Story = {
  args: {
    ...Primary.args,
    label: '📚📕📈🤓',
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

const meta: Meta = {
  title: 'Button',
  component: 'custom-button',
  //👇 Creates specific parameters for the story
  parameters: {
    myAddon: {
      data: 'This data is passed to the addon',
    },
  },
};

export default meta;
type Story = StoryObj;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Basic: Story = {
  render: () => html`<custom-button label="Hello"></custom-button>`,
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => html`<demo-button .background="#ff0" .label="Button"></demo-button>`,
};

export const Secondary: Story = {
  render: () => html`<demo-button .background="#ff0" .label="😄👍😍💯"></demo-button>`,
};

export const Tertiary: Story = {
  render: () => html`<demo-button .background="#ff0" .label="📚📕📈🤓"></demo-button>`,
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: () => html`<demo-button primary></demo-button>`,
};
```

```ts filename="Checkbox.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'checkbox-element',
};

export default meta;
type Story = StoryObj;

export const Unchecked: Story = {
  args: {
    label: 'Unchecked',
  },
};
```

```ts filename="CheckBox.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  title: 'Design System/Atoms/Checkbox',
  component: 'demo-checkbox',
};

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

const meta: Meta = {
  component: 'custom-component',
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

export default meta;
type Story = StoryObj;

const someFunction = (valuePropertyA: any, valuePropertyB: any) => {
  // Do some logic here
};

export const ExampleStory: Story = {
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

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from './icons';

const arrows = { ArrowUp, ArrowDown, ArrowLeft, ArrowRight };

const meta: Meta = {
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

export default meta;
```

```ts filename="YourComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  component: 'your-component',
  argTypes: {
    // foo is the property we want to remove from the UI
    foo: {
      control: false,
    },
  },
};

export default meta;
```

```ts filename="YourComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'your-component',
};

export default meta;
type Story = StoryObj;

export const ArrayInclude: Story = {
  parameters: {
    controls: { include: ['foo', 'bar'] },
  },
};

export const RegexInclude: Story = {
  parameters: {
    controls: { include: /^hello*/ },
  },
};

export const ArrayExclude: Story = {
  parameters: {
    controls: { exclude: ['foo', 'bar'] },
  },
};

export const RegexExclude: Story = {
  parameters: {
    controls: { exclude: /^hello*/ },
  },
};
```

```ts filename="YourComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
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

export default meta;
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'my-component',
};

export default meta;
type Story = StoryObj;

export const Example: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Sample-File',
    },
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT } from '@storybook/addon-highlight';

const meta: Meta = {
  component: 'my-component',
};

export default meta;
type Story = StoryObj;

export const Highlighted: Story = {
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

```ts filename="YourComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  component: 'your-component',
  parameters: { controls: { sort: 'requiredFirst' } },
};

export default meta;
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

const meta: Meta = {
  component: 'my-component',
};

export default meta;
type Story = StoryObj;

export const WithAnImage: Story = {
  render: () =>
    html`<img
      src="https://storybook.js.org/images/placeholders/350x150.png"
      alt="My CDN placeholder"
    />`,
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

import imageFile from './static/image.png';

const meta: Meta = {
  component: 'my-component',
};

const image = {
  src: imageFile,
  alt: 'my image',
};

export default meta;
type Story = StoryObj;

export const WithAnImage: Story = {
  render: () => html`<img src="${image.src}" alt="${image.alt}" />`,
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

const meta: Meta = {
  component: 'my-component',
};

export default meta;
type Story = StoryObj;

// Assume image.png is located in the "public" directory.
export const WithAnImage: Story = {
  render: () => html`<img src="/image.png" alt="image" />`,
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'custom-button',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj;

// This is an accessible story
export const Accessible: Story = {
  args: {
    primary: false,
    label: 'Button',
  },
};

// This is not
export const Inaccessible: Story = {
  args: {
    ...Accessible.args,
    backgroundColor: 'red',
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

const meta: Meta = {
  component: 'my-component',
};

export default meta;
type Story = StoryObj;

// This story uses a render function to fully control how the component renders.
export const Example: Story = {
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

```ts filename="CSF 2" renderer="web-components" language="ts"
import type { Meta, Story } from '@storybook/web-components';

import { html } from 'lit';

export default {
  title: 'components/Button',
  component: 'demo-button',
} as Meta;

export const Primary: Story = ({ primary }) =>
  html`<demo-button ?primary=${primary}></demo-button>`;
Primary.args = {
  primary: true,
};
```

```ts filename="CSF 2" renderer="web-components" language="ts"
// Other imports and story implementation

export const Default: Story = ({ primary, backgroundColor, size, label }) =>
  html`<custom-button ?primary="${primary}" size="${size}" label="${label}"></custom-button>`;
```

```js filename="CSF 3" renderer="web-components" language="ts"
// Other imports and story implementation

export const Default: Story = {
  render: (args) => html`<custom-button label="Hello" @click=${action('clicked')}></custom-button>`,
};
```

```ts filename="CSF 3" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'components/Button',
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Primary: Story = { args: { primary: true } };
```

```ts filename="Gizmo.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
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

export default meta;
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { useChannel } from '@storybook/preview-api';
import { HIGHLIGHT } from '@storybook/addon-highlight';

const meta: Meta = {
  component: 'my-component',
};

export default meta;
type Story = StoryObj;

export const StyledHighlight: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'histogram-component',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    dataType: 'latency',
    showHistogramLabels: true,
    histogramAccentColor: '#1EA7FD',
    label: 'Latency distribution',
  },
};
```

```ts filename="List.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

const meta: Meta = {
  component: 'demo-list',
};

export default meta;
type Story = StoryObj;

export const Empty: Story = {
  render: () => html`<demo-list></demo-list>`,
};

export const OneItem: Story = {
  render: () => html`
    <demo-list>
      <demo-list-item></demo-list-item>
    </demo-list>
  `,
};

export const ManyItems: Story = {
  render: () => html`
    <demo-list>
      <demo-list-item></demo-list-item>
      <demo-list-item></demo-list-item>
      <demo-list-item></demo-list-item>
    </demo-list>
  `,
};
```

```ts filename="List.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

// 👇 We're importing the necessary stories from ListItem
import { Selected, Unselected } from './ListItem.stories';

const meta: Meta = {
  component: 'demo-list',
};

export default meta;
type Story = StoryObj;

export const ManyItems: Story = {
  render: (args) => html`
    <demo-list>
      ${Selected({ ...args, ...Selected.args })} ${Unselected({ ...args, ...Unselected.args })}
      ${Unselected({ ...args, ...Unselected.args })}
    </demo-list>
  `,
};
```

```ts filename="List.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-list',
};

export default meta;
type Story = StoryObj;

// Always an empty list, not super interesting
export const Empty: Story = {
  render: () => html`<demo-list></demo-list>`,
};
```

```ts filename="List.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

const meta: Meta = {
  title: 'List',
  component: 'demo-list',
};

export default meta;
type Story = StoryObj;

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

export const Empty: Story = {
  ...ListTemplate,
  args: {
    items: [],
  },
};

export const OneItem: Story = {
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

```ts filename="MyList.stories.ts" renderer="web-components" language="ts"
import { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

// 👇 Import the stories of MyListItem
import { Unchecked } from './my-list-item.stories';

const meta: Meta = {
  title: 'MyList',
  component: 'demo-my-list',
};
export default meta;

type Story = StoryObj;

export const OneItem: Story = {
  render: () => html` <List> ${Unchecked({ ...Unchecked.args })} </List> `,
};
```

```ts filename="List.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

const meta: Meta = {
  title: 'List',
  component: 'demo-list',
  subcomponents: { ListItem: 'demo-list-item' }, // 👈 Adds the ListItem component as a subcomponent
};
export default meta;

type Story = StoryObj;

export const Empty: Story = {};

export const OneItem: Story = {
  render: () => html`
    <demo-list>
      <demo-list-item></demo-list-item>
    </demo-list>
  `,
};
```

```ts filename="TodoItem.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import fetch from 'node-fetch';

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
const meta: Meta = {
  component: 'demo-todo-item',
  render: (args, { loaded: { todo } }) => TodoItem({ ...args, ...todo }),
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  loaders: [
    async () => ({
      todo: await (await fetch('https://jsonplaceholder.typicode.com/todos/1')).json(),
    }),
  ],
};
```

```ts filename="LoginForm.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { userEvent, within, expect } from '@storybook/test';

const meta: Meta = {
  component: 'demo-login-form',
};

export default meta;
type Story = StoryObj;

export const EmptyForm: Story = {};

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm: Story = {
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

```ts filename="YourPage.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { http, HttpResponse, delay } from 'msw';

const meta: Meta = {
  component: 'demo-document-screen',
};

export default meta;
type Story = StoryObj;

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

export const MockedSuccess: Story = {
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

export const MockedError: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
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

export default meta;
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'my-component',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    exampleProp: process.env.EXAMPLE_VAR,
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { userEvent, within } from '@storybook/test';

const meta: Meta = {
  component: 'demo-my-component',
};

export default meta;
type Story = StoryObj;

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ExampleWithRole: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button', { name: / button label/i }));
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { userEvent, within } from '@storybook/test';

const meta: Meta = {
  component: 'demo-my-component',
};

export default meta;
type Story = StoryObj;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FirstStory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByTestId('an-element'), 'example-value');
  },
};

export const SecondStory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByTestId('other-element'), 'another value');
  },
};

export const CombinedStories: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);

    // Runs the FirstStory and Second story play function before running this story's play function
    await FirstStory.play(context);
    await SecondStory.play(context);
    await userEvent.type(canvas.getByTestId('another-element'), 'random value');
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { userEvent, within } from '@storybook/test';

const meta: Meta = {
  component: 'demo-my-component',
};

export default meta;
type Story = StoryObj;

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const AsyncExample: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Other steps

    // Waits for the component to be rendered before querying the element
    await canvas.findByRole('button', { name: / button label/i });
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { userEvent, waitFor, within } from '@storybook/test';

const meta: Meta = {
  component: 'demo-my-component',
};

export default meta;
type Story = StoryObj;

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ExampleAsyncStory: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { userEvent, within } from '@storybook/test';

const meta: Meta = {
  component: 'demo-my-component',
};

export default meta;
type Story = StoryObj;

export const ExampleStory: Story = {
  play: async ({ canvasElement }) => {
    // Assigns canvas to the component root element
    const canvas = within(canvasElement);

    // Starts querying from the component's root element
    await userEvent.type(canvas.getByTestId('example-element'), 'something');
    await userEvent.click(canvas.getByRole('another-element'));
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { fireEvent, userEvent, within } from '@storybook/test';

const meta: Meta = {
  component: 'demo-my-component',
};

export default meta;
type Story = StoryObj;

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ClickExample: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button'));
  },
};

export const FireEventExample: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await fireEvent.click(canvas.getByTestId('data-testid'));
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { userEvent, within } from '@storybook/test';

const meta: Meta = {
  component: 'demo-my-component',
};

export default meta;
type Story = StoryObj;

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const DelayedStory: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { userEvent, within } from '@storybook/test';

const meta: Meta = {
  component: 'demo-my-component',
};

export default meta;
type Story = StoryObj;

// Function to emulate pausing between interactions
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const ExampleChangeEvent: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

const meta: Meta = {
  component: 'my-component',
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {};

export const WithProp: Story = {
  render: () => html`<my-component prop="value" />`,
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const meta: Meta = {
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

export default meta;
type Story = StoryObj;

export const MyStory: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  title: 'Path/To/MyComponent',
  component: 'my-component',
  decorators: [ ... ],
  parameters: { ... },
};

export default meta;
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

const meta: Meta = {
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

export default meta;
type Story = StoryObj;

export const StoryWithLocale: Story = {
  render: (args, { globals: { locale } }) => {
    const caption = getCaptionForLocale(locale);
    return html`<p>${caption}</p>`;
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'my-component',
  includeStories: ['SimpleStory', 'ComplexStory'], // 👈 Storybook loads these stories
  excludeStories: /.*Data$/, // 👈 Storybook ignores anything that contains Data
};

export const simpleData = { foo: 1, bar: 'baz' };
export const complexData = { foo: 1, foobar: { bar: 'baz', baz: someData } };

export default meta;
type Story = StoryObj;

export const SimpleStory: Story = {
  args: {
    data: simpleData,
  },
};

export const ComplexStory: Story = {
  args: {
    data: complexData,
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'my-component',
};

export default meta;
type Story = StoryObj;

export const Simple: Story = {
  decorators: [],
  name: 'So simple!',
  parameters: {},
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'my-component',
};

export default meta;
type Story = StoryObj;

export const ExampleStory: Story = {
  args: {
    propertyA: import.meta.env.STORYBOOK_DATA_KEY,
    propertyB: import.meta.env.VITE_CUSTOM_VAR,
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'my-component',
};

export default meta;
type Story = StoryObj;

export const ExampleStory: Story = {
  args: {
    propertyA: process.env.STORYBOOK_DATA_KEY,
  },
};
```

```ts filename="FooBar.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'OtherFoo/Bar',
  component: 'foo',
  id: 'Foo/Bar', // Or 'foo-bar' if you prefer
};

export default meta;
type Story = StoryObj;

export const Baz: Story = {
  name: 'Insert name here',
};
```

```ts filename="Page.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit';

type CustomArgs = { footer?: string };

const meta: Meta<CustomArgs> = {
  title: 'Page',
  component: 'demo-page',
  render: ({ footer }) => html`
    <demo-page>
      <footer>${footer}</footer>
    </demo-page>
  `,
};

export default meta;
type Story = StoryObj<CustomArgs>;

export const CustomFooter: Story = {
  args: {
    footer: 'Built with Storybook',
  },
};
```

```ts filename="YourPage.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

// 👇 Imports the required stories
import PageLayout from './PageLayout.stories';
import DocumentHeader from './DocumentHeader.stories';
import DocumentList from './DocumentList.stories';

const meta: Meta = {
  component: 'demo-document-screen',
};

export default meta;
type Story = StoryObj;

export const Simple: Story = {
  args: {
    user: PageLayout.Simple.args.user,
    document: DocumentHeader.Simple.args.document,
    subdocuments: DocumentList.Simple.args.documents,
  },
};
```

```ts filename="Page.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

// 👇 Imports all Header stories
import * as HeaderStories from './Header.stories';

const meta: Meta = {
  component: 'demo-page',
};

export default meta;
type Story = StoryObj;

export const LoggedIn: Story = {
  args: {
    ...HeaderStories.LoggedIn.args,
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
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

```ts filename="RegistrationForm.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { userEvent, within } from '@storybook/test';

const meta: Meta = {
  component: 'demo-registration-form',
};

export default meta;
type Story = StoryObj;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const FilledForm: Story = {
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

```ts filename="YourPage.ts" renderer="web-components" language="ts"
import { LitElement, html } from 'lit-element';

@customElement('demo-document-screen')
class DocumentScreen extends LitElement {
  @property({ type: Object })
  data: {
    user: Record<string, unknown>;
    document: Record<string, unknown>;
    subdocuments: Array<Record<string, unknown>>;
  } = {};

  constructor() {
    super();
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

declare global {
  interface HTMLElementTagNameMap {
    'demo-document-screen': DocumentScreen;
  }
}
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
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

export default meta;
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'my-component',
};

export default meta;
type Story = StoryObj;

export const ExampleStory: Story = {
  parameters: {
    a11y: {
      // This option disables all a11y checks on this story
      disable: true,
    },
  },
};
```

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'my-component',
};

export default meta;
type Story = StoryObj;

export const ExampleStory: Story = {
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

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

// To apply a set of backgrounds to all stories of Button:
const meta: Meta = {
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

export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Large: Story = {
  parameters: {
    backgrounds: { disable: true },
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Large: Story = {
  parameters: {
    backgrounds: {
      grid: {
        disable: true,
      },
    },
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const Large: Story = {
  parameters: {
    backgrounds: { default: 'facebook' },
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
  // Sets the layout parameter component wide.
  parameters: {
    layout: 'centered',
  },
};

export default meta;
```

```ts filename="components/MyComponent/MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'my-component',
  title: 'components/MyComponent/MyComponent',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    something: 'Something else',
  },
};
```

```ts filename="Form.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { userEvent, waitFor, within, expect, fn } from '@storybook/test';

const meta: Meta = {
  component: 'my-form-element',
  args: {
    // 👇 Use `fn` to spy on the onSubmit arg
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const Submitted: Story = {
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

```ts filename="MyComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

import { userEvent, within } from '@storybook/test';

const meta: Meta = {
  title: 'MyComponent',
  component: 'my-component',
};

export default meta;
type Story = StoryObj;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvasElement to query the DOM
 */
export const Submitted: Story = {
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

```ts filename=".storybook/preview.ts" renderer="web-components" language="ts"
import type { Preview } from '@storybook/web-components';
import { setCustomElementsManifest } from '@storybook/web-components';

import customElements from '../custom-elements.json';

setCustomElementsManifest(customElements);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  component: 'demo-button',
};

export default meta;
type Story = StoryObj;

export const WithLayout: Story = {
  parameters: {
    layout: 'centered',
  },
};
```

```ts filename="NoteUI.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { saveNote } from '../../app/actions.mock';
import { createNotes } from '../../mocks/notes';

const meta: Meta = {
  title: 'Mocked/NoteUI',
  component: 'note-ui',
};
export default meta;

type Story = StoryObj;

const notes = createNotes();

export const SaveFlow: Story = {
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

```ts filename="Page.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

// 👇 Must include the `.mock` portion of filename to have mocks typed correctly
import { getUserFromSession } from '../../api/session.mock';

const meta: Meta = {
  component: 'my-page',
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  async beforeEach() {
    // 👇 Set the return value for the getUserFromSession function
    getUserFromSession.mockReturnValue({ id: '1', name: 'Alice' });
  },
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta } from '@storybook/web-components';

const meta: Meta = {
  title: 'Button',
  component: 'demo-button',
  //👇 Enables auto-generated documentation for this component and includes all stories in this file
  tags: ['autodocs'],
};
export default meta;
```

```ts filename="Page.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Page',
  component: 'demo-page',
  // 👇 Disable auto-generated documentation for this component
  tags: ['!autodocs'],
};
export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Button',
  component: 'demo-button',
  //👇 Enables auto-generated documentation for this component and includes all stories in this file
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const UndocumentedStory: Story = {
  // 👇 Removes this story from auto-generated documentation
  tags: ['!autodocs'],
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Button',
  component: 'demo-button',
};
export default meta;

type Story = StoryObj;

export const Variant1: Story = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 1 },
};

export const Variant2: Story = {
  // 👇 This story will not appear in Storybook's sidebar or docs page
  tags: ['!dev', '!docs'],
  args: { variant: 2 },
};

// Etc...

export const Combo: Story = {
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

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Button',
  component: 'demo-button',
  /**
   * 👇 All stories in this file will:
   *    - Be included in the docs page
   *    - Not appear in Storybook's sidebar
   */
  tags: ['autodocs', '!dev'],
};
export default meta;
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
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
export default meta;

type Story = StoryObj;

export const ExperimentalFeatureStory: Story = {
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

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Button',
  component: 'demo-button',
  // 👇 Applies to all stories in this file
  tags: ['stable'],
};
export default meta;

type Story = StoryObj;

export const ExperimentalFeatureStory: Story = {
  /**
   * 👇 For this particular story, remove the inherited
   *    `stable` tag and apply the `experimental` tag
   */
  tags: ['!stable', 'experimental'],
};
```

```ts filename="Button.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Button',
  component: 'demo-button',
};

export default meta;

export const Basic: StoryObj = {};

export const Primary: StoryObj = {
  args: {
    primary: true,
  },
};
```

```ts filename=".storybook/main.ts" renderer="web-components" language="ts"
import { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  // ...
  framework: '@storybook/web-components-vite', // 👈 Add this
};

export default config;
```

```ts filename=".storybook/main.ts" renderer="web-components" language="ts"
import { StorybookConfig } from '@storybook/web-components-webpack5';

const config: StorybookConfig = {
  // ...
  framework: '@storybook/web-components-webpack5', // 👈 Add this
};

export default config;
```

```ts filename="YourComponent.stories.ts" renderer="web-components" language="ts"
import { html } from 'lit';

import type { Meta } from '@storybook/web-components';

const meta: Meta<YourComponentProps> = {
  component: 'demo-your-component',
  decorators: [(story) => html`<div style="margin: 3em">${story()}</div>`],
};
export default meta;
```

```ts filename="YourComponent.stories.ts" renderer="web-components" language="ts"
import type { Meta, StoryObj } from '@storybook/web-components';

// This default export determines where your story goes in the story list
const meta: Meta = {
  component: 'demo-your-component',
};

export default meta;
type Story = StoryObj;

export const FirstStory: Story = {
  args: {
    // 👇 The args you need here will depend on your component
  },
};
```

