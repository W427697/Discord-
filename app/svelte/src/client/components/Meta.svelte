<script>
  import { getRegister } from './context';
  export let title;
  export let decorators;
  export let parameters;
  export let argTypes;
  export let component;
  const register = getRegister();
  if (register) {
    register.addMeta({
      title,
      component,
      decorators,
      parameters,
      argTypes,
    });
  }
</script>
