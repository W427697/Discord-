import { FunctionComponent } from 'react';

function caml(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function additionalClassesFormatting(additionalClasses: string): string {
  return additionalClasses ? ` ${additionalClasses}` : '';
}

export function docsEscapeHatch(component: FunctionComponent, additionalClasses?: string): string {
  const name = component.displayName || component.name || '';
  const cleanName = `sbdocs sbdocs-${caml(name)}${additionalClassesFormatting(additionalClasses)}`;
  return cleanName;
}

export function docsEscapeHatchFromId(id: string, additionalClasses?: string): string {
  return `sbdocs sbdocs-${id}${additionalClassesFormatting(additionalClasses)}`;
}
