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
exports.id = "app/api/auth/login/route";
exports.ids = ["app/api/auth/login/route"];
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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_user_aviation_crew_swap_app_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/login/route.ts */ \"(rsc)/./app/api/auth/login/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/login/route\",\n        pathname: \"/api/auth/login\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/login/route\"\n    },\n    resolvedPagePath: \"/home/user/aviation-crew-swap/app/app/api/auth/login/route.ts\",\n    nextConfigOutput,\n    userland: _home_user_aviation_crew_swap_app_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/login/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbG9naW4lMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGdXNlciUyRmF2aWF0aW9uLWNyZXctc3dhcCUyRmFwcCUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGaG9tZSUyRnVzZXIlMkZhdmlhdGlvbi1jcmV3LXN3YXAlMkZhcHAmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ2E7QUFDMUY7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hcHAvPzk1NGYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL2hvbWUvdXNlci9hdmlhdGlvbi1jcmV3LXN3YXAvYXBwL2FwcC9hcGkvYXV0aC9sb2dpbi9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9sb2dpbi9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvbG9naW5cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2F1dGgvbG9naW4vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvaG9tZS91c2VyL2F2aWF0aW9uLWNyZXctc3dhcC9hcHAvYXBwL2FwaS9hdXRoL2xvZ2luL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hdXRoL2xvZ2luL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/login/route.ts":
/*!*************************************!*\
  !*** ./app/api/auth/login/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\nconst dynamic = \"force-dynamic\";\n\n\n\n\nasync function POST(request) {\n    try {\n        const { email, password } = await request.json();\n        if (!email || !password) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Email and password are required\"\n            }, {\n                status: 400\n            });\n        }\n        // Find user\n        const user = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.user.findUnique({\n            where: {\n                email\n            }\n        });\n        if (!user) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Invalid email or password\"\n            }, {\n                status: 401\n            });\n        }\n        // Verify password\n        const isValidPassword = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.verifyPassword)(password, user.password);\n        if (!isValidPassword) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Invalid email or password\"\n            }, {\n                status: 401\n            });\n        }\n        // Generate token and set cookie\n        const token = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.generateToken)({\n            userId: user.id\n        });\n        const cookieStore = (0,next_headers__WEBPACK_IMPORTED_MODULE_3__.cookies)();\n        cookieStore.set(\"auth-token\", token, {\n            httpOnly: true,\n            secure: \"development\" === \"production\",\n            sameSite: \"strict\",\n            maxAge: 7 * 24 * 60 * 60\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Login successful\",\n            user: {\n                id: user.id,\n                name: user.name,\n                email: user.email,\n                role: user.role\n            }\n        });\n    } catch (error) {\n        console.error(\"Login error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvbG9naW4vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ08sTUFBTUEsVUFBVSxnQkFBZ0I7QUFFaUI7QUFDdEI7QUFDeUI7QUFDcEI7QUFFaEMsZUFBZU0sS0FBS0MsT0FBb0I7SUFDN0MsSUFBSTtRQUNGLE1BQU0sRUFBRUMsS0FBSyxFQUFFQyxRQUFRLEVBQUUsR0FBRyxNQUFNRixRQUFRRyxJQUFJO1FBRTlDLElBQUksQ0FBQ0YsU0FBUyxDQUFDQyxVQUFVO1lBQ3ZCLE9BQU9SLHFEQUFZQSxDQUFDUyxJQUFJLENBQ3RCO2dCQUFFQyxPQUFPO1lBQWtDLEdBQzNDO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSxZQUFZO1FBQ1osTUFBTUMsT0FBTyxNQUFNWCwyQ0FBTUEsQ0FBQ1csSUFBSSxDQUFDQyxVQUFVLENBQUM7WUFDeENDLE9BQU87Z0JBQUVQO1lBQU07UUFDakI7UUFFQSxJQUFJLENBQUNLLE1BQU07WUFDVCxPQUFPWixxREFBWUEsQ0FBQ1MsSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztZQUE0QixHQUNyQztnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsa0JBQWtCO1FBQ2xCLE1BQU1JLGtCQUFrQixNQUFNYix5REFBY0EsQ0FBQ00sVUFBVUksS0FBS0osUUFBUTtRQUNwRSxJQUFJLENBQUNPLGlCQUFpQjtZQUNwQixPQUFPZixxREFBWUEsQ0FBQ1MsSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztZQUE0QixHQUNyQztnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsZ0NBQWdDO1FBQ2hDLE1BQU1LLFFBQVFiLHdEQUFhQSxDQUFDO1lBQUVjLFFBQVFMLEtBQUtNLEVBQUU7UUFBQztRQUM5QyxNQUFNQyxjQUFjZixxREFBT0E7UUFDM0JlLFlBQVlDLEdBQUcsQ0FBQyxjQUFjSixPQUFPO1lBQ25DSyxVQUFVO1lBQ1ZDLFFBQVFDLGtCQUF5QjtZQUNqQ0MsVUFBVTtZQUNWQyxRQUFRLElBQUksS0FBSyxLQUFLO1FBQ3hCO1FBRUEsT0FBT3pCLHFEQUFZQSxDQUFDUyxJQUFJLENBQUM7WUFDdkJpQixTQUFTO1lBQ1RkLE1BQU07Z0JBQ0pNLElBQUlOLEtBQUtNLEVBQUU7Z0JBQ1hTLE1BQU1mLEtBQUtlLElBQUk7Z0JBQ2ZwQixPQUFPSyxLQUFLTCxLQUFLO2dCQUNqQnFCLE1BQU1oQixLQUFLZ0IsSUFBSTtZQUNqQjtRQUNGO0lBQ0YsRUFBRSxPQUFPbEIsT0FBTztRQUNkbUIsUUFBUW5CLEtBQUssQ0FBQyxnQkFBZ0JBO1FBQzlCLE9BQU9WLHFEQUFZQSxDQUFDUyxJQUFJLENBQ3RCO1lBQUVDLE9BQU87UUFBd0IsR0FDakM7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hcHAvLi9hcHAvYXBpL2F1dGgvbG9naW4vcm91dGUudHM/NGYyNCJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBjb25zdCBkeW5hbWljID0gXCJmb3JjZS1keW5hbWljXCI7XG5cbmltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICdAL2xpYi9kYic7XG5pbXBvcnQgeyB2ZXJpZnlQYXNzd29yZCwgZ2VuZXJhdGVUb2tlbiB9IGZyb20gJ0AvbGliL2F1dGgnO1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gJ25leHQvaGVhZGVycyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQgfSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xuXG4gICAgaWYgKCFlbWFpbCB8fCAhcGFzc3dvcmQpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogJ0VtYWlsIGFuZCBwYXNzd29yZCBhcmUgcmVxdWlyZWQnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIHVzZXJcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XG4gICAgICB3aGVyZTogeyBlbWFpbCB9XG4gICAgfSk7XG5cbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogJ0ludmFsaWQgZW1haWwgb3IgcGFzc3dvcmQnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDEgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBWZXJpZnkgcGFzc3dvcmRcbiAgICBjb25zdCBpc1ZhbGlkUGFzc3dvcmQgPSBhd2FpdCB2ZXJpZnlQYXNzd29yZChwYXNzd29yZCwgdXNlci5wYXNzd29yZCk7XG4gICAgaWYgKCFpc1ZhbGlkUGFzc3dvcmQpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogJ0ludmFsaWQgZW1haWwgb3IgcGFzc3dvcmQnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDEgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBHZW5lcmF0ZSB0b2tlbiBhbmQgc2V0IGNvb2tpZVxuICAgIGNvbnN0IHRva2VuID0gZ2VuZXJhdGVUb2tlbih7IHVzZXJJZDogdXNlci5pZCB9KTtcbiAgICBjb25zdCBjb29raWVTdG9yZSA9IGNvb2tpZXMoKTtcbiAgICBjb29raWVTdG9yZS5zZXQoJ2F1dGgtdG9rZW4nLCB0b2tlbiwge1xuICAgICAgaHR0cE9ubHk6IHRydWUsXG4gICAgICBzZWN1cmU6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicsXG4gICAgICBzYW1lU2l0ZTogJ3N0cmljdCcsXG4gICAgICBtYXhBZ2U6IDcgKiAyNCAqIDYwICogNjAsIC8vIDcgZGF5c1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgIG1lc3NhZ2U6ICdMb2dpbiBzdWNjZXNzZnVsJyxcbiAgICAgIHVzZXI6IHtcbiAgICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICAgIG5hbWU6IHVzZXIubmFtZSxcbiAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgIHJvbGU6IHVzZXIucm9sZSxcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdMb2dpbiBlcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogJ0ludGVybmFsIHNlcnZlciBlcnJvcicgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJkeW5hbWljIiwiTmV4dFJlc3BvbnNlIiwicHJpc21hIiwidmVyaWZ5UGFzc3dvcmQiLCJnZW5lcmF0ZVRva2VuIiwiY29va2llcyIsIlBPU1QiLCJyZXF1ZXN0IiwiZW1haWwiLCJwYXNzd29yZCIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsInVzZXIiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJpc1ZhbGlkUGFzc3dvcmQiLCJ0b2tlbiIsInVzZXJJZCIsImlkIiwiY29va2llU3RvcmUiLCJzZXQiLCJodHRwT25seSIsInNlY3VyZSIsInByb2Nlc3MiLCJzYW1lU2l0ZSIsIm1heEFnZSIsIm1lc3NhZ2UiLCJuYW1lIiwicm9sZSIsImNvbnNvbGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/login/route.ts\n");

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
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/semver","vendor-chunks/bcryptjs","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/lodash.isplainobject","vendor-chunks/ms","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fuser%2Faviation-crew-swap%2Fapp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();