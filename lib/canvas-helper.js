function CanvasHelper (opts) {
  this.element = opts.element;
  this.context = this.element.getContext('2d');
}
_.extend(CanvasHelper.prototype, {
  clear: function () {
    this.context.clearRect(0, 0, this.element.width, this.element.height);
  },
  fillWindow: function () {
    this.element.height = document.documentElement.clientHeight;
    this.element.width = document.documentElement.clientWidth;
  },
  width: function (value) {
    if (value) {
      this.element.width = value;
    } else {
      return this.element.width;
    }
  },
  height: function (value) {
    if (value) {
      this.element.height = value;
    } else {
      return this.element.height;
    }
  }
});
