declare var LOGLEVEL: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent' | undefined;

declare global {
  function telemetry({
    isError,
    payload,
  }:
    | {
        isError: true;
        payload: Error;
      }
    | {
        isError: false;
        payload: unknown;
      }): void;
}
