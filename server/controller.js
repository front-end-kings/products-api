db = require('./database/Products/index.js');

const controller = {
  getProducts: (req, res) => {
    let limit = req.query.count || 5;
    let page = req.query.page || 1;
    let offset = limit * page - limit;
    db.query(`SELECT * FROM products LIMIT ${limit} OFFSET ${offset}`, (err, result) => {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(200).send(result.rows);
      }
    })
  },
  getProductById: (req, res) => {
    let id = req.params.id;
    const queryString = `select a.*, b.features
    from products as a inner join (
      SELECT ${id} as prid, (SELECT json_agg(row_to_json(features))
       FROM (SELECT feature, value FROM "features" WHERE product_id = ${id}) AS features)
       as features
    ) as b on a.prid= b.prid
    where a.prid = ${id}`;
    db.query(queryString)
      .then((result) => {
        res.status(200).send(result.rows[0]);
      })
      .catch((err) => {
        res.status(400).send(err)
      });
  },
  getStyle: (req, res) => {
    let id = req.params.id;
    const queryString = `select a.productid as product_id, b.results
    from styles as a inner join (
      SELECT ${id} as pr_id, (SELECT json_agg(row_to_json(res))
       FROM (SELECT styles.id as style_id, name, sale_price, original_price, default_style as "default?",
           (
             SELECT json_agg(nested_photos)
             FROM (
               SELECT photos.url, photos.thumbnail_url FROM photos
               WHERE photos.styleid = styles.id AND styles.productid = ${id}
             ) AS nested_photos
           ) AS photos
           FROM "styles" WHERE productid = ${id}) AS res)
       as results
    ) as b on a.productid= b.pr_id
    where a.productid = ${id}`;
    db.query(queryString)
      .then((result) => {
        res.status(200).send(result.rows[0]);
      })
      .catch((err) => {
        res.status(400).send(err)
      });
  }
}

module.exports = controller;