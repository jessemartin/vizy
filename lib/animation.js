var AnimationApp = Class.extend({
  init: function (opts) {
    this.settings = {};
    this.orbit = new Orbit({ radius: 50 });
    this.canvas = new CanvasHelper({ element: opts.element });
    this.audioFileReader = new AudioFileReader(this.startLoop.bind(this));
    this.context = this.canvas.context;
    this.setupControls();
    this.canvas.fillWindow();
    this.orbit.centerOn(this.canvas);
    for (var i = 0, orbs = []; i++ < 9;) {
      orbs.push(new Circle({ radius: 6 }));
    }
    this.orbit.setObjects(orbs);

    window.addEventListener('resize', _.debounce((function () {
      this.canvas.fillWindow();
      this.orbit.centerOn(this.canvas);
    }).bind(this), 100,  false));
  },
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
    var self = this,
      loop = animationLoop.bind(this),
      magnitudeAtSegment = function (segment) {
        return frequencies[Math.floor(segment / 10 * frequencies.length)];
      },
      frequencies;

    loop();
    function animationLoop () {
      this.canvas.clear();
      updateState.call(this);
      this.draw();
      window.requestAnimationFrame(loop);
    }
    function updateState () {
      var orbit = this.orbit,
        settings = this.settings;

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
  draw: function () {
    var context = this.context;

    context.fillStyle = '#F2d';
    this.orbit.eachObject(function (object) {
      object.draw(context);
    });
  }
});
