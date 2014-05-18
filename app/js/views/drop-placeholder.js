define(['backbone', 'mustache'], function (Backbone, Mustache) {
  return Backbone.View.extend({
    className: 'drop-placeholder',
    template: [
      '<h2>',
        '<span class="plus-icon"></span>',
        'Drag-and-drop MP3 file here to play',
      '</h2>'
    ].join(''),
    render: function () {
      this.$el.html(Mustache.render(this.template));
      return this;
    }
  });
});
