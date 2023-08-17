(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!*********************************************************************!*\
  !*** ./_includes/components/tailscript-navbar/tailscript-navbar.ts ***!
  \*********************************************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AladorNavbar = void 0;
class AladorNavbar {
}
exports.AladorNavbar = AladorNavbar;

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});