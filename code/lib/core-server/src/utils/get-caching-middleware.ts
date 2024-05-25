import type { NextHandleFunction } from 'connect';

export function getCachingMiddleware(): NextHandleFunction {
  return (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  };
}
