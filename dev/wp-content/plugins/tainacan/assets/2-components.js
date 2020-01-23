(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/admin/components/other/collections-modal.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/admin/components/other/collections-modal.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'CollectionsModal',
  data: function data() {
    return {
      collections: [],
      isLoading: false
    };
  },
  methods: _objectSpread({}, Object(vuex__WEBPACK_IMPORTED_MODULE_0__["mapActions"])('collection', ['fetchCollections']), {
    onSelectCollection: function onSelectCollection(collection) {
      this.$router.push(this.$routerHelper.getNewItemPath(collection.id));
      this.$parent.close();
    }
  }),
  mounted: function mounted() {
    var _this = this;

    this.isLoading = true;
    this.fetchCollections({
      page: 1,
      collectionsPerPage: 96,
      contextEdit: true
    }).then(function (res) {
      _this.collections = res.collections;
      _this.isLoading = false;
    }).catch(function (error) {
      _this.$console.log(error);

      _this.isLoading = false;
    });
    if (this.$refs.collectionsModal) this.$refs.collectionsModal.focus();
  }
});

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/lib/loader.js?!./node_modules/vue-loader/lib/index.js?!./src/admin/components/other/collections-modal.vue?vue&type=style&index=0&id=4780df54&lang=scss&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/lib/loader.js??ref--5-2!./node_modules/vue-loader/lib??vue-loader-options!./src/admin/components/other/collections-modal.vue?vue&type=style&index=0&id=4780df54&lang=scss&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.sr-only[data-v-4780df54] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n}\n@keyframes slide-menu-in-data-v-4780df54 {\nfrom {\n    -ms-transform: translate(-100%, 0);\n    /* IE 9 */\n    -webkit-transform: translate(-100%, 0);\n    /* Safari */\n    transform: translate(-100%, 0);\n}\nto {\n    -ms-transform: translate(0, 0);\n    /* IE 9 */\n    -webkit-transform: translate(0, 0);\n    /* Safari */\n    transform: translate(0, 0);\n}\n}\n@keyframes slide-menu-out-data-v-4780df54 {\nfrom {\n    -ms-transform: translate(0, 0);\n    /* IE 9 */\n    -webkit-transform: translate(0, 0);\n    /* Safari */\n    transform: translate(0, 0);\n}\nto {\n    -ms-transform: translate(-100%, 0);\n    /* IE 9 */\n    -webkit-transform: translate(-100%, 0);\n    /* Safari */\n    transform: translate(-100%, 0);\n}\n}\n@keyframes appear-data-v-4780df54 {\nfrom {\n    opacity: 0.0;\n    visibility: hidden;\n}\nto {\n    opacity: 1.0;\n    visibility: visible;\n}\n}\n@keyframes disappear-data-v-4780df54 {\nfrom {\n    opacity: 0.3;\n    visibility: visible;\n}\nto {\n    opacity: 0.0;\n    visibility: hidden;\n}\n}\n.slide-menu-enter-active[data-v-4780df54] {\n  animation-name: slide-menu-in-data-v-4780df54;\n  animation-duration: 0.3s;\n  animation-timing-function: ease-out;\n}\n.slide-menu-enter-active .modal-background[data-v-4780df54] {\n    animation-name: appear-data-v-4780df54;\n    animation-duration: 0.6s;\n    animation-timing-function: ease-out;\n}\n.slide-menu-leave-active[data-v-4780df54] {\n  animation-name: slide-menu-out-data-v-4780df54;\n  animation-duration: 0.3s;\n  animation-timing-function: ease-in;\n}\n.slide-menu-leave-active .modal-background[data-v-4780df54] {\n    opacity: 0.0;\n    animation-name: disappear-data-v-4780df54;\n    animation-duration: 0.2s;\n    animation-timing-function: ease-in;\n}\n@keyframes appear-from-top-data-v-4780df54 {\nfrom {\n    top: 24px;\n    opacity: 0;\n}\nto {\n    top: 48px;\n    opacity: 1;\n}\n}\n@keyframes expand-data-v-4780df54 {\nfrom {\n    max-height: 0;\n}\nto {\n    max-height: 222px;\n}\n}\n@keyframes item-appear-data-v-4780df54 {\nfrom {\n    opacity: 0;\n    visibility: hidden;\n    transform: translate(0, 12px);\n}\nto {\n    opacity: 1;\n    visibility: visible;\n    transform: translate(0, 0px);\n}\n}\n@keyframes filter-item-in-data-v-4780df54 {\nfrom {\n    opacity: 0;\n    height: 0px;\n    max-height: 0px;\n    min-height: 0px;\n    -ms-transform: translate(0%, -30%);\n    /* IE 9 */\n    -webkit-transform: translate(0%, -30%);\n    /* Safari */\n    transform: translate(0%, -30%);\n}\nto {\n    height: 35px;\n    max-height: 35px;\n    min-height: 35px;\n    opacity: 1;\n    -ms-transform: translate(0, 0);\n    /* IE 9 */\n    -webkit-transform: translate(0, 0);\n    /* Safari */\n    transform: translate(0, 0);\n}\n}\n@keyframes filter-item-out-data-v-4780df54 {\nfrom {\n    height: 35px;\n    max-height: 35px;\n    min-height: 35px;\n    opacity: 1;\n    -ms-transform: translate(0, 0);\n    /* IE 9 */\n    -webkit-transform: translate(0, 0);\n    /* Safari */\n    transform: translate(0, 0);\n}\nto {\n    height: 0px;\n    max-height: 0px;\n    min-height: 0px;\n    opacity: 0;\n    -ms-transform: translate(0%, -30%);\n    /* IE 9 */\n    -webkit-transform: translate(0%, -30%);\n    /* Safari */\n    transform: translate(0%, -30%);\n}\n}\n.filter-item-enter-active[data-v-4780df54] {\n  overflow: hidden;\n  animation-name: filter-item-in-data-v-4780df54;\n  animation-duration: 0.1s;\n  animation-timing-function: ease;\n}\n.filter-item-leave-active[data-v-4780df54] {\n  overflow: hidden;\n  animation-name: filter-item-out-data-v-4780df54;\n  animation-duration: 0.1s;\n  animation-timing-function: ease;\n}\n@keyframes form-collapse-in-data-v-4780df54 {\nfrom {\n    opacity: 0;\n    height: 0px;\n    max-height: 0px;\n    min-height: 0px;\n}\nto {\n    height: 300px;\n    max-height: 300px;\n    min-height: 300px;\n    opacity: 1;\n}\n}\n@keyframes form-collapse-out-data-v-4780df54 {\nfrom {\n    height: 300px;\n    max-height: 300px;\n    min-height: 300px;\n}\nto {\n    height: 0px;\n    max-height: 0px;\n    min-height: 0px;\n}\n}\n.form-collapse-enter-active[data-v-4780df54] {\n  overflow: hidden;\n  animation-name: form-collapse-in-data-v-4780df54;\n  animation-duration: 0.2s;\n  animation-timing-function: ease;\n}\n.form-collapse-leave-active[data-v-4780df54] {\n  overflow: hidden;\n  animation-name: form-collapse-out-data-v-4780df54;\n  animation-duration: 0.15s;\n  animation-timing-function: ease;\n}\n@keyframes form-capabilities-in-data-v-4780df54 {\nfrom {\n    opacity: 0;\n    height: 0px;\n    max-height: 0px;\n    min-height: 0px;\n}\nto {\n    height: 120px;\n    max-height: 120px;\n    min-height: 120px;\n    opacity: 1;\n}\n}\n@keyframes form-capabilities-out-data-v-4780df54 {\nfrom {\n    height: 120px;\n    max-height: 120px;\n    min-height: 120px;\n}\nto {\n    height: 0px;\n    max-height: 0px;\n    min-height: 0px;\n}\n}\n.form-capabilities-enter-active[data-v-4780df54] {\n  overflow: hidden;\n  animation-name: form-capabilities-in-data-v-4780df54;\n  animation-duration: 0.2s;\n  animation-timing-function: ease;\n}\n.form-capabilities-leave-active[data-v-4780df54] {\n  overflow: hidden;\n  animation-name: form-capabilities-out-data-v-4780df54;\n  animation-duration: 0.15s;\n  animation-timing-function: ease;\n}\n@keyframes filters-menu-in-data-v-4780df54 {\nfrom {\n    opacity: 0;\n    width: 0px;\n    max-width: 0px;\n    min-width: 0px;\n    -ms-transform: translate(-30%, 0%);\n    /* IE 9 */\n    -webkit-transform: translate(-30%, 0%);\n    /* Safari */\n    transform: translate(-30%, 0%);\n}\nto {\n    height: 180px;\n    max-width: 180px;\n    min-width: 180px;\n    opacity: 1;\n    -ms-transform: translate(0, 0);\n    /* IE 9 */\n    -webkit-transform: translate(0, 0);\n    /* Safari */\n    transform: translate(0, 0);\n}\n}\n@keyframes filters-menu-out-data-v-4780df54 {\nfrom {\n    width: 180px;\n    max-width: 180px;\n    min-width: 180px;\n    opacity: 1;\n    -ms-transform: translate(0, 0);\n    /* IE 9 */\n    -webkit-transform: translate(0, 0);\n    /* Safari */\n    transform: translate(0, 0);\n}\nto {\n    width: 0px;\n    max-width: 0px;\n    min-width: 0px;\n    opacity: 0;\n    -ms-transform: translate(-30%, 0%);\n    /* IE 9 */\n    -webkit-transform: translate(-30%, 0%);\n    /* Safari */\n    transform: translate(-30%, 0%);\n}\n}\n.filters-menu-enter-active[data-v-4780df54] {\n  animation-name: filters-menu-in-data-v-4780df54;\n  animation-duration: 0.2s;\n  animation-timing-function: ease;\n}\n.filters-menu-leave-active[data-v-4780df54] {\n  animation-name: filters-menu-out-data-v-4780df54;\n  animation-duration: 0.2s;\n  animation-timing-function: ease;\n}\n@keyframes slide-left-in-data-v-4780df54 {\nfrom {\n    opacity: 0;\n    -ms-transform: translate(-5%, 0%) scale(0.95);\n    /* IE 9 */\n    -webkit-transform: translate(-5%, 0%) scale(0.95);\n    /* Safari */\n    transform: translate(-5%, 0%) scale(0.95);\n}\nto {\n    opacity: 1;\n    -ms-transform: translate(0, 0) scale(1);\n    /* IE 9 */\n    -webkit-transform: translate(0, 0) scale(1);\n    /* Safari */\n    transform: translate(0, 0) scale(1);\n}\n}\n@keyframes slide-left-out-data-v-4780df54 {\nfrom {\n    opacity: 1;\n    -ms-transform: translate(0, 0) scale(1);\n    /* IE 9 */\n    -webkit-transform: translate(0, 0) scale(1);\n    /* Safari */\n    transform: translate(0, 0) scale(1);\n}\nto {\n    opacity: 0;\n    -ms-transform: translate(10%, 0%) scale(0.95);\n    /* IE 9 */\n    -webkit-transform: translate(10%, 0%) scale(0.95);\n    /* Safari */\n    transform: translate(10%, 0%) scale(0.95);\n}\n}\n.slide-left-enter-active[data-v-4780df54] {\n  animation-name: slide-left-in-data-v-4780df54;\n  animation-duration: 0.4s;\n  animation-timing-function: ease;\n}\n.slide-left-leave-active[data-v-4780df54] {\n  animation-name: slide-left-out-data-v-4780df54;\n  animation-duration: 0.4s;\n  animation-timing-function: ease;\n}\n@keyframes slide-right-in-data-v-4780df54 {\nfrom {\n    opacity: 0;\n    -ms-transform: translate(10%, 0%) scale(0.95);\n    /* IE 9 */\n    -webkit-transform: translate(10%, 0%) scale(0.95);\n    /* Safari */\n    transform: translate(10%, 0%) scale(0.95);\n}\nto {\n    opacity: 1;\n    -ms-transform: translate(0, 0) scale(1);\n    /* IE 9 */\n    -webkit-transform: translate(0, 0) scale(1);\n    /* Safari */\n    transform: translate(0, 0) scale(1);\n}\n}\n@keyframes slide-right-out-data-v-4780df54 {\nfrom {\n    opacity: 1;\n    -ms-transform: translate(0, 0) scale(1);\n    /* IE 9 */\n    -webkit-transform: translate(0, 0) scale(1);\n    /* Safari */\n    transform: translate(0, 0) scale(1);\n}\nto {\n    opacity: 0;\n    -ms-transform: translate(-5%, 0%) scale(0.95);\n    /* IE 9 */\n    -webkit-transform: translate(-5%, 0%) scale(0.95);\n    /* Safari */\n    transform: translate(-5%, 0%) scale(0.95);\n}\n}\n.slide-right-enter-active[data-v-4780df54] {\n  animation-name: slide-right-in-data-v-4780df54;\n  animation-duration: 0.3s;\n  animation-timing-function: ease;\n}\n.slide-right-leave-active[data-v-4780df54] {\n  animation-name: slide-right-out-data-v-4780df54;\n  animation-duration: 0.3s;\n  animation-timing-function: ease;\n}\n@keyframes page-left-in-data-v-4780df54 {\nfrom {\n    opacity: 0;\n    -ms-transform: translate(-5%, 0%);\n    /* IE 9 */\n    -webkit-transform: translate(-5%, 0%);\n    /* Safari */\n    transform: translate(-5%, 0%);\n}\nto {\n    opacity: 1;\n    -ms-transform: translate(0, 0);\n    /* IE 9 */\n    -webkit-transform: translate(0, 0);\n    /* Safari */\n    transform: translate(0, 0);\n}\n}\n@keyframes page-left-out-data-v-4780df54 {\nfrom {\n    opacity: 1;\n    -ms-transform: translate(0, 0);\n    /* IE 9 */\n    -webkit-transform: translate(0, 0);\n    /* Safari */\n    transform: translate(0, 0);\n}\nto {\n    opacity: 0;\n    -ms-transform: translate(10%, 0%);\n    /* IE 9 */\n    -webkit-transform: translate(10%, 0%);\n    /* Safari */\n    transform: translate(10%, 0%);\n}\n}\n.page-left-enter-active[data-v-4780df54] {\n  animation-name: page-left-in-data-v-4780df54;\n  animation-duration: 0.4s;\n  animation-timing-function: ease;\n}\n.page-left-leave-active[data-v-4780df54] {\n  animation-name: page-left-out-data-v-4780df54;\n  animation-duration: 0.4s;\n  animation-timing-function: ease;\n}\n@keyframes page-right-in-data-v-4780df54 {\nfrom {\n    opacity: 0;\n    -ms-transform: translate(10%, 0%);\n    /* IE 9 */\n    -webkit-transform: translate(10%, 0%);\n    /* Safari */\n    transform: translate(10%, 0%);\n}\nto {\n    opacity: 1;\n    -ms-transform: translate(0, 0);\n    /* IE 9 */\n    -webkit-transform: translate(0, 0);\n    /* Safari */\n    transform: translate(0, 0);\n}\n}\n@keyframes page-right-out-data-v-4780df54 {\nfrom {\n    opacity: 1;\n    -ms-transform: translate(0, 0);\n    /* IE 9 */\n    -webkit-transform: translate(0, 0);\n    /* Safari */\n    transform: translate(0, 0);\n}\nto {\n    opacity: 0;\n    -ms-transform: translate(-5%, 0%);\n    /* IE 9 */\n    -webkit-transform: translate(-5%, 0%);\n    /* Safari */\n    transform: translate(-5%, 0%);\n}\n}\n.page-right-enter-active[data-v-4780df54] {\n  animation-name: page-right-in-data-v-4780df54;\n  animation-duration: 0.3s;\n  animation-timing-function: ease;\n}\n.page-right-leave-active[data-v-4780df54] {\n  animation-name: page-right-out-data-v-4780df54;\n  animation-duration: 0.3s;\n  animation-timing-function: ease;\n}\n@-webkit-keyframes skeleton-animation-data-v-4780df54 {\n0% {\n    opacity: 1.0;\n}\n50% {\n    opacity: 0.2;\n}\n100% {\n    opacity: 1.0;\n}\n}\n@-moz-keyframes skeleton-animation-data-v-4780df54 {\n0% {\n    opacity: 1.0;\n}\n50% {\n    opacity: 0.2;\n}\n100% {\n    opacity: 1.0;\n}\n}\n@-o-keyframes skeleton-animation-data-v-4780df54 {\n0% {\n    opacity: 1.0;\n}\n50% {\n    opacity: 0.2;\n}\n100% {\n    opacity: 1.0;\n}\n}\n@keyframes skeleton-animation-data-v-4780df54 {\n0% {\n    opacity: 1.0;\n}\n50% {\n    opacity: 0.2;\n}\n100% {\n    opacity: 1.0;\n}\n}\n.skeleton[data-v-4780df54] {\n  border-radius: 2px;\n  background: #f2f2f2;\n  -webkit-animation: skeleton-animation-data-v-4780df54 1.8s ease infinite;\n  -moz-animation: skeleton-animation-data-v-4780df54 1.8s ease infinite;\n  -o-animation: skeleton-animation-data-v-4780df54 1.8s ease infinite;\n  animation: skeleton-animation-data-v-4780df54 1.8s ease infinite;\n}\n.collection-types-container[data-v-4780df54] {\n  position: relative;\n}\n.collection-types-container .collection-type[data-v-4780df54] {\n    border-bottom: 1px solid #dbdbdb;\n    padding: 15px 8.3333333%;\n    cursor: pointer;\n}\n.collection-types-container .collection-type[data-v-4780df54]:first-child {\n      margin-top: 15px;\n}\n.collection-types-container .collection-type[data-v-4780df54]:last-child {\n      border-bottom: none;\n}\n.collection-types-container .collection-type[data-v-4780df54]:hover {\n      background-color: #dbdbdb;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/lib/loader.js?!./node_modules/vue-loader/lib/index.js?!./src/admin/components/other/collections-modal.vue?vue&type=style&index=0&id=4780df54&lang=scss&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/lib/loader.js??ref--5-2!./node_modules/vue-loader/lib??vue-loader-options!./src/admin/components/other/collections-modal.vue?vue&type=style&index=0&id=4780df54&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/sass-loader/lib/loader.js??ref--5-2!../../../../node_modules/vue-loader/lib??vue-loader-options!./collections-modal.vue?vue&type=style&index=0&id=4780df54&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/lib/loader.js?!./node_modules/vue-loader/lib/index.js?!./src/admin/components/other/collections-modal.vue?vue&type=style&index=0&id=4780df54&lang=scss&scoped=true&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/admin/components/other/collections-modal.vue?vue&type=template&id=4780df54&scoped=true&":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/admin/components/other/collections-modal.vue?vue&type=template&id=4780df54&scoped=true& ***!
  \***********************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "form",
    {
      ref: "collectionsModal",
      staticClass: "tainacan-modal-content",
      attrs: {
        action: "",
        autofocus: "",
        role: "dialog",
        tabindex: "-1",
        "aria-modal": ""
      }
    },
    [
      _c(
        "div",
        {
          staticClass: "tainacan-modal-content",
          staticStyle: { width: "auto" }
        },
        [
          _c("header", { staticClass: "tainacan-modal-title" }, [
            _c("h2", [_vm._v(_vm._s(this.$i18n.get("collections")))]),
            _vm._v(" "),
            _c("hr")
          ]),
          _vm._v(" "),
          _c(
            "section",
            { staticClass: "tainacan-form" },
            [
              _c("p", [
                _vm._v(
                  _vm._s(
                    _vm.$i18n.get("instruction_select_a_target_collection")
                  )
                )
              ]),
              _vm._v(" "),
              !_vm.isLoading
                ? _c(
                    "div",
                    { staticClass: "collection-types-container" },
                    [
                      _vm._l(_vm.collections, function(collection, index) {
                        return collection &&
                          collection.current_user_can_edit_items
                          ? _c(
                              "div",
                              {
                                key: index,
                                staticClass: "collection-type",
                                on: {
                                  click: function($event) {
                                    return _vm.onSelectCollection(collection)
                                  }
                                }
                              },
                              [
                                _c("h4", [_vm._v(_vm._s(collection.name))]),
                                _vm._v(" "),
                                _c("p", [
                                  _vm._v(
                                    _vm._s(
                                      collection.description.length > 200
                                        ? collection.description.substring(
                                            0,
                                            197
                                          ) + "..."
                                        : collection.description
                                    )
                                  )
                                ])
                              ]
                            )
                          : _vm._e()
                      }),
                      _vm._v(" "),
                      _vm.collections.length <= 0
                        ? _c("div", { staticClass: "block" }, [
                            _c("p", { staticClass: "has-text-gray" }, [
                              _vm._v(
                                "\n                        " +
                                  _vm._s(
                                    _vm.$i18n.get("info_no_collection_created")
                                  ) +
                                  "\n                    "
                              )
                            ])
                          ])
                        : _vm._e()
                    ],
                    2
                  )
                : _vm._e(),
              _vm._v(" "),
              _c("b-loading", {
                attrs: {
                  "is-full-page": false,
                  active: _vm.isLoading,
                  "can-cancel": false
                },
                on: {
                  "update:active": function($event) {
                    _vm.isLoading = $event
                  }
                }
              }),
              _vm._v(" "),
              _c("footer", { staticClass: "field is-grouped form-submit" }, [
                _c("div", { staticClass: "control" }, [
                  _c(
                    "button",
                    {
                      staticClass: "button is-outlined",
                      attrs: { type: "button" },
                      on: {
                        click: function($event) {
                          return _vm.$parent.close()
                        }
                      }
                    },
                    [_vm._v("Close")]
                  )
                ])
              ])
            ],
            1
          )
        ]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./src/admin/components/other/collections-modal.vue":
/*!**********************************************************!*\
  !*** ./src/admin/components/other/collections-modal.vue ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _collections_modal_vue_vue_type_template_id_4780df54_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./collections-modal.vue?vue&type=template&id=4780df54&scoped=true& */ "./src/admin/components/other/collections-modal.vue?vue&type=template&id=4780df54&scoped=true&");
/* harmony import */ var _collections_modal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./collections-modal.vue?vue&type=script&lang=js& */ "./src/admin/components/other/collections-modal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _collections_modal_vue_vue_type_style_index_0_id_4780df54_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./collections-modal.vue?vue&type=style&index=0&id=4780df54&lang=scss&scoped=true& */ "./src/admin/components/other/collections-modal.vue?vue&type=style&index=0&id=4780df54&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _collections_modal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _collections_modal_vue_vue_type_template_id_4780df54_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _collections_modal_vue_vue_type_template_id_4780df54_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "4780df54",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/admin/components/other/collections-modal.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./src/admin/components/other/collections-modal.vue?vue&type=script&lang=js&":
/*!***********************************************************************************!*\
  !*** ./src/admin/components/other/collections-modal.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_modal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib!../../../../node_modules/vue-loader/lib??vue-loader-options!./collections-modal.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js?!./src/admin/components/other/collections-modal.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_modal_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./src/admin/components/other/collections-modal.vue?vue&type=style&index=0&id=4780df54&lang=scss&scoped=true&":
/*!********************************************************************************************************************!*\
  !*** ./src/admin/components/other/collections-modal.vue?vue&type=style&index=0&id=4780df54&lang=scss&scoped=true& ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_lib_loader_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_modal_vue_vue_type_style_index_0_id_4780df54_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/sass-loader/lib/loader.js??ref--5-2!../../../../node_modules/vue-loader/lib??vue-loader-options!./collections-modal.vue?vue&type=style&index=0&id=4780df54&lang=scss&scoped=true& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sass-loader/lib/loader.js?!./node_modules/vue-loader/lib/index.js?!./src/admin/components/other/collections-modal.vue?vue&type=style&index=0&id=4780df54&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_lib_loader_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_modal_vue_vue_type_style_index_0_id_4780df54_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_lib_loader_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_modal_vue_vue_type_style_index_0_id_4780df54_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_lib_loader_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_modal_vue_vue_type_style_index_0_id_4780df54_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_lib_loader_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_modal_vue_vue_type_style_index_0_id_4780df54_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_lib_loader_js_ref_5_2_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_modal_vue_vue_type_style_index_0_id_4780df54_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./src/admin/components/other/collections-modal.vue?vue&type=template&id=4780df54&scoped=true&":
/*!*****************************************************************************************************!*\
  !*** ./src/admin/components/other/collections-modal.vue?vue&type=template&id=4780df54&scoped=true& ***!
  \*****************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_modal_vue_vue_type_template_id_4780df54_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./collections-modal.vue?vue&type=template&id=4780df54&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./src/admin/components/other/collections-modal.vue?vue&type=template&id=4780df54&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_modal_vue_vue_type_template_id_4780df54_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_collections_modal_vue_vue_type_template_id_4780df54_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);