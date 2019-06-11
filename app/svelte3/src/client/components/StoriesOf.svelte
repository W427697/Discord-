<script>
  import { getContext } from 'svelte';
  import storiesOf from '../utils/storiesOf';
  import {
    CTX_MODULE,
    CTX_STORIES,
    CTX_DECORATORS,
    CTX_PARAMETERS,
    CTX_RENDER,
    CTX_REGISTER,
  } from '../constants';

  export let kind;
  // export let module;
  let m;
  export { m as module };
  export let parameters;

  if (!m) {
    m = getContext(CTX_MODULE);
  }

  storiesOf(kind, m);

  const register = getContext(CTX_REGISTER);
  const render = getContext(CTX_RENDER);

  const isMyKind = ({ selectedKind }) => selectedKind === kind;

  if (register) {
    const stories = getContext(CTX_STORIES);
    const decorators = getContext(CTX_DECORATORS);
    const ctxParams = getContext(CTX_PARAMETERS);
    if (decorators) {
      decorators.forEach(decorator => stories.addDecorator(...decorator));
    }
    if (ctxParams) {
      ctxParams.forEach(params => stories.addParameters(...params));
    }
    if (parameters) {
      if (Array.isArray(parameters)) {
        parameters.forEach(params => stories.addParameters(params));
      } else {
        stories.addParameters(parameters);
      }
    }
  }
</script>

{#if register || render && isMyKind(render)}
  <slot />
{/if}
