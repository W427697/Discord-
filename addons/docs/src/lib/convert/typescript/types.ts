interface TSBaseType {
  name: string;
  type?: string;
  raw?: string;
  required?: boolean;
}

type TSArgType = TSType;

type TSCombinationType = TSBaseType & {
  name: 'union' | 'intersection';
  elements: TSType[];
};

type TSFuncSigType = TSBaseType & {
  name: 'signature';
  type: 'function';
  signature: {
    arguments: TSArgType[];
    return: TSType;
  };
};

type TSObjectSigType = TSBaseType & {
  name: 'signature';
  type: 'object';
  signature: {
    properties: {
      key: string;
      value: TSType;
    }[];
  };
};

type TSScalarType = TSBaseType & {
  name: 'any' | 'boolean' | 'number' | 'void' | 'string' | 'symbol';
};

type TSArrayType = TSBaseType & {
  name: 'Array';
  elements: TSType[];
};

export type TSSigType = TSObjectSigType | TSFuncSigType;

export type TSType = TSScalarType | TSCombinationType | TSSigType | TSArrayType;

// We need to export something otherwise webpack cache will break
// See https://github.com/webpack/webpack/issues/15214
export function noop () {};
