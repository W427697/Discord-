import { parsers } from 'prettier/plugins/flow';

function parse(source) {
  return parsers.flow.parse(source);
}
function format(source) {
  return parsers.flow.format(source);
}

export default {
  parse,
  format,
};
