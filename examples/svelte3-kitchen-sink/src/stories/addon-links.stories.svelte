<script>
  import { storiesOf, Story } from '@storybook/svelte3';
  import { linkTo } from '@storybook/addon-links';

  storiesOf('Addon|Links', module);
</script>

<Story name="Go to welcome view">
  <div class="main">
    <h1>Link Action</h1>
    <button on:click={linkTo('Welcome')} class="link">
      Return to the <code class="code">Welcome</code> view story.
    </button>
  </div>
</Story>
