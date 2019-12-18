import { FunctionComponent } from 'react';

function toKebabCase(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function docsEscapeHatchFromId(id: string, additionalClasses?: string): string {
  const hasId = id && id !== '';
  const hasAdditionalClasses = additionalClasses && additionalClasses !== '';

  if (hasId && hasAdditionalClasses) {
    return `sbdocs sbdocs-${id} ${additionalClasses}`;
  }
  if (hasId) {
    return `sbdocs sbdocs-${id}`;
  }
  if (hasAdditionalClasses) {
    return additionalClasses;
  }
  return '';
}

export function docsEscapeHatch(component: FunctionComponent, additionalClasses?: string): string {
  const name = component.displayName || component.name || '';
  const kebabName = toKebabCase(name);

  return kebabName;
}
