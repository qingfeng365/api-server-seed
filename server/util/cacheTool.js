"use strict";
/**
 * cacheTool 是一个通用的缓存分组管理工具
 *
 * 缓存分组管理, 在get,set时,要同时指定 组名和key
 *
 * 普通用法(如果缓存不存在时,需要生成缓存的场景不推荐):
 *
 * get(组名,key)
 * set(组名,key,value,[过期毫秒(可选)])
 * clear(组名)
 *
 * 一般情况下,可直接使用 get,set 方法即可,不需要初始化缓存组
 * 默认初始化最大记录为 1000
 *
 * 如果需要指定初始化,可调用
 *
 * init(组名, maxsize, [过期毫秒(可选)])
 *
 * init方法 必须在还没有调用过 get\set 方法调用才有效
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 高级用法(推荐):
 *
 * setReadDataFn(组名,回调函数) : 设置缓存不存在时,查询原始数据的回调函数
 * yield read(组名,key)  (注意: read 是 promise)
 *
 * setReadDataFn回调函数要求:
 *
 * - 执行结果返回 promise
 * - 接收参数为 key
 * - 如: function(key){}
 *
 * 如果调用过setReadDataFn
 *
 * 则在调用 read 时, 会根据缓存是否存在, 自动调用 回调函数 获取原始数据,
 * 并重置缓存,如果promise发生错误,则重置缓存为null
 *
 * 即如果定义了setReadDataFn,应使用read方法,不要使用 get,set
 */
const bluebird_1 = require("bluebird");
let nodeSmpleCache = require('node-smple-cache');
exports.cacheTool = {};
exports.cacheTool.groups = {};
function takeGroup(groupName, maxsize, expiremillisecond) {
    if (!exports.cacheTool.groups[groupName]) {
        maxsize = maxsize || 100 * 10;
        exports.cacheTool.groups[groupName] = {
            cache: nodeSmpleCache
                .createCache('LRU', maxsize),
            expiremillisecond: expiremillisecond,
            readDataFn: null,
        };
        return exports.cacheTool.groups[groupName];
    }
    else {
        return exports.cacheTool.groups[groupName];
    }
}
function takeGroupCache(groupName) {
    const group = takeGroup(groupName);
    return group.cache;
}
function initGroupCache(groupName, maxsize, expiremillisecond) {
    const group = takeGroup(groupName, maxsize, expiremillisecond);
    return group.cache;
}
exports.cacheTool.get = function (groupName, key) {
    var cache = takeGroupCache(groupName);
    return cache.get(key);
};
exports.cacheTool.set = function (groupName, key, value, expiremillisecond) {
    const cache = takeGroupCache(groupName);
    cache.set(key, value, expiremillisecond);
};
exports.cacheTool.clear = function (groupName) {
    const cache = takeGroupCache(groupName);
    cache.clear();
};
exports.cacheTool.init = function (groupName, maxsize, expiremillisecond) {
    return initGroupCache(groupName, maxsize, expiremillisecond);
};
exports.cacheTool.setReadDataFn = function (groupName, cb) {
    const group = takeGroup(groupName);
    group.readDataFn = cb;
};
/**
 * 读取缓存,不存在时自动调用查询回调
 */
exports.cacheTool.read = function (groupName, key) {
    return new bluebird_1.Promise(function (resolve, reject) {
        var group = takeGroup(groupName);
        var cache = group.cache;
        var value = cache.get(key);
        if (!value) {
            if (group.readDataFn) {
                // 如果有定义查询回调
                group.readDataFn(key)
                    .then(function (result) {
                    cache.set(key, result, group.expiremillisecond);
                    resolve(result);
                })
                    .catch(function (err) {
                    cache.set(key, null);
                    resolve(null);
                });
            }
            else {
                resolve(value);
            }
        }
        else {
            resolve(value);
        }
    });
};
