<script>
  import { getRegister } from './context';
  export let name;
  export let decorators;
  export let parameters;
  export let argTypes;
  export let component;
  if (!name) {
    throw new Error('Missing Story name');
  }
  const register = getRegister();
  if (register) {
    register.addStory({
      name,
      component,
      decorators,
      parameters,
      argTypes,
    });
  }
</script>
