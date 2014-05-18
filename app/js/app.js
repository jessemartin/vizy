require(['lib/animation'], function (AnimationApp, DropPlaceholder) {
  'use strict';
  new AnimationApp({ element: document.querySelector('canvas') });
});
