"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const async = require("async");
const glob = require("glob");
const moment = require("moment");
const schedule = require("node-schedule");
const logTool_1 = require("./logTool");
const config_1 = require("../config/config");
function readFileNameToList(pattern, keepdays, cb) {
    var filelist = [];
    glob(pattern, {
        nodir: true
    }, function (err, files) {
        if (err) {
            logTool_1.log.error('读取文件列表发现错误:\r\n %j ', err);
            cb(err);
        }
        else {
            async.eachSeries(files, function (file, callback) {
                fs.stat(file, function (err, stats) {
                    // var filename = path.basename(file);
                    if (err) {
                        return callback(err);
                    }
                    if (moment().diff(moment(stats.mtime), 'days') > keepdays) {
                        logTool_1.log.log('file:%s\r\nstats:\r\n%j', file, stats);
                        filelist.push({
                            filepath: file,
                            size: Math.ceil(stats.size / 1000),
                            mtime: stats.mtime,
                            beforeday: moment().diff(moment(stats.mtime), 'days')
                        });
                    }
                    callback();
                });
            }, function (err) {
                if (err) {
                    logTool_1.log.error('读取文件状态发现错误:\r\n %j ', err);
                    return cb(err);
                }
                logTool_1.log.log('文件列表:\r\n %j', filelist);
                return cb(null, filelist);
            });
        }
    });
}
let service = {};
service.clearLog = function (cb) {
    var logDirectory = process.cwd() + '/log';
    var keepdays = config_1.config.logkeepday || 10;
    readFileNameToList(logDirectory + '/*', keepdays, function (err, filelist) {
        if (err) {
            return cb(err);
        }
        async.eachSeries(filelist, function (file, callback) {
            fs.unlink(file.filepath, function (err) {
                logTool_1.log.log('文件已删除:\r\n%s', file.filepath);
                callback(err);
            });
        }, function (err) {
            if (err) {
                logTool_1.log.error('删除文件发现错误:\r\n %j ', err);
            }
            cb(err);
        });
    });
};
service.setWorkByTime = function () {
    var rule = new schedule.RecurrenceRule();
    rule.hour = 6;
    rule.minute = 0;
    schedule.scheduleJob(rule, function () {
        logTool_1.log.info('清除日志文件工作已开始...');
        service.clearLog(function (err) {
            logTool_1.log.info('清除日志文件工作已完成...');
        });
    });
};
exports.clearLogService = service;
