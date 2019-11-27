/* eslint-disable no-new-func */
export function scopeEval(source: any, scope: any) {
  // eslint-disable-next-line no-new-func
  const outputWithoutConst = source.replace('const', '');
  const variableName = outputWithoutConst.substring(0, outputWithoutConst.indexOf('=') - 1);

  return Function(`
  "use strict";
  ${Object.keys(scope)
    .map(k => {
      return `const ${k} = this.${k}`;
    })
    .join(';\n')}
  const ${outputWithoutConst};
  return ${variableName}();
`).bind(scope)();
}
