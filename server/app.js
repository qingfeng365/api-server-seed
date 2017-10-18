"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const fs = require("fs");
const compression = require("compression");
const favicon = require("serve-favicon");
const logger = require("morgan");
const FileStreamRotator = require("file-stream-rotator");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
/**
 * 配置
 */
const config_1 = require("./config/config");
const logDirectory = process.cwd() + '/log';
/**
 * 路由日志初始化
 */
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var logStream = FileStreamRotator.getStream({
    filename: logDirectory + '/route_%DATE%.log',
    verbose: false,
    frequency: '60m'
});
/**
 * resource 目录
 */
const dirutil_1 = require("./util/dirutil");
dirutil_1.dirutil.mkdirsSync(path.join(process.cwd(), '/resource'));
dirutil_1.dirutil.mkdirsSync(path.join(process.cwd(), '/resource_dev'));
/**
 * session 管理
 */
const session = require("express-session");
const connectMongo = require("connect-mongo");
var MongoStore = connectMongo(session);
/**
 * mongoose 启动
 */
const mongoose = require("mongoose");
mongoose.connect(config_1.config.mongodbUrl);
/**
 * 应用环境初始化
 */
exports.app = express();
/**
 * api server 不再设置 views view engine
 */
/**
 * 启用gzip压缩
 */
exports.app.use(compression({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return true;
    }
}));
/**
 * 通用路由中间件
 */
exports.app.use(session({
    name: 'api.Server.Session',
    secret: 'api.Server.Key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3 * 24 * 60 * 60 * 1000
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
    })
}));
if (exports.app.get('env') === 'development') {
    exports.app.use(logger('dev'));
}
else {
    exports.app.use(logger('[:date[iso]] :method :url :status :res[content-length] (:res[content-type]) - :response-time ms (:remote-addr) ', {
        stream: logStream
    }));
}
exports.app.use(bodyParser.json());
exports.app.use(bodyParser.urlencoded({
    extended: true
}));
exports.app.use(cookieParser());
/**
 * 静态路由管理
 */
exports.app.use(favicon(path.join(process.cwd(), '/public/favicon.ico')));
exports.app.use('/node_modules', express.static(path.join(process.cwd(), '/node_modules')));
exports.app.use('/public', express.static(path.join(process.cwd(), '/public')));
/**
 * 路由请求头日志
 */
const routeTool_1 = require("./util/routeTool");
exports.app.use(routeTool_1.routeTool.logReq);
/**
 * 常规路由处理
 */
const routes_1 = require("./routes");
routes_1.routes(exports.app);
/**
 * 错误处理路由-404
 */
exports.app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
/**
 * 错误处理路由-开发状态-error stacktrace
 */
if (exports.app.get('env') === 'development') {
    exports.app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            error: err.message || err,
            syserror: err
        });
    });
}
/**
 * 错误处理路由-生产状态-no error stacktrace
 */
exports.app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: err.message || err,
    });
});
