/* eslint-disable import/extensions */
const Hapi = require('@hapi/hapi');
const routes = require ('./routes.js');

const init = async () => {
  const server = Hapi.Server({
    port: 9000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
