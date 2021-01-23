<script>
  import { useContext } from './context';

  const context = useContext();

  export let name = 'default';

  context.register({name, isTemplate: true});

  $: render = context.render && context.templateName === name;
</script>

{#if render}
  <slot args={context.args} {...context.args}/>
{/if}
  