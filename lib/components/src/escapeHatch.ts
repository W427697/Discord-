import React, { FunctionComponent } from 'react';

export function escapeHatch(component: FunctionComponent): string {
  const name = component.displayName || component.name || 'component';
  const cleanName = `sbdocs sbdocs-${name.toLowerCase()}`;
  return cleanName;
}
