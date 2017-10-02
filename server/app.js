"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const compression = require("compression");
const logDirectory = process.cwd() + '/log';
/**
 * 应用环境初始化
 */
exports.app = express();
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
