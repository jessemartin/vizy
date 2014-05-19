define([
  'underscore',
  'lib/canvas-helper',
  'lib/audio-file-reader',
  'lib/orbit',
  'lib/slider',
  'views/list',
  'views/drop-placeholder',
  'config/sliders'
], function (
  _,
  CanvasHelper,
  AudioFileReader,
  Orbit,
  Slider,
  List,
  DropPlaceholder,
  sliderConfigs
) {
  'use strict';
  function AnimationApp (opts) {
    this.settings = {};
    this.playlist = new List(document.getElementsByClassName('playlist')[0]);
    this.canvas = new CanvasHelper({ element: opts.element });
    this.canvas.fillWindow();

    this.audioFileReader = new AudioFileReader(this.startLoop.bind(this));
    this.orbit = new Orbit({ radius: 50 });
    this.orbit.centerOn(this.canvas);
    this.setupControls();

    this.dropPlaceholder = new DropPlaceholder();
    document.body.appendChild(this.dropPlaceholder.render().el);

    window.addEventListener('resize', _.debounce((function () {
      this.canvas.fillWindow();
      this.orbit.centerOn(this.canvas);
    }).bind(this), 100,  false));
  }
  AnimationApp.prototype = {
    setupControls: function () {
      _.each(sliderConfigs, function (opts) {
        new Slider(opts, function (name, value) {
          this.settings[name] = value;
        }, this);
      }, this);

      document.body.addEventListener('dragover', this.stopEvent.bind(this));
      document.body.addEventListener('dragenter', this.stopEvent.bind(this));
      document.body.addEventListener('drop', this.handleDrop.bind(this));
    },
    handleDrop: function (evt) {
      var files = evt.dataTransfer.files;
      this.stopEvent(evt);
      _.each(files, function (file) {
        this.playlist.add(file);
      }, this);

      this.audioFileReader.setFile(files[0]);
      this.dropPlaceholder.remove();
    },
    stopEvent: function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    },
    startLoop: function () {
      var loop = animationLoop,
        magnitudeAtSegment = function (segment) {
          return frequencies[Math.floor(segment / 10 * frequencies.length)];
        },
        self = this,
        frequencies;

      // Memoize for perf
      var draw = this.draw.bind(this),
        context = this.canvas.context,
        reqFrame = window.requestAnimationFrame,
        settings = this.settings;

      loop();
      function animationLoop () {
        self.canvas.clear();
        updateState.call(self);
        draw(context);
        reqFrame(loop);
      }
      function updateState () {
        var orbit = self.orbit;

        frequencies = self.audioFileReader.frequencyData();
        if (orbit.getSpeed() !== settings.speed) {
          orbit.setSpeed(settings.speed);
        }
        orbit.radius = magnitudeAtSegment(settings.frequency);
        orbit.advance();
        if (orbit.objects[0].tailLength !== settings.tail) {
          orbit.eachObject(function (object) {
            object.tailLength = settings.tail;
          }, self);
        }
      }
    },
    draw: function (context) {
      context.fillStyle = '#F2d';
      this.orbit.draw(context);
    }
  };

  return AnimationApp;
});
