"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/notifications/route";
exports.ids = ["app/api/notifications/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fnotifications%2Froute&page=%2Fapi%2Fnotifications%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnotifications%2Froute.ts&appDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fnotifications%2Froute&page=%2Fapi%2Fnotifications%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnotifications%2Froute.ts&appDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_user_aviation_crew_swap_app_app_api_notifications_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/notifications/route.ts */ \"(rsc)/./app/api/notifications/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/notifications/route\",\n        pathname: \"/api/notifications\",\n        filename: \"route\",\n        bundlePath: \"app/api/notifications/route\"\n    },\n    resolvedPagePath: \"/home/user/aviation-crew-swap/app/app/api/notifications/route.ts\",\n    nextConfigOutput,\n    userland: _home_user_aviation_crew_swap_app_app_api_notifications_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/notifications/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZub3RpZmljYXRpb25zJTJGcm91dGUmcGFnZT0lMkZhcGklMkZub3RpZmljYXRpb25zJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGbm90aWZpY2F0aW9ucyUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGdXNlciUyRmF2aWF0aW9uLWNyZXctc3dhcCUyRmFwcCUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGaG9tZSUyRnVzZXIlMkZhdmlhdGlvbi1jcmV3LXN3YXAlMkZhcHAmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ2dCO0FBQzdGO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXBwLz85OGMxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9ob21lL3VzZXIvYXZpYXRpb24tY3Jldy1zd2FwL2FwcC9hcHAvYXBpL25vdGlmaWNhdGlvbnMvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL25vdGlmaWNhdGlvbnMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9ub3RpZmljYXRpb25zXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9ub3RpZmljYXRpb25zL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL2hvbWUvdXNlci9hdmlhdGlvbi1jcmV3LXN3YXAvYXBwL2FwcC9hcGkvbm90aWZpY2F0aW9ucy9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvbm90aWZpY2F0aW9ucy9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fnotifications%2Froute&page=%2Fapi%2Fnotifications%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnotifications%2Froute.ts&appDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/notifications/route.ts":
/*!****************************************!*\
  !*** ./app/api/notifications/route.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\nconst dynamic = \"force-dynamic\";\n\n\n\nasync function GET() {\n    try {\n        const user = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.requireAuth)();\n        const notifications = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.notification.findMany({\n            where: {\n                userId: user.id\n            },\n            orderBy: {\n                createdAt: \"desc\"\n            },\n            take: 50 // Limit to last 50 notifications\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            notifications\n        });\n    } catch (error) {\n        console.error(\"Fetch notifications error:\", error);\n        if (error instanceof Error && error.message === \"Authentication required\") {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Authentication required\"\n            }, {\n                status: 401\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL25vdGlmaWNhdGlvbnMvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDTyxNQUFNQSxVQUFVLGdCQUFnQjtBQUVJO0FBQ1Q7QUFDTztBQUVsQyxlQUFlSTtJQUNwQixJQUFJO1FBQ0YsTUFBTUMsT0FBTyxNQUFNRixzREFBV0E7UUFFOUIsTUFBTUcsZ0JBQWdCLE1BQU1KLDJDQUFNQSxDQUFDSyxZQUFZLENBQUNDLFFBQVEsQ0FBQztZQUN2REMsT0FBTztnQkFBRUMsUUFBUUwsS0FBS00sRUFBRTtZQUFDO1lBQ3pCQyxTQUFTO2dCQUFFQyxXQUFXO1lBQU87WUFDN0JDLE1BQU0sR0FBRyxpQ0FBaUM7UUFDNUM7UUFFQSxPQUFPYixxREFBWUEsQ0FBQ2MsSUFBSSxDQUFDO1lBQUVUO1FBQWM7SUFDM0MsRUFBRSxPQUFPVSxPQUFPO1FBQ2RDLFFBQVFELEtBQUssQ0FBQyw4QkFBOEJBO1FBQzVDLElBQUlBLGlCQUFpQkUsU0FBU0YsTUFBTUcsT0FBTyxLQUFLLDJCQUEyQjtZQUN6RSxPQUFPbEIscURBQVlBLENBQUNjLElBQUksQ0FDdEI7Z0JBQUVDLE9BQU87WUFBMEIsR0FDbkM7Z0JBQUVJLFFBQVE7WUFBSTtRQUVsQjtRQUNBLE9BQU9uQixxREFBWUEsQ0FBQ2MsSUFBSSxDQUN0QjtZQUFFQyxPQUFPO1FBQXdCLEdBQ2pDO1lBQUVJLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXBwLy4vYXBwL2FwaS9ub3RpZmljYXRpb25zL3JvdXRlLnRzPzhlMGMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgY29uc3QgZHluYW1pYyA9IFwiZm9yY2UtZHluYW1pY1wiO1xuXG5pbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICdAL2xpYi9kYic7XG5pbXBvcnQgeyByZXF1aXJlQXV0aCB9IGZyb20gJ0AvbGliL2F1dGgnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKCkge1xuICB0cnkge1xuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCByZXF1aXJlQXV0aCgpO1xuXG4gICAgY29uc3Qgbm90aWZpY2F0aW9ucyA9IGF3YWl0IHByaXNtYS5ub3RpZmljYXRpb24uZmluZE1hbnkoe1xuICAgICAgd2hlcmU6IHsgdXNlcklkOiB1c2VyLmlkIH0sXG4gICAgICBvcmRlckJ5OiB7IGNyZWF0ZWRBdDogJ2Rlc2MnIH0sXG4gICAgICB0YWtlOiA1MCAvLyBMaW1pdCB0byBsYXN0IDUwIG5vdGlmaWNhdGlvbnNcbiAgICB9KTtcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG5vdGlmaWNhdGlvbnMgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRmV0Y2ggbm90aWZpY2F0aW9ucyBlcnJvcjonLCBlcnJvcik7XG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgZXJyb3IubWVzc2FnZSA9PT0gJ0F1dGhlbnRpY2F0aW9uIHJlcXVpcmVkJykge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IGVycm9yOiAnQXV0aGVudGljYXRpb24gcmVxdWlyZWQnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDEgfVxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogJ0ludGVybmFsIHNlcnZlciBlcnJvcicgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJkeW5hbWljIiwiTmV4dFJlc3BvbnNlIiwicHJpc21hIiwicmVxdWlyZUF1dGgiLCJHRVQiLCJ1c2VyIiwibm90aWZpY2F0aW9ucyIsIm5vdGlmaWNhdGlvbiIsImZpbmRNYW55Iiwid2hlcmUiLCJ1c2VySWQiLCJpZCIsIm9yZGVyQnkiLCJjcmVhdGVkQXQiLCJ0YWtlIiwianNvbiIsImVycm9yIiwiY29uc29sZSIsIkVycm9yIiwibWVzc2FnZSIsInN0YXR1cyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/notifications/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   generateToken: () => (/* binding */ generateToken),\n/* harmony export */   getCurrentUser: () => (/* binding */ getCurrentUser),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   requireAuth: () => (/* binding */ requireAuth),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword),\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken)\n/* harmony export */ });\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./db */ \"(rsc)/./lib/db.ts\");\n\n\n\n\nconst JWT_SECRET = process.env.JWT_SECRET || \"aviation-crew-swap-secret-key\";\nasync function hashPassword(password) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().hash(password, 12);\n}\nasync function verifyPassword(password, hashedPassword) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().compare(password, hashedPassword);\n}\nfunction generateToken(payload) {\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().sign(payload, JWT_SECRET, {\n        expiresIn: \"7d\"\n    });\n}\nfunction verifyToken(token) {\n    try {\n        return jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().verify(token, JWT_SECRET);\n    } catch  {\n        return null;\n    }\n}\nasync function getCurrentUser() {\n    try {\n        const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_2__.cookies)();\n        const token = cookieStore.get(\"auth-token\")?.value;\n        if (!token) return null;\n        const decoded = verifyToken(token);\n        if (!decoded) return null;\n        const user = await _db__WEBPACK_IMPORTED_MODULE_3__.prisma.user.findUnique({\n            where: {\n                id: decoded.userId\n            },\n            select: {\n                id: true,\n                email: true,\n                name: true,\n                role: true\n            }\n        });\n        return user;\n    } catch  {\n        return null;\n    }\n}\nasync function requireAuth() {\n    const user = await getCurrentUser();\n    if (!user) {\n        throw new Error(\"Authentication required\");\n    }\n    return user;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDOEI7QUFDQztBQUNRO0FBQ1Q7QUFFOUIsTUFBTUksYUFBYUMsUUFBUUMsR0FBRyxDQUFDRixVQUFVLElBQUk7QUFTdEMsZUFBZUcsYUFBYUMsUUFBZ0I7SUFDakQsT0FBT1Isb0RBQVcsQ0FBQ1EsVUFBVTtBQUMvQjtBQUVPLGVBQWVFLGVBQWVGLFFBQWdCLEVBQUVHLGNBQXNCO0lBQzNFLE9BQU9YLHVEQUFjLENBQUNRLFVBQVVHO0FBQ2xDO0FBRU8sU0FBU0UsY0FBY0MsT0FBWTtJQUN4QyxPQUFPYix3REFBUSxDQUFDYSxTQUFTVixZQUFZO1FBQUVZLFdBQVc7SUFBSztBQUN6RDtBQUVPLFNBQVNDLFlBQVlDLEtBQWE7SUFDdkMsSUFBSTtRQUNGLE9BQU9qQiwwREFBVSxDQUFDaUIsT0FBT2Q7SUFDM0IsRUFBRSxPQUFNO1FBQ04sT0FBTztJQUNUO0FBQ0Y7QUFFTyxlQUFlZ0I7SUFDcEIsSUFBSTtRQUNGLE1BQU1DLGNBQWNuQixxREFBT0E7UUFDM0IsTUFBTWdCLFFBQVFHLFlBQVlDLEdBQUcsQ0FBQyxlQUFlQztRQUU3QyxJQUFJLENBQUNMLE9BQU8sT0FBTztRQUVuQixNQUFNTSxVQUFVUCxZQUFZQztRQUM1QixJQUFJLENBQUNNLFNBQVMsT0FBTztRQUVyQixNQUFNQyxPQUFPLE1BQU10Qix1Q0FBTUEsQ0FBQ3NCLElBQUksQ0FBQ0MsVUFBVSxDQUFDO1lBQ3hDQyxPQUFPO2dCQUFFQyxJQUFJSixRQUFRSyxNQUFNO1lBQUM7WUFDNUJDLFFBQVE7Z0JBQUVGLElBQUk7Z0JBQU1HLE9BQU87Z0JBQU1DLE1BQU07Z0JBQU1DLE1BQU07WUFBSztRQUMxRDtRQUVBLE9BQU9SO0lBQ1QsRUFBRSxPQUFNO1FBQ04sT0FBTztJQUNUO0FBQ0Y7QUFFTyxlQUFlUztJQUNwQixNQUFNVCxPQUFPLE1BQU1MO0lBQ25CLElBQUksQ0FBQ0ssTUFBTTtRQUNULE1BQU0sSUFBSVUsTUFBTTtJQUNsQjtJQUNBLE9BQU9WO0FBQ1QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hcHAvLi9saWIvYXV0aC50cz9iZjdlIl0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHRqcyc7XG5pbXBvcnQgand0IGZyb20gJ2pzb253ZWJ0b2tlbic7XG5pbXBvcnQgeyBjb29raWVzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJztcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJy4vZGInO1xuXG5jb25zdCBKV1RfU0VDUkVUID0gcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCB8fCAnYXZpYXRpb24tY3Jldy1zd2FwLXNlY3JldC1rZXknO1xuXG5leHBvcnQgaW50ZXJmYWNlIEF1dGhVc2VyIHtcbiAgaWQ6IHN0cmluZztcbiAgZW1haWw6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICByb2xlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYXNoUGFzc3dvcmQocGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gIHJldHVybiBiY3J5cHQuaGFzaChwYXNzd29yZCwgMTIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmVyaWZ5UGFzc3dvcmQocGFzc3dvcmQ6IHN0cmluZywgaGFzaGVkUGFzc3dvcmQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gYmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIGhhc2hlZFBhc3N3b3JkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlVG9rZW4ocGF5bG9hZDogYW55KTogc3RyaW5nIHtcbiAgcmV0dXJuIGp3dC5zaWduKHBheWxvYWQsIEpXVF9TRUNSRVQsIHsgZXhwaXJlc0luOiAnN2QnIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5VG9rZW4odG9rZW46IHN0cmluZyk6IGFueSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGp3dC52ZXJpZnkodG9rZW4sIEpXVF9TRUNSRVQpO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q3VycmVudFVzZXIoKTogUHJvbWlzZTxBdXRoVXNlciB8IG51bGw+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjb29raWVTdG9yZSA9IGNvb2tpZXMoKTtcbiAgICBjb25zdCB0b2tlbiA9IGNvb2tpZVN0b3JlLmdldCgnYXV0aC10b2tlbicpPy52YWx1ZTtcbiAgICBcbiAgICBpZiAoIXRva2VuKSByZXR1cm4gbnVsbDtcbiAgICBcbiAgICBjb25zdCBkZWNvZGVkID0gdmVyaWZ5VG9rZW4odG9rZW4pO1xuICAgIGlmICghZGVjb2RlZCkgcmV0dXJuIG51bGw7XG4gICAgXG4gICAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoe1xuICAgICAgd2hlcmU6IHsgaWQ6IGRlY29kZWQudXNlcklkIH0sXG4gICAgICBzZWxlY3Q6IHsgaWQ6IHRydWUsIGVtYWlsOiB0cnVlLCBuYW1lOiB0cnVlLCByb2xlOiB0cnVlIH1cbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gdXNlcjtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmVBdXRoKCk6IFByb21pc2U8QXV0aFVzZXI+IHtcbiAgY29uc3QgdXNlciA9IGF3YWl0IGdldEN1cnJlbnRVc2VyKCk7XG4gIGlmICghdXNlcikge1xuICAgIHRocm93IG5ldyBFcnJvcignQXV0aGVudGljYXRpb24gcmVxdWlyZWQnKTtcbiAgfVxuICByZXR1cm4gdXNlcjtcbn1cbiJdLCJuYW1lcyI6WyJiY3J5cHQiLCJqd3QiLCJjb29raWVzIiwicHJpc21hIiwiSldUX1NFQ1JFVCIsInByb2Nlc3MiLCJlbnYiLCJoYXNoUGFzc3dvcmQiLCJwYXNzd29yZCIsImhhc2giLCJ2ZXJpZnlQYXNzd29yZCIsImhhc2hlZFBhc3N3b3JkIiwiY29tcGFyZSIsImdlbmVyYXRlVG9rZW4iLCJwYXlsb2FkIiwic2lnbiIsImV4cGlyZXNJbiIsInZlcmlmeVRva2VuIiwidG9rZW4iLCJ2ZXJpZnkiLCJnZXRDdXJyZW50VXNlciIsImNvb2tpZVN0b3JlIiwiZ2V0IiwidmFsdWUiLCJkZWNvZGVkIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlkIiwidXNlcklkIiwic2VsZWN0IiwiZW1haWwiLCJuYW1lIiwicm9sZSIsInJlcXVpcmVBdXRoIiwiRXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTZDO0FBRTdDLE1BQU1DLGtCQUFrQkM7QUFJakIsTUFBTUMsU0FBU0YsZ0JBQWdCRSxNQUFNLElBQUksSUFBSUgsd0RBQVlBLEdBQUU7QUFFbEUsSUFBSUksSUFBeUIsRUFBY0gsZ0JBQWdCRSxNQUFNLEdBQUdBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXBwLy4vbGliL2RiLnRzPzFkZjAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXG5cbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXMgYXMgdW5rbm93biBhcyB7XG4gIHByaXNtYTogUHJpc21hQ2xpZW50IHwgdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/IG5ldyBQcmlzbWFDbGllbnQoKVxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYVxuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbFRoaXMiLCJwcmlzbWEiLCJwcm9jZXNzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/semver","vendor-chunks/bcryptjs","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/lodash.isplainobject","vendor-chunks/ms","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fnotifications%2Froute&page=%2Fapi%2Fnotifications%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fnotifications%2Froute.ts&appDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();