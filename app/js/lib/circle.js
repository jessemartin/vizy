define(function () {
  'use strict';
  function Circle (opts) {
    this.position = opts.position || { x: 0, y: 0 };
    this.radius = opts.radius;
    this.previousStates = [];
    this.angle = 0;
  }
  Circle.prototype = {
    incrementAngle: function (increment) {
      var unitCircle = Math.PI * 2;

      this.angle += increment;
      while (this.angle > unitCircle) {
        this.angle -= unitCircle;
      }

      return this;
    },
    draw: function (context) {
      var taperDecrement = this.radius / this.tailLength;

      // Draw any previous states
      _.each(this.previousStates, function (object) {
        if (0 < (object.radius -= taperDecrement)) {
          this._drawUsingContext(object, context);
        }
      }, this);

      // Add the current state if requested
      if (this.tailLength) {
        this.previousStates.push({ radius: this.radius, position: this.position });
      }

      // Remove old states as needed
      while (this.previousStates.length > this.tailLength) {
        this.previousStates.shift();
      }

      this._drawUsingContext(this, context);

      return this;
    },
    _drawUsingContext: function (object, context) {
      var unitCircle = Math.PI * 2;

      context.beginPath();
      context.arc(
        object.position.x,
        object.position.y,
        object.radius,
        0,
        unitCircle
      );
      context.closePath();
      context.fill();
    }
  };
  return Circle;
});
