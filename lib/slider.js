function Slider (opts, onUpdate, context) {
  'use strict';
  this.onUpdate = onUpdate;
  this.element = document.getElementsByClassName(opts.selector)[0];
  this.unit = opts.unit;
  this.changeEvent = new Event('change');
  if (opts.bindings) {
    this.bindKeys(opts.bindings);
  }
  this.readout = this.createReadout();
  this.element.addEventListener('change', (function () {
    this.readout.innerHTML = this.generateHtml();
    this.onUpdate.call(context, opts.name, this.getVal());
  }).bind(this));
  this.trigger();
}
Slider.prototype = {
  getVal: function () {
    return +this.element.value;
  },
  getStep: function () {
    return +this.element.step;
  },
  trigger: function () {
    this.element.dispatchEvent(this.changeEvent);
  },
  decrease: function () {
    this.element.value = this.getVal() - this.getStep();
    this.trigger();
  },
  increase: function () {
    this.element.value = this.getVal() + this.getStep();
    this.trigger();
  },
  bindKeys: function (bindings) {
    document.body.addEventListener('keydown', (function (evt) {
      evt = evt || window.event;
      switch(evt.which || evt.keyCode) {
        case bindings.dec: this.decrease();
          break;
        case bindings.inc: this.increase();
          break;
        default: return;
      }
      evt.preventDefault();
    }).bind(this));
  },
  generateHtml: function () {
    var html = this.getVal();

    if (this.unit) {
      html += this.unit;
    }
    return html;
  },
  createReadout: function () {
    var readout = document.createElement('span');

    readout.className = 'readout';
    readout.innerHTML = this.generateHtml();
    this.element.parentElement.appendChild(readout);

    return readout;
  }
};
