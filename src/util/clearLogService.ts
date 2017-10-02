import * as fs from 'fs';
import * as path from 'path';
import * as async from 'async';
import * as glob from 'glob';
import * as moment from 'moment';
import * as schedule from 'node-schedule';
import { log } from './logTool';
import { config } from '../config/config';

function readFileNameToList(pattern, keepdays, cb) {
  var filelist = [];
  glob(pattern, {
    nodir: true
  }, function(err, files) {
    if (err) {
      log.error('读取文件列表发现错误:\r\n %j ', err);
      cb(err);
    } else {
      async.eachSeries(files, function(file, callback) {
        fs.stat(file, function(err, stats) {
          // var filename = path.basename(file);
          if (err) {
            return callback(err);
          }
          if (moment().diff(moment(stats.mtime), 'days') > keepdays) {
            log.log('file:%s\r\nstats:\r\n%j', file, stats);
            filelist.push({
              filepath: file,
              size: Math.ceil(stats.size / 1000),
              mtime: stats.mtime,
              beforeday: moment().diff(moment(stats.mtime), 'days')
            });
          }
          callback();
        });
      }, function(err) {
        if (err) {
          log.error('读取文件状态发现错误:\r\n %j ', err);
          return cb(err);
        }
        log.log('文件列表:\r\n %j', filelist);
        return cb(null, filelist);
      });
    }
  });
}

let service:any = {};

service.clearLog = function(cb) {
  var logDirectory = process.cwd() + '/log';
  var keepdays = config.logkeepday || 10;

  readFileNameToList(logDirectory + '/*', keepdays, function(err, filelist) {
    if (err) {
      return cb(err);
    }
    async.eachSeries(filelist,
      function(file:any, callback) {
        fs.unlink(file.filepath, function(err) {
          log.log('文件已删除:\r\n%s',file.filepath);
          callback(err);
        });
      },
      function(err) {
        if (err) {
          log.error('删除文件发现错误:\r\n %j ', err);
        }
        cb(err);
      });
  });

};

service.setWorkByTime = function() {
  var rule = new schedule.RecurrenceRule();　
  rule.hour = 6;
  rule.minute = 0;
  schedule.scheduleJob(rule, function() {
    log.info('清除日志文件工作已开始...');
    service.clearLog(function(err) {
      log.info('清除日志文件工作已完成...');
    });
  });
};

export const clearLogService = service;