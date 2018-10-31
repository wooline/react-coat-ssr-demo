exports.ids = [1];
exports.modules = {

/***/ 67:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(5);

// EXTERNAL MODULE: ./node_modules/react-coat-pkg/dist/index.js
var dist = __webpack_require__(2);

// CONCATENATED MODULE: ./src/modules/videos/api.ts


class API {
    getPhotoList(filter) {
        return Promise.resolve({
            list: [
                {
                    title: "环太平洋",
                    commentCount: 500,
                    imageCount: 10,
                    coverUrl: "http://103.90.137.51:8020/images/20180914203359610.PNG",
                    createTimeDesc: "1天前",
                    clickCount: 500,
                },
                {
                    title: "环太平洋",
                    commentCount: 120,
                    imageCount: 5,
                    coverUrl: "http://103.90.137.51:8020/images/20180914203359610.PNG",
                    createTimeDesc: "1个月前",
                    clickCount: 256,
                },
            ],
        });
    }
}
tslib_es6["a" /* __decorate */]([
    Object(dist["delayPromise"])(3)
], API.prototype, "getPhotoList", null);
/* harmony default export */ var api = (new API());

// CONCATENATED MODULE: ./src/modules/videos/exportNames.ts
const NAMESPACE = "videos";

// CONCATENATED MODULE: ./src/modules/videos/model.ts

var _a;



// 定义本模块的Handlers
class model_ModuleHandlers extends dist["BaseModuleHandlers"] {
    constructor() {
        // 定义本模块State的初始值
        const initState = {
            tableList: null,
            curItem: null,
            loading: null,
        };
        super(initState);
    }
    putCurItem(curItem) {
        return Object.assign({}, this.state, { curItem });
    }
    putTableList(tableList) {
        return Object.assign({}, this.state, { tableList });
    }
    async getTableList(filter) {
        const tableList = await api.getPhotoList(filter);
        this.dispatch(this.callThisAction(this.putTableList, tableList));
    }
    async [_a = NAMESPACE + "/INIT"]() {
        await this.dispatch(this.callThisAction(this.getTableList, null));
    }
}
tslib_es6["a" /* __decorate */]([
    dist["reducer"]
], model_ModuleHandlers.prototype, "putCurItem", null);
tslib_es6["a" /* __decorate */]([
    dist["reducer"]
], model_ModuleHandlers.prototype, "putTableList", null);
tslib_es6["a" /* __decorate */]([
    dist["globalLoading"],
    dist["effect"]
], model_ModuleHandlers.prototype, "getTableList", null);
tslib_es6["a" /* __decorate */]([
    dist["globalLoading"] // 使用全局loading状态
    ,
    dist["effect"]
], model_ModuleHandlers.prototype, _a, null);
/* harmony default export */ var model = __webpack_exports__["default"] = (Object(dist["exportModel"])(NAMESPACE, model_ModuleHandlers));


/***/ })

};;