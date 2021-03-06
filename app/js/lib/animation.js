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
    this.subscribeToEvents();

    this.playlist = new List(document.getElementsByClassName('playlist')[0]);
    this.canvas = new CanvasHelper({ element: opts.element });

    this.audioFileReader = new AudioFileReader(this.startLoop.bind(this));
    this.orbit = new Orbit({ radius: 50, element: opts.element });
    this.setupControls();

    this.dropPlaceholder = new DropPlaceholder();
    document.body.appendChild(this.dropPlaceholder.render().el);
  }
  AnimationApp.prototype = {
    setupControls: function () {
      _.each(sliderConfigs, function (opts) {
        new Slider(opts, function (name, value) {
          this.settings[name] = value;
        }, this);
      }, this);
    },
    subscribeToEvents: function (evt) {
      Backbone.on('drop/files', (function (files) {
        _.each(files, function (file) {
          this.playlist.add(file);
        }, this);
        this.audioFileReader.setFile(files[0]);
      }).bind(this));
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
