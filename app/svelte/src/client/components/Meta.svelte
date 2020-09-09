<script>
  import { getRegister, getRender } from './context';
  export let title;
  export let decorators;
  export let parameters;
  export let argTypes;
  const register = getRegister();
  const render = getRender();
  const isMyKind = ({ selectedKind }) => selectedKind === title;
  if (register) {
    register.addMeta({
      title,
      decorators,
      parameters,
      argTypes,
    });
  }
</script>

{#if register || (render && isMyKind(render))}
  <slot />
{/if}
