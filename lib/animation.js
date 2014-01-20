function AnimationApp (opts) {
  this.settings = {};
  // Rquires DOM
  this.canvas = new CanvasHelper({ element: opts.element });
  this.canvas.fillWindow();

  // Callback requires canvas and loop
  this.audioFileReader = new AudioFileReader(this.startLoop.bind(this));
  this.orbit = new Orbit({ radius: 50 });
  this.orbit.centerOn(this.canvas);
  this.setupControls();

  window.addEventListener('resize', _.debounce((function () {
    this.canvas.fillWindow();
    this.orbit.centerOn(this.canvas);
  }).bind(this), 100,  false));
}
AnimationApp.prototype = {
  setupControls: function () {
    var self = this,
      sliderOpts = [
        { name: 'frequency', bindings: { dec: 81, inc: 69 }, selector: 'frequency-selection-slider' },
        { name: 'speed', bindings: { dec: 65, inc: 68 }, selector: 'rotation-speed-slider', unit: ' x' },
        { name: 'tail', bindings: { dec: 83, inc: 87 }, selector: 'tail-length-slider', unit: ' frames' },
      ];

    _.each(sliderOpts, function (opts) {
      new Slider(opts, function (name, value) {
        this.settings[name] = value;
      }, this);
    }, this);
    document.getElementsByClassName('song-url')[0]
      .addEventListener('change', function () {
        // `self` is closed around as this.files is being accessed
        self.audioFileReader.setFile(this.files[0]);
      });
  },
  startLoop: function () {
    var loop = animationLoop.bind(this),
      magnitudeAtSegment = function (segment) {
        return frequencies[Math.floor(segment / 10 * frequencies.length)];
      },
      frequencies;

    // Memoization
    var draw = this.draw.bind(this),
      context = this.canvas.context,
      reqFrame = window.requestAnimationFrame,
      settings = this.settings;

    loop();
    function animationLoop () {
      this.canvas.clear();
      updateState.call(this);
      draw(context);
      reqFrame(loop);
    }
    function updateState () {
      var orbit = this.orbit;

      frequencies = this.audioFileReader.frequencyData();
      if (orbit.getSpeed() !== settings.speed) {
        orbit.setSpeed(settings.speed);
      }
      orbit.radius = magnitudeAtSegment(settings.frequency);
      orbit.advance();
      if (orbit.objects[0].tailLength !== settings.tail) {
        orbit.eachObject(function (object) {
          object.tailLength = settings.tail;
        }, this);
      }
    }
  },
  draw: function (context) {
    context.fillStyle = '#F2d';
    this.orbit.draw(context);
  }
};
