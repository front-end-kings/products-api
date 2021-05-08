db = require('./index.js');

const dbQuery = {
  getProducts: (callback) => {
    let limit = 10;
    let page = 2;
    let offset = limit * page - limit;
    db.query(`SELECT * FROM products LIMIT ${limit} OFFSET ${offset}`, (err, results) => {
      if (err) {
        callback(err);
      } else {
        callback(null, results.rows)
      }
    })
  }
}

module.exports = dbQuery;