"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
function mkdirAutoNext(pathlist, pathlistlength, callback, pathlistlengthseed, pathtmp) {
    callback = callback ||
        function () { };
    if (pathlistlength > 0) {
        if (!pathlistlengthseed) {
            pathlistlengthseed = 0;
        }
        if (pathlistlengthseed >= pathlistlength) {
            callback(true);
        }
        else {
            if (pathtmp) {
                pathtmp = path.join(pathtmp, pathlist[pathlistlengthseed]);
            }
            else {
                pathtmp = pathlist[pathlistlengthseed];
            }
            fs.exists(pathtmp, function (exists) {
                if (!exists) {
                    fs.mkdir(pathtmp, function (err) {
                        if (!err) {
                            mkdirAutoNext(pathlist, pathlistlength, function (callresult) {
                                callback(callresult);
                            }, pathlistlengthseed + 1, pathtmp);
                        }
                        else {
                            callback(false);
                        }
                    });
                }
                else {
                    mkdirAutoNext(pathlist, pathlistlength, function (callresult) {
                        callback(callresult);
                    }, pathlistlengthseed + 1, pathtmp);
                }
            });
        }
    }
    else {
        callback(true);
    }
}
exports.dirutil = {
    /**
     * [mkdirsSync 创建多层文件夹 同步]
     * @param  {[type]} dirpath [description]
     * @param  {[type]} mode    [description]
     * @return {[type]}         [description]
     */
    mkdirsSync: function (dirpath, mode) {
        if (!fs.existsSync(dirpath)) {
            console.log(dirpath);
            var pathtmp;
            var paths = dirpath.split(path.sep);
            dirpath.split(path.sep).forEach(function (dirname, index) {
                //由于第一个元素是空串
                if (dirname === '') {
                    dirname = '/';
                }
                if (pathtmp) {
                    pathtmp = path.join(pathtmp, dirname);
                }
                else {
                    pathtmp = dirname;
                }
                if (!fs.existsSync(pathtmp)) {
                    if (!fs.mkdirSync(pathtmp, mode)) {
                        return false;
                    }
                }
            });
        }
        return true;
    },
    /**
   * [mkdirs 创建多层文件夹 异步]
   * @param  {[type]}   dirpath  [description]
   * @param  {[type]}   mode     [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
    mkdirs: function (dirpath, callback) {
        callback = callback ||
            function () { };
        fs.exists(dirpath, function (exitsmain) {
            if (!exitsmain) {
                //目录不存在
                var pathtmp;
                var pathlist = dirpath.split(path.sep);
                var pathlistlengthseed = 0;
                if (pathlist.length > 0 && pathlist[0] === '') {
                    // pathlist.shift();
                    pathlist[0] = '/';
                }
                var pathlistlength = pathlist.length;
                mkdirAutoNext(pathlist, pathlist.length, function (callresult) {
                    if (callresult) {
                        callback(true);
                    }
                    else {
                        callback(false);
                    }
                });
            }
            else {
                callback(true);
            }
        });
    }
};
