import { $ } from 'zx';

/**
 * Create a tmp directory using `mktemp` command and return the result
 */
export async function createTmpDir() {
  return (await $`mktemp -d`).toString().replace('\n', '');
}

export async function copy(sourceFile: string, targetDirectory: string) {
  return $`cp ${sourceFile} ${targetDirectory}`;
}
