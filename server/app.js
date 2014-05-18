module.exports = function () {
  'use strict';
  var express = require('express'),
    app = express(),
    DIST_DIR = __dirname + '/../dist',
    VENDOR_DIR = __dirname + '/../vendor',
    PORT = process.env.PORT || 5000;

  app.use(express.static(DIST_DIR));
  app.use(express.static(VENDOR_DIR));

  app.get('/', function (req, res) {
    res.sendfile('/index.html', { 'root': DIST_DIR });
  });

  // app.get('/vendor/*.js', function (req, res) {
  //   res.sendfile('/' + req.url.replace('vendor/', '/'), { 'root': VENDOR_DIR });
  // });

  app.get('*.js', function (req, res) {
    res.sendfile('/' + req.url, { 'root': DIST_DIR });
  });

  app.get('*.css', function (req, res) {
    res.sendfile('/' + req.url, { 'root': DIST_DIR });
  });

  app.listen(PORT);

  console.log('webserver running on:\nhttp://localhost:' + PORT);
};
