if( process.env.NODE_ENV !== 'production'){
  require( 'dotenv').config();
}
const express = require('express');
const bodyParser = require('body-parser');
require( './models').connect( process.env.MONGO_URI);

const app = express();

const PORT = process.env.PORT || 3001;

app.use( bodyParser.json());

const routes = require('./routes');
app.use( '/api', routes);

app.listen( PORT, () => {
  console.log(`Find the server at port [${PORT}]`); // eslint-disable-line no-console
});
