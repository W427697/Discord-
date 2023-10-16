export function isDecoratorInstanceOf(
  decorator: any,
  name: 'Component' | 'Directive' | 'Pipe' | 'Input' | 'Output' | 'NgModule'
) {
  return decorator?.ngMetadataName === name;
}
