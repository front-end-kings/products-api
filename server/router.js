const router = require('express').Router();
const controller = require('./controller.js');

router
  .route('/products')
  .get(controller.getProducts)

router
  .route('/products/:id')
  .get(controller.getProductById)

router
  .route('/products/:id/styles')
  .get(controller.getStyle)


  module.exports = router;