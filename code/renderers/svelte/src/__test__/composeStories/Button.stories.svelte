<script>
  import Story from '../../svelte-csf/components/Story.svelte';
  import Meta from '../../svelte-csf/components/Meta.svelte';
  import Template from '../../svelte-csf/components/Template.svelte';

  import Button from './Button.svelte';

  let count = 0;
  function handleClick() {
    count += 1;
  }
</script>

<!-- Stories about a Button -->
<Meta component={Button} />

<Template let:args>
  <Button {...args} on:click={handleClick} on:click>
    You clicked: {count}
  </Button>
</Template>

<Story name="Default" />

<Story name="Primary" args={{ primary: true }} />

<Story name="Button No Args">
  <Button label="explicit label prop">Text in the slot</Button>
</Story>
