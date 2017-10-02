
import * as express from "express";
import * as path from "path";
import * as fs from "fs";
import * as compression from "compression";

const logDirectory = process.cwd() + '/log';

/**
 * 应用环境初始化
 */
export const app = express();

/**
 * 启用gzip压缩
 */
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return true;
  }
}));



