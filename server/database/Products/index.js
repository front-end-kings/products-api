const Pool = require('pg').Pool;
const config = require('../../../config/config.js');

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'products',
  password: config.TOKEN,
  port: 5432,
})

db.connect()
.then(console.log('connected to postgres'))
.catch((err) => console.log(err));

module.exports = db;