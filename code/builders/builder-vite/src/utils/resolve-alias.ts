import path from 'path';
import fs from 'fs';
import type { InlineConfig } from 'vite';

function resolveReplacementPath(replacement: string, root?: string) {
  const isAbsolutePath = path.isAbsolute(replacement);

  if (isAbsolutePath && !fs.existsSync(replacement) && root) {
    const possiblePath = path.join(root, replacement);
    if (fs.existsSync(possiblePath)) return possiblePath;
  }

  return replacement;
}

/**
 * Resolve the alias from the vite config when the replacement path is relate to the root of vite server to generate an absolute path relate to the system
 * @example { '@': '/src' } => { '@': '/home/projects/vue3-vite/src' }
 */
export function resolveAlias(config: InlineConfig) {
  const resolvedAlias: Record<string, string> = {};
  const alias = config.resolve?.alias || {};

  if (Array.isArray(alias)) {
    alias.forEach((item) => {
      resolvedAlias[item.find] = resolveReplacementPath(item.replacement, config.root);
    });
  } else {
    Object.entries(alias).forEach(([find, replacement]) => {
      resolvedAlias[find] = resolveReplacementPath(replacement, config.root);
    });
  }

  return resolvedAlias;
}
