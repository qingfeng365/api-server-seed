import './env';
import { config } from './config/config';
import { app } from './app';
import * as http from 'http';
import { log } from './util/logTool';

let normalizePort = function normalizePort(val) {
  let port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

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
}


let onListening = function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  log.debug('-------监听端口: ' + bind);

}


log.debug('------- 环境配置 -------');
log.debug('process.env.NODE_ENV:%s', process.env.NODE_ENV);
log.debug(config);

/**
 * 
 */
import { clearLogService } from './util/clearLogService';

clearLogService.clearLog(function (err) {
  if (err) {
    console.error(err.message || err);
  }
});
clearLogService.setWorkByTime();


let port = normalizePort(process.env.PORT || '9100');
app.set('port', port);


let server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.on('close', () => {
  console.log('server will close');
});

process.on('SIGINT', function () {
  console.log('Got SIGINT.  Press Control-D/Control-C to exit.');
});

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});

process.on('beforeExit', (code) => {
  console.log(`beforeExit: ${code}`);
});

process.on('disconnect', () => {
  console.log(`disconnect...`);
});

process.on('uncaughtException', (err => {
  console.log(`uncaughtException...`);
}));

