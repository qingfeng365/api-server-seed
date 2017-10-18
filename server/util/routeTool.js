"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logTool_1 = require("./logTool");
exports.routeTool = {
    logReq: function (req, res, next) {
        logTool_1.log.info('%s %s :\r\n req.body: \r\n %j \r\n\r\n req.params: \r\n %j \r\n\r\n req.query: \r\n %j \r\n', req.method, req.originalUrl, req.body, req.params, req.query);
        logTool_1.log.info('req.headers:\r\n %j \r\n', req.headers);
        next();
    }
};
