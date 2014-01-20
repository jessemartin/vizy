function List (el) {
  this.el = el;
}
List.prototype = {
  add: function (item) {
    var itemEl = document.createElement('li');
    itemEl.innerHTML = item.name;
    this.el.appendChild(itemEl);
  },
  remove: function (item) {
    this.el.childNodes.each(function (node) {
      if (node.innerText === item.name) {
        this.el.removeChild(node);
      }
    });
  }
};