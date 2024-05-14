```mdx renderer="common" language="mdx"
{/* Checkbox.mdx */}

import { Canvas, Meta } from '@storybook/blocks';

import * as CheckboxStories from './Checkbox.stories';

<Meta of={CheckboxStories} />

# Checkbox

A checkbox is a square box that can be activated or deactivated when ticked. 

Use checkboxes to select one or more options from a list of choices.

<Canvas of={CheckboxStories.Unchecked} />
````

```mdx renderer="common" language="mdx"
{/* src/components/Button/Button.mdx */}

import { Meta } from '@storybook/blocks';

{/* 👇 Documentation-only page */}
<Meta title="Documentation" />


{/* 👇 Component documentation page */}
import * as ExampleComponentStories from './ExampleComponent.stories';

<Meta of={ExampleComponentStories} /> 
```

```md renderer="common" language="mdx"
{/* Custom-MDX-Documentation.mdx */}

# Replacing DocsPage with custom `MDX` content

This file is a documentation-only `MDX`file to customize Storybook's [DocsPage](https://storybook.js.org/docs/writing-docs/docs-page#replacing-docspage).

It can be further expanded with your own code snippets and include specific information related to your stories.

For example:

import { Story } from "@storybook/addon-docs";

## Button

Button is the primary component. It has four possible states.

- [Primary](#primary)
- [Secondary](#secondary)
- [Large](#large)
- [Small](#small)

## With the story title defined

If you included the title in the story's default export, use this approach.

### Primary

<Story id="example-button--primary" />

### Secondary

<Story id="example-button--secondary" />

### Large

<Story id="example-button--large" />

### Small

<Story id="example-button--small" />

## Without the story title defined

If you didn't include the title in the story's default export, use this approach.

### Primary

<Story id="your-directory-button--primary"/>

### Secondary

<Story id="your-directory-button--secondary"/>

### Large

<Story id="your-directory-button--large"/>

### Small

<Story id="your-directory-button--small" />
```
````md renderer="common" language="mdx"
{/* MyComponent.mdx */}

import { Meta } from '@storybook/blocks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

<Meta title="A Storybook doc with a custom syntax highlight for SCSS" />

# SCSS example

This is a sample SCSS code block example highlighted in Storybook

{/* Don't forget to replace (") with (```) when you copy the snippet to your own app */}

"scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
"

{/* The usage of this "Component" is intentional to enable react-syntax-highlighter's own highlighter */}

export const Component = () => {
  return <SyntaxHighlighter/>;
};
````

```md renderer="common" language="mdx"
{/* MyComponent.mdx */}

import { Meta } from '@storybook/blocks';

<Meta title="A storybook story with syntax highlight registered globally" />

# SCSS example

This is a sample Sass snippet example with Storybook docs

{/* Don't forget to replace (") with (```) when you copy the snippet to your own app */}

"scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
font: 100% $font-stack;
  color: $primary-color;
}
"
```
 renderer="common" language="mdx"
```mdx
{/* Button.mdx */}

import { Meta } from '@storybook/blocks';

<Meta title="Button" />

# Definition

Button is a clickable interactive element that triggers a response.

You can place text and icons inside of a button.

Buttons are often used for form submissions and to toggle elements into view.

## Usage

The component comes in different variants such as `primary`, `secondary`, `large` and `small` which you can use to alter the look and feel of the button.

## Inputs

Button has the following properties:

- `primary` - If `true`, the button will have a primary style.
- `size` - The size of the button.
- `label` - The label of the button.
- `backgroundColor` - The background color of the button.
- `onClick` - Callback function when clicked.
```

 renderer="common" language="mdx"
```mdx
{/* src/components/Select.mdx */}

# Select

Select is a type of input that allows users to choose one or more options from a list of choices. 

The options are hidden by default and revealed when a user interacts with an element. 

It shows the currently selected option in its default collapsed state.

## Design implementation

To help users get acquainted with the existing UI elements, it is recommended to use check the Figma file to see how the select input is implemented.

### When to use?

In a select input where there are less than 3-4 items, consider using radio boxes, or radio inputs instead. 

### How to use?

To help users understand the options available in a select input, include a default option that is unselectable and acts as a label.

```

```md renderer="common" language="mdx"
# Checkbox

A checkbox is a square box that can be activated or deactivated when ticked.

Use checkboxes to select one or more options from a list of choices.
```
```mdx renderer="common" language="mdx"
{/* ExampleDocumentation.mdx */}

import { Meta } from '@storybook/blocks';

import * as ExampleComponentStories from './ExampleComponent.stories';

{/* 👇 Documentation-only page */}

<Meta title="Documentation" />

{/* 👇 Component documentation page */}

<Meta of={ExampleComponentStories} /> 
```

```mdx renderer="common" language="mdx"
{/* Guideline.mdx */}

<Guidelines>
  <Dos>
    - Use buttons for the main actions on your page 
    - Identify the primary action and make it `primary`
  </Dos>
  <Donts>
    - Use a button when a link will do (e.g., for navigation-only actions) 
    - Use multiple `primary` buttons in a single UI state
  </Donts>
</Guidelines>
```

```mdx renderer="common" language="mdx"
{/* Checkbox.mdx */}

import { Canvas, Meta } from '@storybook/blocks';

import * as CheckboxStories from './Checkbox.stories';
```

```mdx renderer="common" language="mdx"
{/* Checkbox.mdx */}

import { Meta } from '@storybook/blocks';

import * as CheckboxStories from './Checkbox.stories';

<Meta of={CheckboxStories} />
```

```mdx renderer="common" language="mdx"
{/* Checkbox.mdx */}

import { Canvas } from '@storybook/blocks';

import * as CheckboxStories from './Checkbox.stories';

<Canvas of={CheckboxStories.Unchecked} />
```

```mdx renderer="common" language="mdx"
{/* Page.mdx */}

import { Canvas, Meta, Story } from '@storybook/blocks';

import * as ListStories from './List.stories';

import * as ListItemStories from './ListItem.stories';

import * as PageStories from './Page.stories';

<Meta of={PageStories} />

# Page

Page is a layout container that is used to position children in predetermined areas. 

It's often used to apply consistent positioning for content across pages in an application

## Usage

<Canvas of={PageStories.Basic} />

# List

List is a grouping of related items. List can be ordered with multiple levels of nesting.

## Usage

<Story of={ListStories.Filled} />

# List Item

List items are used to group related content in a list. They must be nested within a List component.

## Usage

<Story of={ListItemStories.Starter} meta={ListItemStories} />
```

```mdx renderer="common" language="mdx"
{/* src/GettingStarted.mdx */}

# Getting Started

Welcome! Whether you're a designer or a developer, this guide will help you get started and connect you to the essential resources you need.

## Table of Contents

- [Design Resources](#design-resources)
  - [Figma](#figma)
  - [UI/UX Design Guidelines](#uiux-design-guidelines)
  - [Design Assets](#design-assets)

- [Development Resources](#development-resources)
  - [Coding Standards](#coding-standards)
  - [Version Control](#version-control)
  - [Development Tools](#development-tools)

---

## Design Resources

### Figma

[Figma](https://www.figma.com/) is a collaborative design and prototyping tool. It's the heart of the design process, allowing designers to work together seamlessly.

- **Get Access**: If you're not already part of the Figma project, request access from the project lead or manager.

### UI/UX Design Guidelines

Before you dive into designing, familiarize yourself with our UI/UX design guidelines. They provide valuable insights into our design philosophy and standards.

- [UI/UX Guidelines Document](https://your-design-guidelines-link.com)

### Design Assets

All the essential design assets like logos, icons, and brand guidelines can be found in the Figma project. Ensure you have access and familiarize yourself with these assets for consistency.

---

## Development Resources

### Coding Standards

Maintaining a consistent code style is essential for collaborative development. Our coding standards document will guide you on best practices.

- [Coding Standards Document](https://your-coding-standards-link.com)

### Version Control

We use Git for version control. Make sure you have Git installed and are familiar with its basics.

### Development Tools

Your development environment is critical. Here are some tools and resources to help you set up your workspace:

- **Code Editor**: We recommend using [Visual Studio Code](https://code.visualstudio.com/) for development. It's highly customizable and supports a wide range of extensions.

- **Package Manager**: [npm](https://www.npmjs.com/) is the package manager we use for JavaScript projects. Install it to manage project dependencies.

---
```

```mdx renderer="common" language="mdx"
{/* Button.mdx */}

import { Meta, Story } from '@storybook/blocks';

import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

# Button

Button is a clickable interactive element that triggers a response.

You can place text and icons inside of a button.

Buttons are often used for form submissions and to toggle elements into view.

## Usage

<Story of={ButtonStories.Basic} />
```

```mdx renderer="common" language="mdx"
{/* Changelog.mdx */}

import { Meta, Markdown } from "@storybook/blocks";

import Readme from "../../Changelog.md?raw";

<Meta title="Changelog" />

# Changelog

<Markdown>{Readme}</Markdown>
```

```mdx renderer="common" language="mdx"
{/* DocumentationTemplate.mdx */}

import { Meta, Title, Primary, Controls, Stories } from '@storybook/blocks';

{/* 
  * 👇 The isTemplate property is required to tell Storybook that this is a template
  * See https://storybook.js.org/docs/api/doc-block-meta
  * to learn how to use
*/}

<Meta isTemplate />

<Title />

# Default implementation

<Primary />

## Inputs

The component accepts the following inputs (props):

<Controls />

---

## Additional variations

Listed below are additional variations of the component.

<Stories />

```

```md renderer="react" language="mdx"
{/* Checkbox.mdx */}

import { Canvas, Meta, Story } from '@storybook/blocks';
import * as CheckboxStories from './Checkbox.stories';

<Meta of={CheckboxStories} />

# Checkbox

With `MDX` we can compose Markdown documentation with `Checkbox` stories and interactive controls.

<Canvas>
  <Story of={CheckboxStories.Unchecked} />
</Canvas>
```

