// eslint-disable-next-line import/no-extraneous-dependencies
import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import serveStatic from 'serve-static';

export const serve = async (location: string, port: string) => {
  return new Promise((resolve, reject) => {
    const app = express();

    app.use(serveStatic(location));
    const server = app.listen(port, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(server);
      }
    });
  });
};
