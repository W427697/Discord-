import { VueConstructor } from 'vue';
import { PropValidator } from 'vue/types/options';

function getType(fn?: Function): string {
  const match = fn?.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : '';
}

/**
 * Extracts the default value of a prop
 * Also see https://github.com/vuejs/vue/blob/dev/src/core/util/props.js#L92
 */
function resolveDefault<T>(validator: PropValidator<T>): T | null | undefined {
  if (typeof validator === 'function' || Array.isArray(validator)) {
    return undefined;
  }

  const canTakeFunctionProp = Array.isArray(validator.type)
    ? validator.type.some((t) => getType(t) === 'Function')
    : getType(validator.type) === 'Function';

  if (typeof validator.default === 'function' && canTakeFunctionProp) {
    // known limitation: we don't have the component instance to pass
    return (validator.default as () => T | null | undefined)();
  }

  return validator.default as T | null | undefined;
}

/** Extracts the default values for all props in a component */
export function extractProps(component: VueConstructor): Record<string, unknown> {
  if (Array.isArray(component.options.props)) {
    return component.options.props.reduce((wrap, prop) => ({ ...wrap, [prop]: undefined }), {});
  }
  return Object.entries(component.options.props ?? {})
    .map(([name, prop]) => ({ [name]: resolveDefault(prop) }))
    .reduce((wrap, prop) => ({ ...wrap, ...prop }), {});
}
