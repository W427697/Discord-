import { getOptions } from 'loader-utils';
import injectDecorator from './inject-decorator';

function transform(source) {
  const options = getOptions(this) || {};
  return injectDecorator(source, this.resourcePath, options);
}

export default transform;
