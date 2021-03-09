import path from 'path';
import { process as ngccProcess } from '@angular/compiler-cli/ngcc';

/**
 * Run ngcc for converting modules to ivy format before starting storybook
 * This step is needed in order to support Ivy in storybook
 *
 * Information about Ivy can be found here https://angular.io/guide/ivy
 */
export function runNgcc() {
  ngccProcess({
    basePath: path.join(process.cwd(), 'node_modules'), // absolute path to node_modules
    createNewEntryPointFormats: true, // --create-ivy-entry-points
    compileAllFormats: false, // --first-only
  });
}
