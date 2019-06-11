<script>
  import { storiesOf, Story } from '@storybook/svelte3';

  import Button from '../components/Button.svelte';

  storiesOf('Addon|Notes', module);
</script>

<Story
  name="Simple note"
  parameters={{ notes: 'My notes on the ButtonView component' }}>
  <Button />
</Story>

<Story name="Note with HTML" parameters={{
  notes: `
    <h2>My notes on emojies</h2>

    <em>It's not all that important to be honest, but..</em>

    Emojis are great, I love emojis, in fact I like using them in my Component notes too! 😇
  `
}}>
  <Button text="🤔😳😯😮😄😩😓😱🤓😑😶😊" />
</Story>
