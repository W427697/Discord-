<script>
  import { storiesOf, Story } from '@storybook/svelte3';
  import { linkTo } from '@storybook/addon-links';

  storiesOf('syntax|Context/Story', module);
</script>

<p>
  In Storybook for Svelte 3, <code>storiesOf</code> allows to prebind the
  <code>module</code> argument, but also the stories kind. In most cases,
  you can skip using the <code>StoriesOf</code> component altogether.
</p>

<pre>{`
    <script>
      import { storiesOf, Story } from '@storybook/svelte3';
      import { withKnobs, text, number } from '@storybook/addon-knobs';

      storiesOf('syntax|Context/Story', module)

        // you can still add decorators
        .addDecorator(withKnobs);
    </script>

    <Story name="first">
      First Story
    </Story>

    <Story name="second">
      Another Story
    </Story>
`}</pre>

<p>
  In cases where you need more control, like adding multiple kinds of stories
  in the same stories file (is this a good idea?), you can still bind only the
  <a href on:click|preventDefault={linkTo('syntax|Context/StoriesOf')}>
    <code>StoriesOf</code>'s <code>module</code>
  </a> argument.
</p>

<hr>

<Story name="first">
  First Story
</Story>

<Story name="second">
  Another Story
</Story>
