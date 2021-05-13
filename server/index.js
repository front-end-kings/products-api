const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = 3000;
const compression = require('compression');
const router = require('./router.js');
const config = require('../config/config.js');

app.use(compression());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
app.use('/api', router);
app.get('/loaderio-b6329a83a1f7b489e37b0eb235da990e', (req, res) => {
console.log('load io received');
  res.send(`${config.loaderio}`);
});

app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});
