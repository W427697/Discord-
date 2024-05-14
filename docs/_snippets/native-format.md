```html renderer="svelte" language="ts" tabTitle="native-format"
{/* Button.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';
  import Button from './Button.svelte';
</script>

{/*
  See https://storybook.js.org/docs/essentials/actions#action-argtype-annotation
  to learn how to set up argTypes for actions
*/}

<Meta title="Button" component={Button} argTypes={{ onClick: { action: "onClick" }, }} />

<template let:args>
  <button {...args} on:click="{args.onClick}" />
</template>

<Story name="Text" args={{ label: 'Hello' }}/>
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* Button.stories.svelte */}

<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf';

  import { action } from '@storybook/addon-actions';

  import Button from './Button.svelte';
</script>

<meta title="Button" component="{Button}" />

<Story name="Text"> <Button text="Hello" on:click={action('clicked')}/> </Story>
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* Button.stories.svelte */}

<script>
  import { Meta } from '@storybook/addon-svelte-csf';

  import Button from './Button.svelte';
</script>

<Meta title="Button" component={Button} args={{ primary: true, }} />
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* Button.stories.svelte */}

<script>
  import { Meta, Template } from '@storybook/addon-svelte-csf';

  import MarginDecorator from './MarginDecorator.svelte';

  import Button from './Button.svelte';
</script>

<meta title="Button" component="{Button}" />

<template let:args>
  <MarginDecorator>
    {/*👇 Your component here */}
  </MarginDecorator>
</template>
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* Button.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import Button from './Button.svelte';

  //👇 Some function to demonstrate the behavior
  function someFunction(someValue) {
    return `i am a ${someValue}`;
  }
</script>

{/*👇 Creates specific argTypes */}
<Meta title="Button" component={Button} argTypes={{ backgroundColor: { control: 'color' }, }} />

{/* 👇 Assigns the function result to a variable and pass it as a prop into the component */}
<template let:args>
  <button {...args} label="{someFunction(args.label)}" />
</template>

<Story name="ExampleStory" args={{ primary: true, size:'small', label: 'Button', }} />
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* Button.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import Button from './Button.svelte';
</script>

<Meta title="Button" component={Button} argTypes={{ label: { control: 'text' }, primary: { control:
'boolean' }, }} />

{/* 👇 We create a “template” of how args map to rendering */}
<template let:args>
  <button {...args} />
</template>

{/* 👇 Each story then reuses that template */}
<Story name="Primary" args={{ background: '#ff0', label: 'Button' }} /> <Story name="Secondary"
args={{ background: '#ff0', label: '😄👍😍💯' }} /> <Story name="Tertiary" args={{ background:
'#ff0', label: '📚📕📈🤓' }} />
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* Button.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import Button from './Button.svelte';
</script>

<Meta title="Button" component={Button} parameters={{ myAddon: { data: 'this data is passed to the
addon', }, }} />

<template let:args>
  <button {...args} />
</template>
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* Button.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import Button from './Button.svelte';
</script>

<Meta title="Button" component={Button} argTypes={{ label: { control: 'text' }, primary: { control:
'boolean' }, }} />

{/*👇 We create a “template” of how args map to rendering */}

<template let:args>
  <button {...args} />
</template>

{/* 👇 Each story then reuses that template */}

<Story name='Primary' args={{ primary: true, label: 'Button' }} />
```

```html renderer="svelte" language="ts" tabTitle="native-format"
<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf';

  import Button from './Button.svelte';
</script>

<meta title="Button" component="{Button}" />

<Story name="Primary">
  <button background="#ff0" label="Button" />
</Story>

<Story name="Secondary">
  <button background="#ff0" label="😄👍😍💯" />
</Story>

<Story name="Tertiary">
  <button background="#ff0" label="📚📕📈🤓" />
</Story>
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* Button.stories.svelte */}

<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf';

  import Button from './Button.svelte';
</script>

<meta title="Button" component="{Button}" />

<Story name="Primary">
  <button primary="true" label="Button" />
</Story>
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* Checkbox.stories.svelte */}

<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf';

  import Checkbox from './Checkbox.svelte';
</script>

<meta title="MDX/Checkbox" component="{Checkbox}" />

<Story name="allCheckboxes">
  <form>
    <Checkbox id="Unchecked" label="Unchecked" />
    <Checkbox id="Checked" label="Checked" {checked} />
    <Checkbox appearance="secondary" id="second" label="Secondary" {checked} />
  </form>
</Story>
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* YourComponent.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import YourComponent from './YourComponent.svelte';

  //👇 Some function to demonstrate the behavior
  function someFunction(valuePropertyA, valuePropertyB) {
    // Makes some computations and returns something
  }
</script>

{/*👇 Creates specific argTypes and automatically infers them when 'options' is defined */}

<Meta title="YourComponent" component={YourComponent} argTypes={{ propertyA: { options: ['Item One',
'Item Two', 'Item Three'], control: { type: 'select' }, }, propertyB: { options: ['Another Item
One', 'Another Item Two', 'Another Item Three'], }, }} />

<template let:args>
  <YourComponent {...args} someProperty="{someFunction(args.propertyA," args.propertyB)} />
</template>
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* MyComponent.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import MyComponent from './MyComponent.svelte';
</script>

<meta title="img" component="{MyComponent}" />

<template>
  <MyComponent
    src="https://storybook.js.org/images/placeholders/350x150.png"
    alt="My CDN placeholder"
  />
</template>

<Story name="WithAnImage" />
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* MyComponent.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import MyComponent from './MyComponent.svelte';

  import imageFile from './static/image.png';

  let image = {
    src: imageFile,
    alt: 'my image',
  };
</script>

<meta title="img" component="{MyComponent}" />

<template>
  <MyComponent {image} />
</template>

<Story name="WithAnImage" />
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* MyComponent.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import MyComponent from './MyComponent.svelte';
</script>

<meta title="img" component="{MyComponent}" />

<template>
  <MyComponent src="/image.png" alt="my image" />
</template>

<Story name="WithAnImage" />
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* List.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import List from './List.svelte';

  import ListItem from './ListItem.svelte';
</script>

<meta title="List" component="{List}" />

<template let:args id="Empty">
  <List {...args} />
</template>

<template let:args id="OneItem">
  <List {...args}>
    <ListItem />
  </List>
</template>

<template let:args id="ManyItems">
  <List {...args}>
    <ListItem />
    <ListItem />
    <ListItem />
  </List>
</template>

<Story name="Empty" template="Empty" />

<Story name="OneItem" template="OneItem" />

<Story name="MultipleItems" template="ManyItems" />
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* List.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import List from './List.svelte';
</script>

<meta title="List" component="{List}" />

<template let:args>
  <List {...args} />
</template>

<Story name="Empty">
  <List {...args} />
</Story>
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* MyComponent.stories.svelte */}

<script>
  import { Meta, Story } from '@storybook/addon-svelte-csf';
  import MyComponent from './MyComponent.svelte';
</script>

<Story name="Basic">
  <MyComponent />
</Story>

<Story name="WithProp">
  <MyComponent prop="value" />
</Story>
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* MyComponent.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

  import MyComponent from './MyComponent.svelte';
</script>

<Meta title="MyComponent" component={MyComponent} parameters={{ //👇 The viewports object from the
Essentials addon viewport: { //👇 The viewports you want to use viewports: INITIAL_VIEWPORTS, //👇
Your own default viewport defaultViewport: 'iphone6', }, }} />

<template let:args>
  <MyComponent {...args} />
</template>

<Story name="MyStory" parameters={{ viewport: { defaultViewport: 'iphonex', }, }} />
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* MyComponent.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import MyComponent from './MyComponent.svelte';
</script>

<meta title="MyComponent" component="{MyComponent}" />

<template let:args>
  <MyComponent {...args} />
</template>

<Story name="ExampleStory" args={{ propertyA: process.env.STORYBOOK_DATA_KEY, }} />
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* Page.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import Page from './Page.svelte';
</script>

<meta title="Page" component="{Page}" />

<template let:args>
  <Page {...args}>
    <footer>{args.footer}</footer>
  </Page>
</template>

<Story name="CustomFooter" args={{ footer: 'Built with Storybook', }} />
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/*Table.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import Table from './Table.svelte';
</script>

<Meta title="Custom Table" component={Table} argTypes={{ size: { options: ['small', 'medium',
'large'], }, }} />

<template let:args>
  <table {...args}>
    <tbody>
      {#each args.data as row}
      <tr>
        {#each row as col}
        <td>{col}</td>
        {/each}
      </tr>
      {/each}
    </tbody>
  </table>
</template>

{/* 👇 The data arg is for the story component and the remaining args get passed to the Table component */}
<Story name="Numeric" args={{ data: [ [1, 2, 3], [4, 5, 6], ], size: 'large', }} />
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* YourComponent.stories.svelte */}

<script>
  import { Meta, Template } from '@storybook/addon-svelte-csf';

  import MarginDecorator from './MarginDecorator.svelte';

  import YourComponent from './YourComponent.svelte';
</script>

<meta title="YourComponent" component="{YourComponent}" />

<template let:args>
  <MarginDecorator>
    {/*👇 Your component here */}
  </MarginDecorator>
</template>
```

```html renderer="svelte" language="ts" tabTitle="native-format"
{/* YourComponent.stories.svelte */}

<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf';

  import YourComponent from './YourComponent.svelte';
</script>

{/*👇 The title determines where your story goes in the story list */}
<Meta title="YourComponent" component={YourComponent} argTypes={{ /* Customize your args here
depending on your component */ }} />

<template let:args>
  <button {...args} />
</template>

<Story name="FirstStory" args={{ /* The args you need here will depend on your component */ }} />
```

