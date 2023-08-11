const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../../models/user');

router.get('/list', async (req, res, next) => {
  await User.find({}).then((err, users) => {
    if(err){
      return res.send(err);
    }
    return res.json(users);
  });
});

module.exports = router;