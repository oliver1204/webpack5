(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["src_hello_js"],
  { 
    "./src/base/index.js": module => {
      eval(
        "module.exports = 'base';\n\n//# sourceURL=webpack:///./src/base/index.js?"
      );
    },

    "./src/hello.js": (module, __unused_webpack_exports, __webpack_require__) => {
      eval(
        "let base = __webpack_require__(/*! ./base/index */ \"./src/base/index.js\");\nconsole.log(base)\nmodule.exports = 'hello';\n\n//# sourceURL=webpack:///./src/hello.js?"
      );
    }
  }
]);
