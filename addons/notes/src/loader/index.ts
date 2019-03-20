import { split } from './split';

const ADD_PARAMETER_STATEMENT = `.addParameters({
  props: { 
    norbert: 'string',
    michael: 'number',
  }
})`;

function transform(source: string) {
  const parts = split(source);
  // FIXME: fill in addParameters with something meaningful
  const newSource = parts.join(ADD_PARAMETER_STATEMENT);
  return newSource;
}

export default transform;
