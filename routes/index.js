var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getConfig',(req,res,next)=>{
  const config = require('../helpers/config')[process.env.NODE_ENV || 'development'];
  res.json(config);
});

module.exports = router;
