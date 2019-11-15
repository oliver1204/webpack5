  var __webpack_modules__ = {
    "./src/hello.js": module => {
      eval(
        "module.exports = 'hello';\n\n//# sourceURL=webpack:///./src/hello.js?"
      );
    }
  };
  var __webpack_module_cache__ = {};

  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (__webpack_module_cache__[moduleId]) {
      return __webpack_module_cache__[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = (__webpack_module_cache__[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    });

    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    module.l = true;

    return module.exports;
  }

  !(function() {
    eval(
      'let hello = __webpack_require__(/*! ./hello */ "./src/hello.js");\nconsole.log(hello) \n\n//# sourceURL=webpack:///./src/index.js?'
    );
  })();
})();
