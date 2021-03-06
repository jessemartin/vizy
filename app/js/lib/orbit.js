define(['lib/circle'], function (Circle) {
  'use strict';
  function Orbit (opts) {
    this.objects = [];
    this.radius = opts.radius;
    this.speed = 0;
    this.adjustment = 120;
    this.position = { x: 0, y: 0 };
    this.element = opts.element;

    for (var i = 0, orbs = []; i++ < 9;) {
      orbs.push(new Circle({ radius: 6 }));
    }
    this.setObjects(orbs);
    this.center();

    window.addEventListener('resize', _.debounce((function () {
      this.center();
    }).bind(this), 100,  false));
  }
  Orbit.prototype = {
    draw: function (context) {
      this.eachObject(function (object) {
        object.draw(context);
      });
    },
    center: function () {
      var el = this.element;
      this.position = { x: el.width / 2, y: el.height / 2 };
    },
    getSpeed: function () {
      return this.speed * this.adjustment;
    },
    setSpeed: function (speed) {
      this.speed = speed / this.adjustment;
    },
    setObjects: function (objects) {
      var i = objects.length,
        segmentSize =  Math.PI * 2 / i;

      while (i--) {
        objects[i].angle = i * segmentSize;
      }
      this.objects = objects;
    },
    advance: function () {
      var unitCircle = Math.PI * 2,
        increment = this.speed * unitCircle,
        radius = this.radius,
        xOffset = this.position.x,
        yOffset = this.position.y;

      this.eachObject(function (object) {
        object.incrementAngle(increment);
        object.position = {
          x: Math.cos(object.angle) * radius + xOffset,
          y: Math.sin(object.angle) * radius + yOffset
        };
      });
    },
    eachObject: function (fn, context) {
      _.each(this.objects, fn, context);
    }
  };
  return Orbit;
});
