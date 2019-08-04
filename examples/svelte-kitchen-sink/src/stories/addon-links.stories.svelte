<script>
  import { Meta, Story } from '@storybook/svelte';
  import { linkTo } from '@storybook/addon-links';
</script>

<Meta title="Addon|Links" />

<Story name="Go to welcome view">
  <div class="main">
    <h1>Link Action</h1>
    <button on:click={linkTo('Welcome')} class="link">
      Return to the <code class="code">Welcome</code> view story.
    </button>
  </div>
</Story>
