"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./env");
const config_1 = require("./config/config");
const app_1 = require("./app");
const http = require("http");
const logTool_1 = require("./util/logTool");
let normalizePort = function normalizePort(val) {
    let port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
let onError = function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};
let onListening = function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    logTool_1.log.debug('-------监听端口: ' + bind);
};
logTool_1.log.debug('process.env.NODE_ENV:%s', process.env.NODE_ENV);
logTool_1.log.debug(config_1.config);
/**
 *
 */
const clearLogService_1 = require("./util/clearLogService");
clearLogService_1.clearLogService.clearLog(function (err) {
    if (err) {
        console.error(err.message || err);
    }
});
clearLogService_1.clearLogService.setWorkByTime();
let port = normalizePort(process.env.PORT || '9100');
app_1.app.set('port', port);
let server = http.createServer(app_1.app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
