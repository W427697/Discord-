<script>
  import { StoriesOf, Story } from '@storybook/svelte3';
  import { linkTo } from '@storybook/addon-links';
  // avoids svelte compiler's warning on undefined `module` variable
  const m = module;
</script>

<!-- extra markup is applied to every story in this file -->
<section>
  <p>
    Fully declarative syntax uses only <code>StoriesOf</code> and
    <code>Story</code> components.
  </p>
</section>

<StoriesOf kind="syntax|Fully declarative" {module}>
  <!-- extra markup is also allowed inside StoriesOf and Story components -->
  <p>
    This is the most direct form of fully declarative syntax, unfortunately it
    triggers a warning in svelte's compiler about undefined `module` variable.
  </p>
  <pre>{`
    <script>
      import { StoriesOf, Story } from '@storybook/svelte3';
    </script>

    <StoriesOf kind="My kind" {module}> <!-- {module} here triggers a compiler warning :( -->

      <Story name="first">
        <div>Add some svelte here!</div>
      </Story>

      <Story name="second">
        <div>Story 2</div>
      </Story>

    </StoriesOf>
  `}</pre>
  <p>
    Use <a href on:click|preventDefault={linkTo('syntax|Fully declarative/avoid compiler warning')}>
    this trick</a> to avoid the warning.
  </p>
  <hr>

  <Story name="first">
    First story of the first StoriesOf
  </Story>

  <Story name="second">
    Second story of the first StoriesOf
  </Story>
</StoriesOf>

<StoriesOf kind="syntax|Fully declarative/avoid compiler warning" module={m}>
  <p>
    Aliasing `module` to another variable in script allows to work around
    svelte compiler's warning.
  </p>
  <pre>{`
    <script>
      import { StoriesOf, Story } from '@storybook/svelte3';

      const m = module; // <- the solution
    </script>

    <StoriesOf kind="My kind" module={m}>

      <Story name="first">
        <div>Add some svelte here!</div>
      </Story>

      <Story name="second">
        <div>Story 2</div>
      </Story>

    </StoriesOf>
  `}</pre>
  <p>
    However, you'll probably want to use the
    <a href on:click|preventDefault={linkTo('syntax|Context/Story')}>
      <code>storiesOf</code>
    </a>
    function, for a lighter template code.
  </p>
  <hr>

  <Story name="first">
    First story of the second StoriesOf
  </Story>

  <Story name="second">
    Second story of the second StoriesOf
  </Story>
</StoriesOf>
