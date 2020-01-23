/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./src/assets/js/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/views/gutenberg-blocks/tainacan-facets/facets-list/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);
  config.method = config.method ? config.method.toLowerCase() : 'get';

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
var isAbsoluteURL = __webpack_require__(/*! ./../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ./../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  utils.forEach(['url', 'method', 'params', 'data'], function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(['headers', 'auth', 'proxy'], function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach([
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
    'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
    'socketPath'
  ], function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  // Only Node.JS has a process variable that is of [[Class]] process
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/axios/node_modules/is-buffer/index.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "./node_modules/axios/node_modules/is-buffer/index.js":
/*!************************************************************!*\
  !*** ./node_modules/axios/node_modules/is-buffer/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/qs/lib/formats.js":
/*!****************************************!*\
  !*** ./node_modules/qs/lib/formats.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

module.exports = {
    'default': 'RFC3986',
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return value;
        }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};


/***/ }),

/***/ "./node_modules/qs/lib/index.js":
/*!**************************************!*\
  !*** ./node_modules/qs/lib/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stringify = __webpack_require__(/*! ./stringify */ "./node_modules/qs/lib/stringify.js");
var parse = __webpack_require__(/*! ./parse */ "./node_modules/qs/lib/parse.js");
var formats = __webpack_require__(/*! ./formats */ "./node_modules/qs/lib/formats.js");

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};


/***/ }),

/***/ "./node_modules/qs/lib/parse.js":
/*!**************************************!*\
  !*** ./node_modules/qs/lib/parse.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/qs/lib/utils.js");

var has = Object.prototype.hasOwnProperty;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    parameterLimit: 1000,
    plainObjects: false,
    strictNullHandling: false
};

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);

    for (var i = 0; i < parts.length; ++i) {
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder);
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder);
            val = options.decoder(part.slice(pos + 1), defaults.decoder);
        }
        if (has.call(obj, key)) {
            obj[key] = [].concat(obj[key]).concat(val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options) {
    var leaf = val;

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]') {
            obj = [];
            obj = obj.concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys
        // that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

module.exports = function (str, opts) {
    var options = opts ? utils.assign({}, opts) : {};

    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    options.ignoreQueryPrefix = options.ignoreQueryPrefix === true;
    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};


/***/ }),

/***/ "./node_modules/qs/lib/stringify.js":
/*!******************************************!*\
  !*** ./node_modules/qs/lib/stringify.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/qs/lib/utils.js");
var formats = __webpack_require__(/*! ./formats */ "./node_modules/qs/lib/formats.js");

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
        return prefix + '[]';
    },
    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
        return prefix;
    }
};

var toISO = Date.prototype.toISOString;

var defaults = {
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify( // eslint-disable-line func-name-matching
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (Array.isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (Array.isArray(obj)) {
            values = values.concat(stringify(
                obj[key],
                generateArrayPrefix(prefix, key),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        } else {
            values = values.concat(stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        }
    }

    return values;
};

module.exports = function (object, opts) {
    var obj = object;
    var options = opts ? utils.assign({}, opts) : {};

    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
    if (typeof options.format === 'undefined') {
        options.format = formats['default'];
    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
        throw new TypeError('Unknown format option provided.');
    }
    var formatter = formats.formatters[options.format];
    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (Array.isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    } else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (sort) {
        objKeys.sort(sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        keys = keys.concat(stringify(
            obj[key],
            key,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encode ? encoder : null,
            filter,
            sort,
            allowDots,
            serializeDate,
            formatter,
            encodeValuesOnly
        ));
    }

    var joined = keys.join(delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    return joined.length > 0 ? prefix + joined : '';
};


/***/ }),

/***/ "./node_modules/qs/lib/utils.js":
/*!**************************************!*\
  !*** ./node_modules/qs/lib/utils.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    var obj;

    while (queue.length) {
        var item = queue.pop();
        obj = item.obj[item.prop];

        if (Array.isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }

    return obj;
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        } else if (typeof target === 'object') {
            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (Array.isArray(target) && !Array.isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (Array.isArray(target) && Array.isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                if (target[i] && typeof target[i] === 'object') {
                    target[i] = merge(target[i], item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str) {
    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};

var encode = function encode(str) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    return compactQueue(queue);
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (obj === null || typeof obj === 'undefined') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    merge: merge
};


/***/ }),

/***/ "./src/views/gutenberg-blocks/js/axios.js":
/*!************************************************!*\
  !*** ./src/views/gutenberg-blocks/js/axios.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

var tainacan = axios__WEBPACK_IMPORTED_MODULE_0___default.a.create({
  baseURL: tainacan_blocks.root
});
tainacan.defaults.headers.common['X-WP-Nonce'] = tainacan_blocks.nonce;
/* harmony default export */ __webpack_exports__["default"] = (tainacan);

/***/ }),

/***/ "./src/views/gutenberg-blocks/tainacan-facets/facets-list/index.js":
/*!*************************************************************************!*\
  !*** ./src/views/gutenberg-blocks/tainacan-facets/facets-list/index.js ***!
  \*************************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _metadata_modal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./metadata-modal.js */ "./src/views/gutenberg-blocks/tainacan-facets/facets-list/metadata-modal.js");
/* harmony import */ var _parent_term_modal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parent-term-modal.js */ "./src/views/gutenberg-blocks/tainacan-facets/facets-list/parent-term-modal.js");
/* harmony import */ var _js_axios_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../js/axios.js */ "./src/views/gutenberg-blocks/js/axios.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! qs */ "./node_modules/qs/lib/index.js");
/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_4__);
var registerBlockType = wp.blocks.registerBlockType;
var __ = wp.i18n.__;
var _wp$components = wp.components,
    BaseControl = _wp$components.BaseControl,
    RangeControl = _wp$components.RangeControl,
    Spinner = _wp$components.Spinner,
    Button = _wp$components.Button,
    ToggleControl = _wp$components.ToggleControl,
    Tooltip = _wp$components.Tooltip,
    Placeholder = _wp$components.Placeholder,
    Toolbar = _wp$components.Toolbar,
    PanelBody = _wp$components.PanelBody;
var _wp$editor = wp.editor,
    InspectorControls = _wp$editor.InspectorControls,
    BlockControls = _wp$editor.BlockControls;





registerBlockType('tainacan/facets-list', {
  title: __('Tainacan Facets List', 'tainacan'),
  icon: React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    height: "24px",
    width: "24px"
  }, React.createElement("path", {
    fill: "#298596",
    d: "M21.43,13.64,19.32,16a2.57,2.57,0,0,1-2,1H11a3.91,3.91,0,0,0,0-.49,5.49,5.49,0,0,0-5-5.47V9.64A2.59,2.59,0,0,1,8.59,7H17.3a2.57,2.57,0,0,1,2,1l2.11,2.38A2.59,2.59,0,0,1,21.43,13.64ZM4,3A2,2,0,0,0,2,5v7.3a5.32,5.32,0,0,1,2-1V5H16V3ZM11,21l-1,1L8.86,20.89,8,20H8l-.57-.57A3.42,3.42,0,0,1,5.5,20a3.5,3.5,0,0,1,0-7,2.74,2.74,0,0,1,.5,0A3.5,3.5,0,0,1,9,16a2.92,2.92,0,0,1,0,.51,3.42,3.42,0,0,1-.58,1.92L9,19H9l.85.85Zm-4-4.5A1.5,1.5,0,1,0,5.5,18,1.5,1.5,0,0,0,7,16.53Z"
  })),
  category: 'tainacan-blocks',
  keywords: [__('facets', 'tainacan'), __('search', 'tainacan'), __('terms', 'tainacan')],
  description: __('List facets from a Tainacan Collection or Repository', 'tainacan'),
  attributes: {
    content: {
      type: 'array',
      source: 'children',
      selector: 'div'
    },
    collectionId: {
      type: String,
      default: undefined
    },
    collectionSlug: {
      type: String,
      default: undefined
    },
    facets: {
      type: Array,
      default: []
    },
    facetsObject: {
      type: Array,
      default: []
    },
    showImage: {
      type: Boolean,
      default: true
    },
    showItemsCount: {
      type: Boolean,
      default: true
    },
    showLoadMore: {
      type: Boolean,
      default: false
    },
    showSearchBar: {
      type: Boolean,
      value: false
    },
    layout: {
      type: String,
      default: 'grid'
    },
    cloudRate: {
      type: Number,
      default: 1
    },
    isModalOpen: {
      type: Boolean,
      default: false
    },
    gridMargin: {
      type: Number,
      default: 0
    },
    metadatumId: {
      type: String,
      default: undefined
    },
    metadatumType: {
      type: String,
      default: undefined
    },
    facetsRequestSource: {
      type: String,
      default: undefined
    },
    maxFacetsNumber: {
      type: Number,
      value: undefined
    },
    isLoading: {
      type: Boolean,
      value: false
    },
    isLoadingCollection: {
      type: Boolean,
      value: false
    },
    collection: {
      type: Object,
      value: undefined
    },
    searchString: {
      type: String,
      default: undefined
    },
    blockId: {
      type: String,
      default: undefined
    },
    parentTerm: {
      type: Number,
      default: null
    },
    isParentTermModalOpen: {
      type: Boolean,
      default: false
    }
  },
  supports: {
    align: ['full', 'wide'],
    html: false
  },
  edit: function edit(_ref) {
    var attributes = _ref.attributes,
        setAttributes = _ref.setAttributes,
        className = _ref.className,
        isSelected = _ref.isSelected,
        clientId = _ref.clientId;
    var facets = attributes.facets,
        facetsObject = attributes.facetsObject,
        content = attributes.content,
        collectionId = attributes.collectionId,
        collectionSlug = attributes.collectionSlug,
        showImage = attributes.showImage,
        showItemsCount = attributes.showItemsCount,
        showLoadMore = attributes.showLoadMore,
        showSearchBar = attributes.showSearchBar,
        layout = attributes.layout,
        cloudRate = attributes.cloudRate,
        isModalOpen = attributes.isModalOpen,
        gridMargin = attributes.gridMargin,
        metadatumId = attributes.metadatumId,
        metadatumType = attributes.metadatumType,
        facetsRequestSource = attributes.facetsRequestSource,
        maxFacetsNumber = attributes.maxFacetsNumber,
        searchString = attributes.searchString,
        isLoading = attributes.isLoading,
        parentTerm = attributes.parentTerm,
        isParentTermModalOpen = attributes.isParentTermModalOpen; // Obtains block's client id to render it on save function

    setAttributes({
      blockId: clientId
    });

    function prepareFacet(facet) {
      return React.createElement("li", {
        key: facet.id,
        className: 'facet-list-item' + (!showImage ? ' facet-without-image' : ''),
        style: {
          marginBottom: layout == 'grid' ? gridMargin + 'px' : ''
        }
      }, React.createElement("a", {
        id: isNaN(facet.id) ? facet.id : 'facet-id-' + facet.id,
        href: facet.url,
        target: "_blank",
        style: {
          fontSize: layout == 'cloud' && facet.total_items ? +(1 + cloudRate / 4 * Math.log(facet.total_items)) + 'rem' : ''
        }
      }, metadatumType == 'Taxonomy' ? React.createElement("img", {
        src: facet.entity && facet.entity['header_image'] ? facet.entity['header_image'] : "".concat(tainacan_blocks.base_url, "/assets/images/placeholder_square.png"),
        alt: facet.label ? facet.label : __('Thumbnail', 'tainacan')
      }) : null, metadatumType == 'Relationship' ? React.createElement("img", {
        src: facet.entity.thumbnail && facet.entity.thumbnail['tainacan-medium'][0] && facet.entity.thumbnail['tainacan-medium'][0] ? facet.entity.thumbnail['tainacan-medium'][0] : facet.entity.thumbnail && facet.entity.thumbnail['thumbnail'][0] && facet.entity.thumbnail['thumbnail'][0] ? facet.entity.thumbnail['thumbnail'][0] : "".concat(tainacan_blocks.base_url, "/assets/images/placeholder_square.png"),
        alt: facet.label ? facet.label : __('Thumbnail', 'tainacan')
      }) : null, React.createElement("span", null, facet.label ? facet.label : ''), facet.total_items ? React.createElement("span", {
        class: "facet-item-count",
        style: {
          display: !showItemsCount ? 'none' : ''
        }
      }, "\xA0(", facet.total_items, ")") : null));
    }

    function setContent() {
      facets = [];
      isLoading = true;
      if (facetsRequestSource != undefined && typeof facetsRequestSource == 'function') facetsRequestSource.cancel('Previous facets search canceled.');
      facetsRequestSource = axios__WEBPACK_IMPORTED_MODULE_3___default.a.CancelToken.source();
      setAttributes({
        isLoading: isLoading
      });
      var endpoint = '/facets/' + metadatumId;
      var query = endpoint.split('?')[1];
      var queryObject = qs__WEBPACK_IMPORTED_MODULE_4___default.a.parse(query); // Set up max facets to be shown

      if (maxFacetsNumber != undefined && maxFacetsNumber > 0) queryObject.number = maxFacetsNumber;else if (queryObject.number != undefined && queryObject.number > 0) setAttributes({
        maxFacetsNumber: queryObject.number
      });else {
        queryObject.number = 12;
        setAttributes({
          maxFacetsNumber: 12
        });
      } // Set up searching string

      if (searchString != undefined) queryObject.search = searchString;else if (queryObject.search != undefined) setAttributes({
        searchString: queryObject.search
      });else {
        delete queryObject.search;
        setAttributes({
          searchString: undefined
        });
      } // Set up parentTerm for taxonomies

      if (parentTerm && parentTerm.id !== undefined && parentTerm.id !== null && parentTerm.id !== '' && metadatumType == 'Taxonomy') queryObject.parent = parentTerm.id;else {
        delete queryObject.parent;
        setAttributes({
          parentTerm: null
        });
      } // Parameter fo tech entity object with image and url

      queryObject['context'] = 'extended';
      endpoint = endpoint.split('?')[0] + '?' + qs__WEBPACK_IMPORTED_MODULE_4___default.a.stringify(queryObject);
      _js_axios_js__WEBPACK_IMPORTED_MODULE_2__["default"].get(endpoint, {
        cancelToken: facetsRequestSource.token
      }).then(function (response) {
        facetsObject = [];

        if (metadatumType == 'Taxonomy') {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = response.data.values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var facet = _step.value;
              facetsObject.push(Object.assign({
                url: facet.entity && facet.entity.url ? facet.entity.url : tainacan_blocks.site_url + '/' + collectionSlug + '/#/?taxquery[0][compare]=IN&taxquery[0][taxonomy]=' + facet.taxonomy + '&taxquery[0][terms][0]=' + facet.value
              }, facet));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } else {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = response.data.values[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _facet = _step2.value;
              facetsObject.push(Object.assign({
                url: tainacan_blocks.site_url + '/' + collectionSlug + '/#/?metaquery[0][key]=' + metadatumId + '&metaquery[0][value]=' + _facet.value
              }, _facet));
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = facetsObject[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _facet2 = _step3.value;
            facets.push(prepareFacet(_facet2));
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        setAttributes({
          content: React.createElement("div", null),
          facets: facets,
          facetsObject: facetsObject,
          isLoading: false,
          facetsRequestSource: facetsRequestSource
        });
      });
    }

    function updateContent() {
      facets = [];
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = facetsObject[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var facet = _step4.value;
          facets.push(prepareFacet(facet));
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      setAttributes({
        content: React.createElement("div", null),
        facets: facets
      });
    }

    function openMetadataModal() {
      isModalOpen = true;
      setAttributes({
        isModalOpen: isModalOpen
      });
    }

    function openParentTermModal() {
      isParentTermModalOpen = true;
      setAttributes({
        isParentTermModalOpen: isParentTermModalOpen
      });
    }

    function updateLayout(newLayout) {
      layout = newLayout;
      if (layout == 'grid') showImage = true;
      if (layout == 'list' || layout == 'cloud') showImage = false;
      setAttributes({
        layout: layout,
        showImage: showImage
      });
      updateContent();
    }

    function applySearchString(event) {
      var value = event.target.value;

      if (searchString != value) {
        searchString = value;
        setAttributes({
          searchString: searchString
        });
        setContent();
      }
    } // Executed only on the first load of page


    if (content && content.length && content[0].type) setContent();
    var layoutControls = [{
      icon: 'grid-view',
      title: __('Grid View'),
      onClick: function onClick() {
        return updateLayout('grid');
      },
      isActive: layout === 'grid'
    }, {
      icon: 'list-view',
      title: __('List View'),
      onClick: function onClick() {
        return updateLayout('list');
      },
      isActive: layout === 'list'
    }, {
      icon: 'cloud',
      title: __('Cloud View'),
      onClick: function onClick() {
        return updateLayout('cloud');
      },
      isActive: layout === 'cloud'
    }];
    return React.createElement("div", {
      className: className
    }, React.createElement("div", null, React.createElement(BlockControls, null, React.createElement(Toolbar, {
      controls: layoutControls
    }))), React.createElement("div", null, React.createElement(InspectorControls, null, React.createElement(PanelBody, {
      title: __('Search', 'tainacan'),
      initialOpen: true
    }, React.createElement(ToggleControl, {
      label: __('Display search bar', 'tainacan'),
      help: showSearchBar ? __('Toggle to show search bar on block', 'tainacan') : __('Do not show search bar', 'tainacan'),
      checked: showSearchBar,
      onChange: function onChange(isChecked) {
        showSearchBar = isChecked;
        setAttributes({
          showSearchBar: showSearchBar
        });
      }
    }), React.createElement(ToggleControl, {
      label: __('Display load more', 'tainacan'),
      help: showLoadMore ? __('Toggle to show "load more" button on block', 'tainacan') : __('Do not show "load more" button', 'tainacan'),
      checked: showLoadMore,
      onChange: function onChange(isChecked) {
        showLoadMore = isChecked;
        setAttributes({
          showLoadMore: showLoadMore
        });
      }
    })), React.createElement(PanelBody, {
      title: __('Facets', 'tainacan'),
      initialOpen: true
    }, React.createElement("div", null, React.createElement(RangeControl, {
      label: __('Maximum number of facets', 'tainacan'),
      value: maxFacetsNumber ? maxFacetsNumber : 12,
      onChange: function onChange(aMaxFacetsNumber) {
        maxFacetsNumber = aMaxFacetsNumber;
        setAttributes({
          maxFacetsNumber: aMaxFacetsNumber
        });
        setContent();
      },
      min: 1,
      max: 96
    })), metadatumType == 'Taxonomy' ? React.createElement("div", null, React.createElement(BaseControl, {
      id: "parent-term-selection",
      label: parentTerm && (parentTerm.id === '0' || parentTerm.id === 0) ? __('Showing only:', 'tainacan') : __('Showing children of:', 'tainacan'),
      help: "Narrow terms to children of a parent term."
    }, React.createElement("span", {
      style: {
        fontWeight: 'bold'
      }
    }, "\xA0", parentTerm && parentTerm.name ? parentTerm.name : __('Any term.', 'tainacan')), React.createElement("br", null), React.createElement(Button, {
      style: {
        margin: '6px auto 16px auto',
        display: 'block'
      },
      id: "parent-term-selection",
      isPrimary: true,
      onClick: function onClick() {
        return openParentTermModal();
      }
    }, __('Select parent term', 'tainacan')))) : null, React.createElement("hr", null), React.createElement("div", null, layout == 'list' && (metadatumType == 'Taxonomy' || metadatumType == 'Relationship') ? React.createElement(ToggleControl, {
      label: __('Image', 'tainacan'),
      help: showImage ? __("Toggle to show facet's image", 'tainacan') : __("Do not show facet's image", 'tainacan'),
      checked: showImage,
      onChange: function onChange(isChecked) {
        showImage = isChecked;
        setAttributes({
          showImage: showImage
        });
        updateContent();
      }
    }) : null, layout == 'grid' ? React.createElement("div", null, metadatumType == 'Taxonomy' || metadatumType == 'Relationship' ? React.createElement(ToggleControl, {
      label: __('Image', 'tainacan'),
      help: showImage ? __("Toggle to show facet's image", 'tainacan') : __("Do not show facet's image", 'tainacan'),
      checked: showImage,
      onChange: function onChange(isChecked) {
        showImage = isChecked;
        setAttributes({
          showImage: showImage
        });
        updateContent();
      }
    }) : null, React.createElement("div", {
      style: {
        marginTop: '16px'
      }
    }, React.createElement(RangeControl, {
      label: __('Margin between facets in pixels', 'tainacan'),
      value: gridMargin,
      onChange: function onChange(margin) {
        gridMargin = margin;
        setAttributes({
          gridMargin: margin
        });
        updateContent();
      },
      min: 0,
      max: 48
    }))) : null, React.createElement(ToggleControl, {
      label: __('Items count', 'tainacan'),
      help: showItemsCount ? __("Toggle to show items counter", 'tainacan') : __("Do not show items counter", 'tainacan'),
      checked: showItemsCount,
      onChange: function onChange(isChecked) {
        showItemsCount = isChecked;
        setAttributes({
          showItemsCount: showItemsCount
        });
        updateContent();
      }
    }))), layout == 'cloud' ? React.createElement(PanelBody, {
      title: __('Cloud settings', 'tainacan'),
      initialOpen: true
    }, React.createElement("div", null, React.createElement(RangeControl, {
      label: __('Growth rate for facets according to items count.', 'tainacan'),
      value: cloudRate,
      onChange: function onChange(rate) {
        cloudRate = rate;
        setAttributes({
          cloudRate: rate
        });
        updateContent();
      },
      min: 0,
      max: 10
    }))) : null)), isSelected ? React.createElement("div", null, isModalOpen ? React.createElement(_metadata_modal_js__WEBPACK_IMPORTED_MODULE_0__["default"], {
      existingCollectionId: collectionId,
      existingCollectionSlug: collectionSlug,
      existingMetadatumId: metadatumId,
      existingMetadatumType: metadatumType,
      onSelectCollection: function onSelectCollection(selectedCollection) {
        collectionId = selectedCollection.id;
        collectionSlug = selectedCollection.slug;
        setAttributes({
          collectionSlug: collectionSlug,
          collectionId: collectionId
        });
      },
      onSelectMetadatum: function onSelectMetadatum(selectedFacet) {
        metadatumId = selectedFacet.metadatumId;
        metadatumType = selectedFacet.metadatumType;
        setAttributes({
          metadatumId: metadatumId,
          metadatumType: metadatumType,
          isModalOpen: false,
          parentTerm: null
        });
        setContent();
      },
      onCancelSelection: function onCancelSelection() {
        return setAttributes({
          isModalOpen: false
        });
      }
    }) : null, isParentTermModalOpen ? React.createElement(_parent_term_modal_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
      existingFacetId: parentTerm && parentTerm.id ? parentTerm.id : null,
      collectionId: collectionId,
      metadatumId: metadatumId,
      onSelectFacet: function onSelectFacet(selectedFacet) {
        parentTerm = selectedFacet.id !== null && selectedFacet.id !== '' && selectedFacet.id !== undefined ? selectedFacet : null;
        setAttributes({
          parentTerm: parentTerm,
          isParentTermModalOpen: false
        });
        setContent();
      },
      onCancelSelection: function onCancelSelection() {
        return setAttributes({
          isParentTermModalOpen: false
        });
      }
    }) : null, facets.length ? React.createElement("div", {
      className: "block-control"
    }, React.createElement("p", null, React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      height: "24px",
      width: "24px"
    }, React.createElement("path", {
      fill: "#298596",
      d: "M21.43,13.64,19.32,16a2.57,2.57,0,0,1-2,1H11a3.91,3.91,0,0,0,0-.49,5.49,5.49,0,0,0-5-5.47V9.64A2.59,2.59,0,0,1,8.59,7H17.3a2.57,2.57,0,0,1,2,1l2.11,2.38A2.59,2.59,0,0,1,21.43,13.64ZM4,3A2,2,0,0,0,2,5v7.3a5.32,5.32,0,0,1,2-1V5H16V3ZM11,21l-1,1L8.86,20.89,8,20H8l-.57-.57A3.42,3.42,0,0,1,5.5,20a3.5,3.5,0,0,1,0-7,2.74,2.74,0,0,1,.5,0A3.5,3.5,0,0,1,9,16a2.92,2.92,0,0,1,0,.51,3.42,3.42,0,0,1-.58,1.92L9,19H9l.85.85Zm-4-4.5A1.5,1.5,0,1,0,5.5,18,1.5,1.5,0,0,0,7,16.53Z"
    })), __('List facets from a Tainacan Collection or Repository', 'tainacan')), React.createElement(Button, {
      isPrimary: true,
      type: "submit",
      onClick: function onClick() {
        return openMetadataModal();
      }
    }, __('Select facets', 'tainacan'))) : null) : null, showSearchBar ? React.createElement("div", {
      class: "facets-search-bar"
    }, React.createElement(Button, {
      onClick: function onClick() {
        setContent();
      },
      label: __('Search', 'tainacan')
    }, React.createElement("span", {
      class: "icon"
    }, React.createElement("i", null, React.createElement("svg", {
      width: "24",
      height: "24",
      viewBox: "-2 -4 20 20"
    }, React.createElement("path", {
      class: "st0",
      d: "M0,5.8C0,5,0.2,4.2,0.5,3.5s0.7-1.3,1.2-1.8s1.1-0.9,1.8-1.2C4.2,0.1,5,0,5.8,0S7.3,0.1,8,0.5 c0.7,0.3,1.3,0.7,1.8,1.2s0.9,1.1,1.2,1.8c0.5,1.2,0.5,2.5,0.2,3.7c0,0.2-0.1,0.4-0.2,0.6c0,0.1-0.2,0.6-0.2,0.6 c0.6,0.6,1.3,1.3,1.9,1.9c0.7,0.7,1.3,1.3,2,2c0,0,0.3,0.2,0.3,0.3c0,0.3-0.1,0.7-0.3,1c-0.2,0.6-0.8,1-1.4,1.2 c-0.1,0-0.6,0.2-0.6,0.1c0,0-4.2-4.2-4.2-4.2c0,0-0.8,0.3-0.8,0.4c-1.3,0.4-2.8,0.5-4.1-0.1c-0.7-0.3-1.3-0.7-1.8-1.2 C1.2,9.3,0.8,8.7,0.5,8S0,6.6,0,5.8z M1.6,5.8c0,0.4,0.1,0.9,0.2,1.3C2.1,8.2,3,9.2,4.1,9.6c0.5,0.2,1,0.3,1.6,0.3 c0.6,0,1.1-0.1,1.6-0.3C8.7,9,9.7,7.6,9.8,6c0.1-1.5-0.6-3.1-2-3.9c-0.9-0.5-2-0.6-3-0.4C4.6,1.8,4.4,1.9,4.1,2 c-0.5,0.2-1,0.5-1.4,0.9C2,3.7,1.6,4.7,1.6,5.8z"
    }))))), React.createElement("input", {
      value: searchString,
      onChange: function onChange(value) {
        _.debounce(applySearchString(value), 300);
      },
      type: "text"
    })) : null, !facets.length && !isLoading && !(searchString != undefined && searchString != '') ? React.createElement(Placeholder, {
      icon: React.createElement("img", {
        width: 148,
        src: "".concat(tainacan_blocks.base_url, "/assets/images/tainacan_logo_header.svg"),
        alt: "Tainacan Logo"
      })
    }, React.createElement("p", null, React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      height: "24px",
      width: "24px"
    }, React.createElement("path", {
      fill: "#298596",
      d: "M21.43,13.64,19.32,16a2.57,2.57,0,0,1-2,1H11a3.91,3.91,0,0,0,0-.49,5.49,5.49,0,0,0-5-5.47V9.64A2.59,2.59,0,0,1,8.59,7H17.3a2.57,2.57,0,0,1,2,1l2.11,2.38A2.59,2.59,0,0,1,21.43,13.64ZM4,3A2,2,0,0,0,2,5v7.3a5.32,5.32,0,0,1,2-1V5H16V3ZM11,21l-1,1L8.86,20.89,8,20H8l-.57-.57A3.42,3.42,0,0,1,5.5,20a3.5,3.5,0,0,1,0-7,2.74,2.74,0,0,1,.5,0A3.5,3.5,0,0,1,9,16a2.92,2.92,0,0,1,0,.51,3.42,3.42,0,0,1-.58,1.92L9,19H9l.85.85Zm-4-4.5A1.5,1.5,0,1,0,5.5,18,1.5,1.5,0,0,0,7,16.53Z"
    })), __('List facets from a Tainacan Collection or Repository', 'tainacan')), parentTerm && parentTerm.id && metadatumType == 'Taxonomy' ? React.createElement("div", {
      style: {
        display: 'flex'
      }
    }, React.createElement(Button, {
      isPrimary: true,
      type: "submit",
      onClick: function onClick() {
        return openParentTermModal();
      }
    }, __('Change parent term', 'tainacan')), React.createElement("p", {
      style: {
        margin: '0 12px'
      }
    }, __('or', 'tainacan')), React.createElement(Button, {
      isPrimary: true,
      type: "submit",
      onClick: function onClick() {
        return openMetadataModal();
      }
    }, __('Change facets source', 'tainacan'))) : React.createElement(Button, {
      isPrimary: true,
      type: "submit",
      onClick: function onClick() {
        return openMetadataModal();
      }
    }, __('Select facets', 'tainacan'))) : null, isLoading ? React.createElement("div", {
      class: "spinner-container"
    }, React.createElement(Spinner, null)) : React.createElement("div", null, React.createElement("ul", {
      style: {
        gridTemplateColumns: layout == 'grid' ? 'repeat(auto-fill, ' + (gridMargin + 185) + 'px)' : 'inherit',
        marginTop: showSearchBar ? '1.5rem' : '0px'
      },
      className: 'facets-list-edit facets-layout-' + layout
    }, facets)), showLoadMore && facets.length > 0 && !isLoading ? React.createElement(Tooltip, {
      text: __('If necessary, the show more button will be available on post or page.', 'tainacan')
    }, React.createElement("button", {
      class: "show-more-button",
      disabled: true,
      label: __('Show more', 'tainacan')
    }, React.createElement("span", {
      class: "icon"
    }, React.createElement("i", null, React.createElement("svg", {
      width: "24",
      height: "24",
      viewBox: "4 5 24 24"
    }, React.createElement("path", {
      d: "M 7.41,8.295 6,9.705 l 6,6 6,-6 -1.41,-1.41 -4.59,4.58 z"
    }), React.createElement("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    })))))) : null);
  },
  save: function save(_ref2) {
    var attributes = _ref2.attributes,
        className = _ref2.className;
    var content = attributes.content,
        blockId = attributes.blockId,
        collectionId = attributes.collectionId,
        collectionSlug = attributes.collectionSlug,
        parentTerm = attributes.parentTerm,
        showImage = attributes.showImage,
        showItemsCount = attributes.showItemsCount,
        showLoadMore = attributes.showLoadMore,
        layout = attributes.layout,
        cloudRate = attributes.cloudRate,
        gridMargin = attributes.gridMargin,
        metadatumId = attributes.metadatumId,
        metadatumType = attributes.metadatumType,
        maxFacetsNumber = attributes.maxFacetsNumber,
        showSearchBar = attributes.showSearchBar;
    return React.createElement("div", {
      className: className,
      "metadatum-id": metadatumId,
      "metadatum-type": metadatumType,
      "collection-id": collectionId,
      "collection-slug": collectionSlug,
      "parent-term-id": parentTerm ? parentTerm.id : null,
      "show-image": '' + showImage,
      "show-items-count": '' + showItemsCount,
      "show-search-bar": '' + showSearchBar,
      "show-load-more": '' + showLoadMore,
      layout: layout,
      "cloud-rate": cloudRate,
      "grid-margin": gridMargin,
      "max-facets-number": maxFacetsNumber,
      "tainacan-api-root": tainacan_blocks.root,
      "tainacan-base-url": tainacan_blocks.base_url,
      "tainacan-site-url": tainacan_blocks.site_url,
      id: 'wp-block-tainacan-facets-list_' + blockId
    }, content);
  },
  deprecated: [{
    attributes: {
      content: {
        type: 'array',
        source: 'children',
        selector: 'div'
      },
      collectionId: {
        type: String,
        default: undefined
      },
      collectionSlug: {
        type: String,
        default: undefined
      },
      facets: {
        type: Array,
        default: []
      },
      facetsObject: {
        type: Array,
        default: []
      },
      showImage: {
        type: Boolean,
        default: true
      },
      showItemsCount: {
        type: Boolean,
        default: true
      },
      showLoadMore: {
        type: Boolean,
        default: false
      },
      showSearchBar: {
        type: Boolean,
        value: false
      },
      layout: {
        type: String,
        default: 'grid'
      },
      cloudRate: {
        type: Number,
        default: 1
      },
      isModalOpen: {
        type: Boolean,
        default: false
      },
      gridMargin: {
        type: Number,
        default: 0
      },
      metadatumId: {
        type: String,
        default: undefined
      },
      metadatumType: {
        type: String,
        default: undefined
      },
      facetsRequestSource: {
        type: String,
        default: undefined
      },
      maxFacetsNumber: {
        type: Number,
        value: undefined
      },
      isLoading: {
        type: Boolean,
        value: false
      },
      isLoadingCollection: {
        type: Boolean,
        value: false
      },
      collection: {
        type: Object,
        value: undefined
      },
      searchString: {
        type: String,
        default: undefined
      },
      blockId: {
        type: String,
        default: undefined
      }
    },
    save: function save(_ref3) {
      var attributes = _ref3.attributes,
          className = _ref3.className;
      var content = attributes.content,
          blockId = attributes.blockId,
          collectionId = attributes.collectionId,
          collectionSlug = attributes.collectionSlug,
          showImage = attributes.showImage,
          showItemsCount = attributes.showItemsCount,
          showLoadMore = attributes.showLoadMore,
          layout = attributes.layout,
          cloudRate = attributes.cloudRate,
          gridMargin = attributes.gridMargin,
          metadatumId = attributes.metadatumId,
          metadatumType = attributes.metadatumType,
          maxFacetsNumber = attributes.maxFacetsNumber,
          showSearchBar = attributes.showSearchBar;
      return React.createElement("div", {
        className: className,
        "metadatum-id": metadatumId,
        "metadatum-type": metadatumType,
        "collection-id": collectionId,
        "collection-slug": collectionSlug,
        "show-image": '' + showImage,
        "show-items-count": '' + showItemsCount,
        "show-search-bar": '' + showSearchBar,
        "show-load-more": '' + showLoadMore,
        layout: layout,
        "cloud-rate": cloudRate,
        "grid-margin": gridMargin,
        "max-facets-number": maxFacetsNumber,
        "tainacan-api-root": tainacan_plugin.root,
        "tainacan-base-url": tainacan_plugin.base_url,
        "tainacan-site-url": tainacan_plugin.site_url,
        id: 'wp-block-tainacan-facets-list_' + blockId
      }, content);
    }
  }]
});

/***/ }),

/***/ "./src/views/gutenberg-blocks/tainacan-facets/facets-list/metadata-modal.js":
/*!**********************************************************************************!*\
  !*** ./src/views/gutenberg-blocks/tainacan-facets/facets-list/metadata-modal.js ***!
  \**********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MetadataModal; });
/* harmony import */ var _js_axios_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../js/axios.js */ "./src/views/gutenberg-blocks/js/axios.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }



var __ = wp.i18n.__;
var _wp$components = wp.components,
    TextControl = _wp$components.TextControl,
    Button = _wp$components.Button,
    Modal = _wp$components.Modal,
    RadioControl = _wp$components.RadioControl,
    SelectControl = _wp$components.SelectControl,
    Spinner = _wp$components.Spinner;

var MetadataModal =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MetadataModal, _React$Component);

  function MetadataModal(props) {
    var _this;

    _classCallCheck(this, MetadataModal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MetadataModal).call(this, props)); // Initialize state

    _this.state = {
      collectionsPerPage: 24,
      collectionId: undefined,
      collectionSlug: undefined,
      isLoadingCollections: false,
      modalCollections: [],
      totalModalCollections: 0,
      collectionPage: 1,
      temporaryCollectionId: '',
      searchCollectionName: '',
      collectionOrderBy: 'date-desc',
      metadatumId: undefined,
      metadatumType: undefined,
      isLoadingMetadata: false,
      modalMetadata: [],
      temporaryMetadatumId: '',
      collections: [],
      collectionsRequestSource: undefined,
      metadataRequestSource: undefined
    }; // Bind events

    _this.resetCollections = _this.resetCollections.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.selectCollection = _this.selectCollection.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.fetchCollections = _this.fetchCollections.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.fetchModalCollections = _this.fetchModalCollections.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.selectMetadatum = _this.selectMetadatum.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.fetchModalMetadata = _this.fetchModalMetadata.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.getMetadatumType = _this.getMetadatumType.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(MetadataModal, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.setState({
        collectionId: this.props.existingCollectionId,
        collectionSlug: this.props.existingCollectionSlug
      });

      if (this.props.existingCollectionId != null && this.props.existingCollectionId != undefined) {
        this.fetchModalMetadata(this.props.existingCollectionId);
        this.setState({
          metadatumId: this.props.existingMetadatumId ? this.props.existingMetadatumId : undefined,
          metadatumType: this.props.existingMetadatumType ? this.props.existingMetadatumType : undefined
        });
      } else {
        this.setState({
          collectionPage: 1
        });
        this.fetchModalCollections();
      }
    } // COLLECTIONS RELATED --------------------------------------------------

  }, {
    key: "fetchModalCollections",
    value: function fetchModalCollections() {
      var _this2 = this;

      var someModalCollections = this.state.modalCollections;
      if (this.state.collectionPage <= 1) someModalCollections = [];
      var endpoint = '/collections/?perpage=' + this.state.collectionsPerPage + '&paged=' + this.state.collectionPage;
      if (this.state.collectionOrderBy == 'date') endpoint += '&orderby=date&order=asc';else if (this.state.collectionOrderBy == 'date-desc') endpoint += '&orderby=date&order=desc';else if (this.state.collectionOrderBy == 'title') endpoint += '&orderby=title&order=asc';else if (this.state.collectionOrderBy == 'title-desc') endpoint += '&orderby=title&order=desc';
      this.setState({
        isLoadingCollections: true,
        collectionPage: this.state.collectionPage + 1,
        modalCollections: someModalCollections
      });
      _js_axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].get(endpoint).then(function (response) {
        var otherModalCollections = _this2.state.modalCollections;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = response.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var collection = _step.value;
            otherModalCollections.push({
              name: collection.name,
              id: collection.id,
              slug: collection.slug
            });
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        _this2.setState({
          isLoadingCollections: false,
          modalCollections: otherModalCollections,
          totalModalCollections: response.headers['x-wp-total']
        });

        return otherModalCollections;
      }).catch(function (error) {
        console.log('Error trying to fetch collections: ' + error);
      });
    }
  }, {
    key: "selectCollection",
    value: function selectCollection(selectedCollectionId) {
      var selectedCollection;
      if (selectedCollectionId == 'default') selectedCollection = {
        label: __('Repository items', 'tainacan'),
        id: 'default',
        slug: tainacan_blocks.theme_items_list_url.split('/')[tainacan_blocks.theme_items_list_url.split('/').length - 1]
      };else {
        selectedCollection = this.state.modalCollections.find(function (collection) {
          return collection.id == selectedCollectionId;
        });
        if (selectedCollection == undefined) selectedCollection = this.state.collections.find(function (collection) {
          return collection.id == selectedCollectionId;
        });
      }
      this.setState({
        collectionId: selectedCollection.id,
        collectionSlug: selectedCollection.slug
      });
      this.props.onSelectCollection(selectedCollection);
      this.fetchModalMetadata(selectedCollection.id);
    }
  }, {
    key: "fetchCollections",
    value: function fetchCollections(name) {
      var _this3 = this;

      if (this.state.collectionsRequestSource != undefined) this.state.collectionsRequestSource.cancel('Previous collections search canceled.');
      var aCollectionRequestSource = axios__WEBPACK_IMPORTED_MODULE_1___default.a.CancelToken.source();
      this.setState({
        collectionsRequestSource: aCollectionRequestSource,
        isLoadingCollections: true,
        collections: [],
        metadata: []
      });
      var endpoint = '/collections/?perpage=' + this.state.collectionsPerPage;
      if (name != undefined && name != '') endpoint += '&search=' + name;
      if (this.state.collectionOrderBy == 'date') endpoint += '&orderby=date&order=asc';else if (this.state.collectionOrderBy == 'date-desc') endpoint += '&orderby=date&order=desc';else if (this.state.collectionOrderBy == 'title') endpoint += '&orderby=title&order=asc';else if (this.state.collectionOrderBy == 'title-desc') endpoint += '&orderby=title&order=desc';
      _js_axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].get(endpoint, {
        cancelToken: aCollectionRequestSource.token
      }).then(function (response) {
        var someCollections = response.data.map(function (collection) {
          return {
            name: collection.name,
            id: collection.id + '',
            slug: collection.slug
          };
        });

        _this3.setState({
          isLoadingCollections: false,
          collections: someCollections
        });

        return someCollections;
      }).catch(function (error) {
        console.log('Error trying to fetch collections: ' + error);
      });
    }
  }, {
    key: "resetCollections",
    value: function resetCollections() {
      this.setState({
        collectionId: null,
        collectionPage: 1,
        modalCollections: []
      });
      this.fetchModalCollections();
    }
  }, {
    key: "cancelSelection",
    value: function cancelSelection() {
      this.setState({
        modalCollections: []
      });
      this.props.onCancelSelection();
    } // FACETS RELATED --------------------------------------------------

  }, {
    key: "fetchModalMetadata",
    value: function fetchModalMetadata(selectedCollectionId) {
      var _this4 = this;

      var someModalMetadata = [];
      var endpoint = selectedCollectionId != 'default' ? '/collection/' + selectedCollectionId + '/metadata/?nopaging=1' : '/metadata/?nopaging=1';
      this.setState({
        isLoadingMetadata: true,
        modalMetadata: someModalMetadata
      });
      _js_axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].get(endpoint).then(function (response) {
        var otherModalMetadata = _this4.state.modalMetadata;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = response.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var metadatum = _step2.value;
            otherModalMetadata.push({
              name: metadatum.name,
              id: metadatum.id,
              type: _this4.getMetadatumType(metadatum)
            });
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        _this4.setState({
          isLoadingMetadata: false,
          modalMetadata: otherModalMetadata
        });

        return otherModalMetadata;
      }).catch(function (error) {
        console.log('Error trying to fetch metadata: ' + error);
      });
    }
  }, {
    key: "getMetadatumType",
    value: function getMetadatumType(metadatum) {
      var metadatumType = metadatum.metadata_type_object ? metadatum.metadata_type_object.component : false;

      if (metadatumType) {
        switch (metadatumType) {
          case 'tainacan-text':
            return __('Text', 'tainacan');

          case 'tainacan-textarea':
            return __('Text area', 'tainacan');

          case 'tainacan-date':
            return __('Date', 'tainacan');

          case 'tainacan-numeric':
            return __('Numeric', 'tainacan');

          case 'tainacan-selectbox':
            return __('Select box', 'tainacan');

          case 'tainacan-relationship':
            return __('Relationship', 'tainacan');

          case 'tainacan-taxonomy':
            return __('Taxonomy', 'tainacan');

          case 'tainacan-compound':
            return __('Compound', 'tainacan');

          default:
            return false;
        }
      } else {
        return metadatumType;
      }
    }
  }, {
    key: "selectMetadatum",
    value: function selectMetadatum(selectedMetadatum) {
      this.setState({
        metadatumId: selectedMetadatum.id,
        metadatumType: selectedMetadatum.type
      });
      this.props.onSelectMetadatum({
        metadatumId: selectedMetadatum.id,
        metadatumType: selectedMetadatum.type
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      return this.state.collectionId != null && this.state.collectionId != undefined ? // Metadata modal
      React.createElement(Modal, {
        className: "wp-block-tainacan-modal",
        title: __('Select a metadatum to show it\'s facets on block', 'tainacan'),
        onRequestClose: function onRequestClose() {
          return _this5.cancelSelection();
        },
        contentLabel: __('Select metadatum', 'tainacan')
      }, this.state.modalMetadata.length > 0 ? React.createElement("div", null, React.createElement("div", {
        className: "modal-radio-list"
      }, React.createElement(RadioControl, {
        selected: this.state.temporaryMetadatumId,
        options: this.state.modalMetadata.map(function (metadatum) {
          return {
            label: metadatum.name + ' (' + metadatum.type + ')',
            value: '' + metadatum.id
          };
        }),
        onChange: function onChange(aMetadatumId) {
          _this5.setState({
            temporaryMetadatumId: aMetadatumId
          });
        }
      })), React.createElement("br", null)) : this.state.isLoadingMetadata ? React.createElement(Spinner, null) : React.createElement("div", {
        className: "modal-loadmore-section"
      }, React.createElement("p", null, __('Sorry, no metadatum found.', 'tainacan'))), React.createElement("div", {
        className: "modal-footer-area"
      }, React.createElement(Button, {
        isDefault: true,
        onClick: function onClick() {
          _this5.resetCollections();
        }
      }, __('Switch collection', 'tainacan')), React.createElement(Button, {
        isPrimary: true,
        disabled: this.state.temporaryMetadatumId == undefined || this.state.temporaryMetadatumId == null || this.state.temporaryMetadatumId == '',
        onClick: function onClick() {
          _this5.selectMetadatum(_this5.state.modalMetadata.find(function (metadatatum) {
            return metadatatum.id == _this5.state.temporaryMetadatumId;
          }));
        }
      }, __('Finish', 'tainacan')))) : // Collections modal
      React.createElement(Modal, {
        className: "wp-block-tainacan-modal",
        title: __('Select a collection to fetch metadata from', 'tainacan'),
        onRequestClose: function onRequestClose() {
          return _this5.cancelSelection();
        },
        contentLabel: __('Select collection', 'tainacan')
      }, React.createElement("div", null, React.createElement("div", {
        className: "modal-search-area"
      }, React.createElement(TextControl, {
        label: __('Search for a collection', 'tainacan'),
        placeholder: __('Search by collection\'s name', 'tainacan'),
        value: this.state.searchCollectionName,
        onChange: function onChange(value) {
          _this5.setState({
            searchCollectionName: value
          });

          _.debounce(_this5.fetchCollections(value), 300);
        }
      }), React.createElement(SelectControl, {
        label: __('Order by', 'tainacan'),
        value: this.state.collectionOrderBy,
        options: [{
          label: __('Latest', 'tainacan'),
          value: 'date-desc'
        }, {
          label: __('Oldest', 'tainacan'),
          value: 'date'
        }, {
          label: __('Name (A-Z)', 'tainacan'),
          value: 'title'
        }, {
          label: __('Name (Z-A)', 'tainacan'),
          value: 'title-desc'
        }],
        onChange: function onChange(aCollectionOrderBy) {
          _this5.state.collectionOrderBy = aCollectionOrderBy;
          _this5.state.collectionPage = 1;

          _this5.setState({
            collectionOrderBy: _this5.state.collectionOrderBy,
            collectionPage: _this5.state.collectionPage
          });

          if (_this5.state.searchCollectionName && _this5.state.searchCollectionName != '') {
            _this5.fetchCollections(_this5.state.searchCollectionName);
          } else {
            _this5.fetchModalCollections();
          }
        }
      })), this.state.searchCollectionName != '' ? this.state.collections.length > 0 ? React.createElement("div", null, React.createElement("div", {
        className: "modal-radio-list"
      }, React.createElement(RadioControl, {
        selected: this.state.temporaryCollectionId,
        options: this.state.collections.map(function (collection) {
          return {
            label: collection.name,
            value: '' + collection.id,
            slug: collection.slug
          };
        }),
        onChange: function onChange(aCollectionId) {
          _this5.setState({
            temporaryCollectionId: aCollectionId
          });
        }
      })), React.createElement("br", null)) : this.state.isLoadingCollections ? React.createElement(Spinner, null) : React.createElement("div", {
        className: "modal-loadmore-section"
      }, React.createElement("p", null, __('Sorry, no collection found.', 'tainacan'))) : this.state.modalCollections.length > 0 ? React.createElement("div", null, React.createElement("div", {
        className: "modal-radio-list"
      }, React.createElement("p", {
        class: "modal-radio-area-label"
      }, __('Repository', 'tainacan')), React.createElement(RadioControl, {
        className: 'repository-radio-option',
        selected: this.state.temporaryCollectionId,
        options: [{
          label: __('Repository items', 'tainacan'),
          value: 'default',
          slug: tainacan_blocks.theme_items_list_url.split('/')[tainacan_blocks.theme_items_list_url.split('/').length - 1]
        }],
        onChange: function onChange(aCollectionId) {
          _this5.setState({
            temporaryCollectionId: aCollectionId
          });
        }
      }), React.createElement("hr", null), React.createElement("p", {
        class: "modal-radio-area-label"
      }, __('Collections', 'tainacan')), React.createElement(RadioControl, {
        selected: this.state.temporaryCollectionId,
        options: this.state.modalCollections.map(function (collection) {
          return {
            label: collection.name,
            value: '' + collection.id,
            slug: collection.slug
          };
        }),
        onChange: function onChange(aCollectionId) {
          _this5.setState({
            temporaryCollectionId: aCollectionId
          });
        }
      })), React.createElement("div", {
        className: "modal-loadmore-section"
      }, React.createElement("p", null, __('Showing', 'tainacan') + " " + this.state.modalCollections.length + " " + __('of', 'tainacan') + " " + this.state.totalModalCollections + " " + __('collections', 'tainacan') + "."), this.state.modalCollections.length < this.state.totalModalCollections ? React.createElement(Button, {
        isDefault: true,
        isSmall: true,
        onClick: function onClick() {
          return _this5.fetchModalCollections();
        }
      }, __('Load more', 'tainacan')) : null)) : this.state.isLoadingCollections ? React.createElement(Spinner, null) : React.createElement("div", {
        className: "modal-loadmore-section"
      }, React.createElement("p", null, __('Sorry, no collection found.', 'tainacan'))), React.createElement("div", {
        className: "modal-footer-area"
      }, React.createElement(Button, {
        isDefault: true,
        onClick: function onClick() {
          _this5.cancelSelection();
        }
      }, __('Cancel', 'tainacan')), React.createElement(Button, {
        isPrimary: true,
        disabled: this.state.temporaryCollectionId == undefined || this.state.temporaryCollectionId == null || this.state.temporaryCollectionId == '' && (this.state.searchCollectionName != '' ? this.state.collections.find(function (collection) {
          return collection.id == _this5.state.temporaryCollectionId;
        }) : this.state.modalCollections.find(function (collection) {
          return collection.id == _this5.state.temporaryCollectionId;
        })) != undefined,
        onClick: function onClick() {
          _this5.selectCollection(_this5.state.temporaryCollectionId);
        }
      }, __('Select metadatum', 'tainacan')))));
    }
  }]);

  return MetadataModal;
}(React.Component);



/***/ }),

/***/ "./src/views/gutenberg-blocks/tainacan-facets/facets-list/parent-term-modal.js":
/*!*************************************************************************************!*\
  !*** ./src/views/gutenberg-blocks/tainacan-facets/facets-list/parent-term-modal.js ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ParentTermModal; });
/* harmony import */ var _js_axios_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../js/axios.js */ "./src/views/gutenberg-blocks/js/axios.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }



var __ = wp.i18n.__;
var _wp$components = wp.components,
    TextControl = _wp$components.TextControl,
    Button = _wp$components.Button,
    Modal = _wp$components.Modal,
    RadioControl = _wp$components.RadioControl,
    SelectControl = _wp$components.SelectControl,
    Spinner = _wp$components.Spinner;

var ParentTermModal =
/*#__PURE__*/
function (_React$Component) {
  _inherits(ParentTermModal, _React$Component);

  function ParentTermModal(props) {
    var _this;

    _classCallCheck(this, ParentTermModal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ParentTermModal).call(this, props)); // Initialize state

    _this.state = {
      metadatumId: '',
      facetsPerPage: 3,
      facetId: undefined,
      isLoadingFacets: false,
      modalFacets: [],
      totalModalFacets: 0,
      offset: 0,
      lastTerm: undefined,
      temporaryFacetId: '',
      searchFacetName: '',
      facets: [],
      facetsRequestSource: undefined
    }; // Bind events

    _this.selectFacet = _this.selectFacet.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.fetchFacets = _this.fetchFacets.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.fetchModalFacets = _this.fetchModalFacets.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(ParentTermModal, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.setState({
        collectionId: this.props.collectionId,
        metadatumId: this.props.metadatumId,
        temporaryFacetId: this.props.existingFacetId,
        facetId: this.props.existingFacetId,
        offset: 0,
        lastTerm: undefined
      });
      this.fetchModalFacets();
    } // COLLECTIONS RELATED --------------------------------------------------

  }, {
    key: "fetchModalFacets",
    value: function fetchModalFacets() {
      var _this2 = this;

      var someModalFacets = this.state.modalFacets;
      if (this.state.offset == 0) someModalFacets = [];
      var endpoint = '/facets/' + this.props.metadatumId + '?number=' + this.state.facetsPerPage + '&offset=' + this.state.offset;
      if (this.state.collectionId) endpoint = '/collection/' + this.props.collectionId + endpoint;
      if (this.state.lastTerm != undefined) endpoint += 'last_term=' + this.state.lastTerm;
      this.setState({
        isLoadingFacets: true,
        modalFacets: someModalFacets
      });
      _js_axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].get(endpoint).then(function (response) {
        var otherModalFacets = _this2.state.modalFacets;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = response.data.values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var facet = _step.value;
            otherModalFacets.push({
              name: facet.label,
              id: facet.value
            });
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        _this2.setState({
          isLoadingFacets: false,
          modalFacets: otherModalFacets,
          totalModalFacets: response.headers['x-wp-total'],
          offset: _this2.state.offset + response.data.values.length,
          lastTerm: response.data.last_term
        });

        return otherModalFacets;
      }).catch(function (error) {
        console.log('Error trying to fetch facets: ' + error);
      });
    }
  }, {
    key: "selectFacet",
    value: function selectFacet(selectedFacetId) {
      var selectedFacet;
      if (selectedFacetId === null || selectedFacetId === '') selectedFacet = {
        name: __('Any term.', 'tainacan'),
        id: null
      };else if (selectedFacetId == '0' || selectedFacet == 0) selectedFacet = {
        name: __('Root terms', 'tainacan'),
        id: '0'
      };else {
        selectedFacet = this.state.modalFacets.find(function (facet) {
          return facet.id == selectedFacetId;
        });
        if (selectedFacet == undefined) selectedFacet = this.state.facets.find(function (facet) {
          return facet.id == selectedFacetId;
        });
      }
      this.setState({
        facetId: selectedFacet.id
      });
      this.props.onSelectFacet(selectedFacet);
    }
  }, {
    key: "fetchFacets",
    value: function fetchFacets(name) {
      var _this3 = this;

      if (this.state.facetsRequestSource != undefined) this.state.facetsRequestSource.cancel('Previous facets search canceled.');
      var aFacetRequestSource = axios__WEBPACK_IMPORTED_MODULE_1___default.a.CancelToken.source();
      this.setState({
        facetsRequestSource: aFacetRequestSource,
        isLoadingFacets: true,
        facets: [],
        metadata: []
      });
      var endpoint = '/facets/' + this.props.metadatumId + '?number=' + this.state.facetsPerPage;
      if (this.state.collectionId) endpoint = '/collection/' + this.props.collectionId + endpoint;
      if (name != undefined && name != '') endpoint += '&search=' + name;
      _js_axios_js__WEBPACK_IMPORTED_MODULE_0__["default"].get(endpoint, {
        cancelToken: aFacetRequestSource.token
      }).then(function (response) {
        var someFacets = response.data.values.map(function (facet) {
          return {
            name: facet.label,
            id: facet.value + ''
          };
        });

        _this3.setState({
          isLoadingFacets: false,
          facets: someFacets
        });

        return someFacets;
      }).catch(function (error) {
        console.log('Error trying to fetch facets: ' + error);
      });
    }
  }, {
    key: "cancelSelection",
    value: function cancelSelection() {
      this.setState({
        modalFacets: []
      });
      this.props.onCancelSelection();
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      return (// Facets modal
        React.createElement(Modal, {
          className: "wp-block-tainacan-modal",
          title: __('Select a parent term to fetch facets from', 'tainacan'),
          onRequestClose: function onRequestClose() {
            return _this4.cancelSelection();
          },
          contentLabel: __('Select term', 'tainacan')
        }, React.createElement("div", null, React.createElement("div", {
          className: "modal-search-area"
        }, React.createElement(TextControl, {
          label: __('Search for a term', 'tainacan'),
          placeholder: __('Search by term\'s name', 'tainacan'),
          value: this.state.searchFacetName,
          onChange: function onChange(value) {
            _this4.setState({
              searchFacetName: value
            });

            _.debounce(_this4.fetchFacets(value), 300);
          }
        })), this.state.searchFacetName != '' ? this.state.facets.length > 0 ? React.createElement("div", null, React.createElement("div", {
          className: "modal-radio-list"
        }, React.createElement(RadioControl, {
          selected: this.state.temporaryFacetId,
          options: this.state.facets.map(function (facet) {
            return {
              label: facet.name,
              value: '' + facet.id
            };
          }),
          onChange: function onChange(aFacetId) {
            _this4.setState({
              temporaryFacetId: aFacetId
            });
          }
        })), React.createElement("br", null)) : this.state.isLoadingFacets ? React.createElement(Spinner, null) : React.createElement("div", {
          className: "modal-loadmore-section"
        }, React.createElement("p", null, __('Sorry, no term found.', 'tainacan'))) : this.state.modalFacets.length > 0 ? React.createElement("div", null, React.createElement("div", {
          className: "modal-radio-list"
        }, React.createElement("p", {
          class: "modal-radio-area-label"
        }, __('Non specific term', 'tainacan')), React.createElement(RadioControl, {
          className: 'repository-radio-option',
          selected: this.state.temporaryFacetId,
          options: [{
            label: __('Terms children of any term', 'tainacan'),
            value: ''
          }, {
            label: __('Terms with no parent (root terms)', 'tainacan'),
            value: '0'
          }],
          onChange: function onChange(aFacetId) {
            _this4.setState({
              temporaryFacetId: aFacetId
            });
          }
        }), React.createElement("hr", null), React.createElement("p", {
          class: "modal-radio-area-label"
        }, __('Terms', 'tainacan')), React.createElement(RadioControl, {
          selected: this.state.temporaryFacetId,
          options: this.state.modalFacets.map(function (facet) {
            return {
              label: facet.name,
              value: '' + facet.id
            };
          }),
          onChange: function onChange(aFacetId) {
            _this4.setState({
              temporaryFacetId: aFacetId
            });
          }
        })), React.createElement("div", {
          className: "modal-loadmore-section"
        }, React.createElement("p", null, __('Showing', 'tainacan') + " " + this.state.modalFacets.length + " " + __('of', 'tainacan') + " " + this.state.totalModalFacets + " " + __('terms', 'tainacan') + "."), this.state.modalFacets.length < this.state.totalModalFacets ? React.createElement(Button, {
          isDefault: true,
          isSmall: true,
          onClick: function onClick() {
            return _this4.fetchModalFacets();
          }
        }, __('Load more', 'tainacan')) : null)) : this.state.isLoadingFacets ? React.createElement(Spinner, null) : React.createElement("div", {
          className: "modal-loadmore-section"
        }, React.createElement("p", null, __('Sorry, no terms found.', 'tainacan'))), React.createElement("div", {
          className: "modal-footer-area"
        }, React.createElement(Button, {
          isDefault: true,
          onClick: function onClick() {
            _this4.cancelSelection();
          }
        }, __('Cancel', 'tainacan')), React.createElement(Button, {
          isPrimary: true,
          onClick: function onClick() {
            _this4.selectFacet(_this4.state.temporaryFacetId);
          }
        }, __('Select term', 'tainacan')))))
      );
    }
  }]);

  return ParentTermModal;
}(React.Component);



/***/ })

/******/ });