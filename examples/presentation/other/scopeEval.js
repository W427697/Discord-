export function scopeEval(source, scope) {
  // eslint-disable-next-line no-new-func
  return Function(`
    "use strict";
    ${Object.keys(scope)
      .map(k => {
        return `const ${k} = this.${k}`;
      })
      .join(';\n')}
    const output = ${source};
    return output;
  `).bind(scope)();
}
