var Class = (function () {
  'use strict';
  function BaseClass () { }
  function extend (staticProps) {
    function Class () {}
    Class.prototype = _.extend({}, this.prototype, staticProps);
    Class.prototype.constructor = BaseClass;
    Class.extend = extend;

    return Class;
  }
  BaseClass.extend = extend;

  return BaseClass;
}());
