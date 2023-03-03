export type Asynced<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => PromiseLike<any>
    ? T[K]
    : T[K] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : never;
};

interface Serial {
  id: number;
}

export interface RequestMessage extends Serial {
  method: string;
  args: unknown;
}

export enum Response {
  Success,
  Error,
}

export interface ResponseSuccess<T = unknown> extends Serial {
  kind: Response.Success;
  result: T;
}

export interface ResponseError<E = unknown> extends Serial {
  kind: Response.Error;
  error: E;
}

export type ResponseMessage<T = unknown, E = unknown> = ResponseSuccess<T> | ResponseError<E>;
