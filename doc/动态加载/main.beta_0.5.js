(() => {
  // webpackBootstrap
  var __webpack_modules__ = {};
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

  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = __webpack_modules__;

  !(function() {
    __webpack_require__.f = {};
    // This file contains only the entry chunk.
    // The chunk loading function for additional chunks
    __webpack_require__.e = chunkId => {
      return Promise.all(
        Object.keys(__webpack_require__.f).reduce((promises, key) => {
          __webpack_require__.f[key](chunkId, promises);
          return promises;
        }, [])
      );
    };
  })();

  /* webpack/runtime/create fake namespace object */
  !(function() {
    __webpack_require__.t = function(value, mode) {
      if (mode & 1) value = this(value);
      if (mode & 8) return value;
      if (mode & 4 && typeof value === "object" && value && value.__esModule)
        return value;
      var ns = Object.create(null);
      __webpack_require__.r(ns);
      var def = {};
      if (mode & 2 && typeof value == "object" && value) {
        for (const key in value) def[key] = () => value[key];
      }
      def["default"] = () => value;
      __webpack_require__.d(ns, def);
      return ns;
    };
  })();

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

  /* webpack/runtime/publicPath */
  !(function() {
    __webpack_require__.p = "";
  })();

  /* webpack/runtime/get javascript chunk filename */
  !(function() {
    // This function allow to reference async chunks
    __webpack_require__.u = chunkId => {
      // return url for filenames based on template
      return "" + chunkId + ".js";
    };
  })();

  /* webpack/runtime/jsonp chunk loading */
  !(function() {
    var installedChunks = {
      main: 0
    };

    __webpack_require__.f.j = (chunkId, promises) => {
      // 加载chunkId对应的代码块中的代码
      var installedChunkData = Object.prototype.hasOwnProperty.call(
        installedChunks,
        chunkId
      )
        ? installedChunks[chunkId]
        : undefined;
      if (installedChunkData !== 0) {// 0 means "already installed".

        // a Promise means "currently loading".
        if (installedChunkData) {
          promises.push(installedChunkData[2]);
        } else {
          if (true) {
            // all chunks have JS
            // setup Promise in chunk cache
            var promise = new Promise((resolve, reject) => {
              installedChunkData = installedChunks[chunkId] = [resolve, reject];
            });
            promises.push((installedChunkData[2] = promise));

            // start chunk loading 采用JSONP的形式加载所需文件
            var url = __webpack_require__.p + __webpack_require__.u(chunkId);
            var loadingEnded = () => {
              if (
                Object.prototype.hasOwnProperty.call(installedChunks, chunkId)
              ) {
                installedChunkData = installedChunks[chunkId];
                if (installedChunkData !== 0)
                  installedChunks[chunkId] = undefined;
                if (installedChunkData) return installedChunkData[1];
              }
            };

            // 建立一个脚本 SONP的形式
            var script = document.createElement("script");
            var onScriptComplete;

            script.charset = "utf-8";
            script.timeout = 120;
            if (__webpack_require__.nc) {
              script.setAttribute("nonce", __webpack_require__.nc);
            }
            script.src = url;

            // create error before stack unwound to get useful stacktrace later
            var error = new Error();
            onScriptComplete = function(event) {
              onScriptComplete = function() {};
              // avoid mem leaks in IE.
              script.onerror = script.onload = null;
              clearTimeout(timeout);
              var reportError = loadingEnded();
              if (reportError) {
                var errorType =
                  event && (event.type === "load" ? "missing" : event.type);
                var realSrc = event && event.target && event.target.src;
                error.message =
                  "Loading chunk " +
                  chunkId +
                  " failed.\n(" +
                  errorType +
                  ": " +
                  realSrc +
                  ")";
                error.name = "ChunkLoadError";
                error.type = errorType;
                error.request = realSrc;
                reportError(error);
              }
            };
            var timeout = setTimeout(function() {
              onScriptComplete({ type: "timeout", target: script });
            }, 120000);
            script.onerror = script.onload = onScriptComplete;
            document.head.appendChild(script);
          } else installedChunks[chunkId] = 0;

          // no HMR
        }
      }
    };
    function webpackJsonpCallback(data) {
      var chunkIds = data[0];
      var moreModules = data[1];

      var runtime = data[3];

      // add "moreModules" to the modules object,
      // then flag all "chunkIds" as loaded and fire callback
      var moduleId,
        chunkId,
        i = 0,
        resolves = [];
      for (; i < chunkIds.length; i++) {
        chunkId = chunkIds[i];
        if (
          Object.prototype.hasOwnProperty.call(installedChunks, chunkId) &&
          installedChunks[chunkId]
        ) {
          resolves.push(installedChunks[chunkId][0]);
        }
        installedChunks[chunkId] = 0;
      }
      for (moduleId in moreModules) {
        if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
          __webpack_require__.m[moduleId] = moreModules[moduleId];
        }
      }
      if (runtime) runtime(__webpack_require__);
      if (parentJsonpFunction) parentJsonpFunction(data);

      while (resolves.length) {
        resolves.shift()();
      }
    }

    var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
    var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
    jsonpArray.push = webpackJsonpCallback;

    var parentJsonpFunction = oldJsonpFunction;
  })();
  eval(
    "let button = document.createElement('button')\nbutton.innerHTML = \"点我试试\"\n\nbutton.addEventListener('click', event => {\n  debugger\n  __webpack_require__.e(/*! import() */ \"src_hello_js\").then(__webpack_require__.t.bind(__webpack_require__, /*! ./hello */ \"./src/hello.js\", 7)).then(result => {\n    alert(result.default)\n  })\n})\ndocument.body.appendChild(button)\n\n// let hello = require('./hello');\n// console.log(hello) \n\n//# sourceURL=webpack:///./src/index.js?"
  );
})();
