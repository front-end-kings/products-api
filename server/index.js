const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = 3030;
// const dbQuery = require('./Database/Products/dbQueries.js');
const router = require('./router.js');


app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
app.use('/api', router);

// app.get('/api/products', (req, res) => {
//   console.log(req.query);
//   dbQuery.getProducts((err, result) => {
//     if (err) {
//       res.status(400).send(err);
//     } else {
//       res.status(200).send(result);
//     }
//   })
// })

// app.get('/api/products/:id', (req, res) => {
//   console.log(req.params);
//   res.status(200).send(req.params);
// })

app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});