<script>
  import { storiesOf, StoriesOf, Story } from '@storybook/svelte3';
  import { linkTo } from '@storybook/addon-links';

  storiesOf(module);
</script>

<p>
  In Storybook for Svelte 3, <code>storiesOf</code> allows to prebind the
  <code>StoriesOf</code> component.
</p>

<pre>{`
    <script>
      import { storiesOf, StoriesOf, Story } from '@storybook/svelte3';

      storiesOf(module);
    </script>

    <StoriesOf kind="syntax|Context/StoriesOf">
      <Story name="first">
        First story of first context StoriesOf
      </Story>
    </StoriesOf>

    <StoriesOf kind="syntax|Context/StoriesOf/Another">
      <Story name="first">
        First story of first context StoriesOf
      </Story>
    </StoriesOf>
`}</pre>

<p>
  It also allows to prebind the
  <a href on:click|preventDefault={linkTo('syntax|Context/Story')}>
    kind of stories</a>,
  making it possible to completely spare the <code>StoriesOf</code> component
  in most cases.
</p>

<hr>

<StoriesOf kind="syntax|Context/StoriesOf">
  <Story name="first">
    First story of the first StoriesOf
  </Story>
  <Story name="second">
    Second story of the first StoriesOf
  </Story>
</StoriesOf>

<StoriesOf kind="syntax|Context/StoriesOf/Another">
  <Story name="first">
    First story of the other StoriesOf
  </Story>
  <Story name="second">
    Second story of the other StoriesOf
  </Story>
</StoriesOf>
