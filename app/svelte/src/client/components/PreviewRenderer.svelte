<script>
  import { stripIndents } from 'common-tags';
  import PreviewWrapper from './PreviewWrapper.svelte';
  export let story;
  if (!story) {
    throw new Error('Missing story');
  }
  const { wrappers = [] } = story;
</script>

<!--
This component is the entry point for the `render` method.
It passes the story (i.e. Component & props) and the initial wrappers to
PreviewWrapper, that will render itself recursively until it has consumed all
wrappers in the pipeline, and eventually render the story's Component.
-->
<PreviewWrapper {story} {wrappers} />
