function ns (namespace) {
  var modules = namespace.split('.'),
    base;

  modules.forEach(function (obj) {
    if (!base[obj]) {
      base[obj] = {};
    }
    base = base[obj];
  });

  return base;
}
