"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const express = require("express");
const expressRouterHelper_1 = require("./util/expressRouterHelper");
function loadControllers(subPath) {
    const router = expressRouterHelper_1.expressRouterHelper(express.Router());
    const controllerPath = path.join(__dirname, 'controllers', subPath);
    fs
        .readdirSync(controllerPath)
        .filter(function (file) {
        return (file.indexOf('.js') > 0);
    })
        .forEach(function (file) {
        let controller = require(path.join(controllerPath, file)).controller;
        if ('registerPath' in controller) {
            controller.registerPath(router);
        }
    });
    return router;
}
let fn = function (app) {
    app.use('*', function (req, res, next) {
        res.locals.env = app.get('env');
        next();
    });
    /**
     * 应用程序后台路由
     */
    app.use('/api', loadControllers('api'));
    app.use('/validimgcode', loadControllers('validimgcode'));
    /**
     * 应用程序首页路由 (如果有静态首頁,要改为指向静态首页)
     */
    app.use('/', (req, res, next) => {
        res.json({ info: 'api server' });
    });
};
exports.routes = fn;
