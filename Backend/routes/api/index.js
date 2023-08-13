const express = require('express');
const router = express.Router();

/* GET API home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'New API Express' });
});

module.exports = router;
