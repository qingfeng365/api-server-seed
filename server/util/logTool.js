"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileStreamRotator = require("file-stream-rotator");
const fs = require("fs");
const config_1 = require("../config/config");
const tracer = require("tracer");
;
/**
 *
 * log.log        0     调试，要丢弃 **
 * log.trace      1
 * log.debug      2     调试，要保留
 * log.info       3     重要信息，要保留 **
 * log.warn       4     不重要的非法信息（一般不用）
 * log.error      5     错误，要保留 **
 */
const logDirectory = process.cwd() + '/log';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const logStream = FileStreamRotator.getStream({
    filename: logDirectory + '/log_%DATE%.log',
    verbose: false,
    frequency: '60m'
});
let level = 2;
if (config_1.config.loglevel >= 0) {
    level = config_1.config.loglevel;
}
const logger = tracer.console({
    transport: function (data) {
        console.log(data.output);
        logStream.write(data.output + '\n');
    },
    level: level
});
logger.logJsonToError = function (jsonobj, title) {
    if (title) {
        logger.error('%s:\r\n %j', title, jsonobj);
    }
    else {
        logger.error('%j', jsonobj);
    }
    return jsonobj;
};
logger.logJsonToInfo = function (jsonobj, title) {
    if (title) {
        logger.info('%s:\r\n %j', title, jsonobj);
    }
    else {
        logger.info('%j', jsonobj);
    }
    return jsonobj;
};
logger.logJsonToDebug = function (jsonobj, title) {
    if (title) {
        logger.debug('%s:\r\n %j', title, jsonobj);
    }
    else {
        logger.debug('%j', jsonobj);
    }
    return jsonobj;
};
exports.log = logger;
