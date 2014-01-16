function AudioFileReader (cb) {
  var self = this;
  window.AudioContext = window.webkitAudioContext || window.AudioContext;
  this.audioReader = new FileReader();
  this.audioContext = new AudioContext();
  this.source = this.audioContext.createBufferSource();
  this.audioAnalyser = this.audioContext.createAnalyser();

  this.audioReader.addEventListener('load', function () {
    processAudio.call(self, this.result);
  });

  function processAudio (result) {
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

      cb();
    }).bind(this));
  }
}
AudioFileReader.prototype.setFile = function (file) {
  this.audioReader.readAsArrayBuffer(file);
};
