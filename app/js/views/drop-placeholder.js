define(['backbone', 'mustache'], function (Backbone, Mustache) {
  'use strict';
  return Backbone.View.extend({
    className: 'drop-placeholder',
    template: [
      '<h2>',
        '<span class="plus-icon"></span>',
        'Drag-and-drop MP3 file here to play',
      '</h2>'
    ].join(''),
    initialize: function () {
      // drag and drop events must be bound directly onto the body
      document.body.addEventListener('dragover', this._stopEvent.bind(this));
      document.body.addEventListener('dragenter', this._stopEvent.bind(this));
      document.body.addEventListener('drop', this._handleDrop.bind(this));
    },
    _stopEvent: function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    },
    _handleDrop: function (evt) {
      var files = evt.dataTransfer.files;
      this._stopEvent(evt);

      Backbone.trigger('drop/files', files);
      this.remove();
    },
    render: function () {
      this.$el.html(Mustache.render(this.template));
      return this;
    },
    remove: function () {
      // drag and drop events must be bound directly onto the body
      document.body.removeEventListener('dragover', this._stopEvent.bind(this));
      document.body.removeEventListener('dragenter', this._stopEvent.bind(this));
      document.body.removeEventListener('drop', this._handleDrop.bind(this));
    }
  });
});
