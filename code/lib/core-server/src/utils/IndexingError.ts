export class IndexingError extends Error {
  absolutePaths: string[];

  constructor(message: string, stack: string, absolutePaths: string[]) {
    super();
    this.message = message;
    this.stack = stack;
    this.absolutePaths = absolutePaths;
  }

  pathsString() {
    if (this.absolutePaths.length === 1) {
      return `${this.absolutePaths[0]}`;
    }

    return `${this.absolutePaths}`;
  }

  toString() {
    return `${this.pathsString()}: ${this.message}`;
  }
}

export function formatIndexingErrors(errors: IndexingError[]) {
  if (errors.length === 0) throw new Error('Unexpected empty error list');

  if (errors.length === 1) {
    const [err] = errors;
    return `🚨 Unable to index ${err.pathsString()}: \n  ${err.stack}`;
  }

  return `🚨 Unable to index files:\n${errors.map((err) => `- ${err}`).join('\n')}`;
}
