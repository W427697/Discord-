interface PTBaseType {
  name: string;
  description?: string;
  required?: boolean;
}

export type PTType = PTBaseType & {
  value?: any;
  raw?: string;
  computed?: boolean;
};

// We need export something otherwise webpack cache will break
// See https://github.com/webpack/webpack/issues/15214
export function noop () {};
