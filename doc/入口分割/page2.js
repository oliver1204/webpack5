(() => {
  // webpackBootstrap
  var __webpack_modules__ = {
    "./src/base/index.js": module => {
      module.exports = "base";
    },

    "./src/hello.js": (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) => {
      let base = __webpack_require__(/*! ./base/index */ "./src/base/index.js");
      console.log(base);
      module.exports = "hello";
    }
  };
  // The module cache
  var __webpack_module_cache__ = {};

  // The require function
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

    // Execute the module function
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }

  !(function() {
    let hello = __webpack_require__(/*! ./hello */ "./src/hello.js");
    console.log(hello);
  })();
})();
//# sourceMappingURL=page2.js.map
