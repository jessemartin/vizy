#!/usr/bin/env bash

rm -rf node_modules
rm -rf vendor
npm install
bower install
gulp build
