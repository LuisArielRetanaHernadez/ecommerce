/* eslint-disable linebreak-style */

// utils
const { bd } = require('./utils/database');
const { initRelations } = require('./utils/initRelations');

// express app
const { app } = require('./app');

// dotenv
require('dotenv').config();

// initRelations
initRelations();

bd.authenticate()
  .then(() => console.log('DB authenticate'))
  .catch((err) => console.error(err));

bd.sync()
  .then(() => {
    console.log('DB connected');
    // eslint-disable-next-line no-use-before-define
    startServer();
  })
  .catch((err) => console.error(err));

const startServer = () => {
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log('app ecommerce run in the port: ', PORT);
  });
};
