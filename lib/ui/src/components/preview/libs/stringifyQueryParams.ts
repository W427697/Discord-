type stringifyQueryParams = (queryParams: object) => string;

export const stringifyQueryParams: stringifyQueryParams = queryParams =>
  Object.entries(queryParams).reduce((acc, [k, v]) => {
    return `${acc}&${k}=${v}`;
  }, '');
