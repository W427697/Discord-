import express from 'express';
import serveStatic from 'serve-static';

export const serve = async (location, port) => {
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
