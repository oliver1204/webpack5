(() => {
  // webpackBootstrap
  "use strict";
  var __webpack_modules__ = {
    "./src3/index.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      eval(
        '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module */ "./src3/module.js");\n\n\nconsole.log(_module__WEBPACK_IMPORTED_MODULE_0__.inner.aaaaa);\n\n//# sourceURL=webpack:///./src3/index.js?'
      );
    },

    "./src3/inner.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      eval(
        '__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "aaaaa": () => /* binding */ aaaaa,\n/* harmony export */   "bbbbb": () => /* binding */ bbbbb\n/* harmony export */ });\nconst aaaaa = 1;\nconst bbbbb = 2;\n\n//# sourceURL=webpack:///./src3/inner.js?'
      );
    },

    "./src3/module.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      eval(
        '__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   "inner": () => /* reexport module object */ _inner__WEBPACK_IMPORTED_MODULE_0__\n/* harmony export */ });\n/* harmony import */ var _inner__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inner */ "./src3/inner.js");\n\n\n\n//# sourceURL=webpack:///./src3/module.js?'
      );
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

  /* webpack/runtime/define property getters */
  !(function() {
    // define getter functions for harmony exports
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (
          hasOwnProperty.call(definition, key) &&
          !hasOwnProperty.call(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
          });
        }
      }
    };
  })();

  /* webpack/runtime/make namespace object */
  !(function() {
    // define __esModule on exports
    __webpack_require__.r = exports => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      }
      Object.defineProperty(exports, "__esModule", { value: true });
    };
  })();

  // startup
  __webpack_require__("./src3/index.js");
})();
