define(function () {
  'use strict';
  function AudioFileReader (cb) {
    var self = this;

    window.AudioContext = window.webkitAudioContext || window.AudioContext;
    this.cb = cb;
    this.audioContext = new AudioContext();
    this.source = this.audioContext.createBufferSource();
    this.audioAnalyser = this.audioContext.createAnalyser();
    this.audioReader = new FileReader();

    this.audioReader.addEventListener('load', function () {
      self.processAudio(this.result);
    });
  }
  AudioFileReader.prototype = {
    processAudio: function (result) {
      if (this.source.playbackRate === this.source.PLAYING_STATE) {
        this.source.stop(0);
      }

      this.audioContext.decodeAudioData(result, (function (decoded) {
        this.source.buffer = decoded;
        this.frequencies = new Uint8Array(this.audioAnalyser.frequencyBinCount);
        this.frequencyData = function () {
          this.audioAnalyser.getByteFrequencyData(this.frequencies);

          return this.frequencies;
        };

        this.audioAnalyser.connect(this.audioContext.destination);
        this.source.connect(this.audioAnalyser);
        this.source.start(0);

        this.cb();
      }).bind(this));
    },
    setFile: function (file) {
      this.audioReader.readAsArrayBuffer(file);
    }
  };

  return AudioFileReader;
});
