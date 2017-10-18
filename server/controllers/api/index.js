"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = {};
exports.controller.index = function (req, res, next) {
    res.json({ info: '/api 根路由不可以直接使用,要指定下级路由...' });
};
exports.controller.registerPath = function (router) {
    router.addPathGetHanlder('/', exports.controller.index);
};
