const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = 3030;
const router = require('./router.js');
require('newrelic');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});