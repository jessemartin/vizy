#!/usr/bin/env bash

npm install
node node_modules/bower/bin/bower install
node node_modules/gulp/bin/gulp.js build
node server/start.js
