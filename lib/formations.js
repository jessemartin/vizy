function Orbit (opts) {
  this.objects = [];
  this.radius = opts.radius;
  this.speed = 0;
  this.adjustment = 120;
  this.position = { x: 0, y: 0 };
}
Orbit.prototype = {
  centerOn: function (element) {
    this.position = { x: element.width() / 2, y: element.height() / 2 };
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
