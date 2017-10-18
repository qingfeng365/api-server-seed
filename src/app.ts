
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as compression from 'compression';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import FileStreamRotator = require('file-stream-rotator');
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

/**
 * 配置
 */
import { config } from './config/config';
const logDirectory = process.cwd() + '/log';

/**
 * 路由日志初始化
 */

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

var logStream = FileStreamRotator.getStream({
  filename: logDirectory + '/route_%DATE%.log',
  verbose: false,
  frequency: '60m'
});

/**
 * resource 目录
 */
import { dirutil } from './util/dirutil';
dirutil.mkdirsSync(path.join(process.cwd(), '/resource'));
dirutil.mkdirsSync(path.join(process.cwd(), '/resource_dev'));


/**
 * session 管理
 */
import * as session from 'express-session';
import * as connectMongo from 'connect-mongo';
var MongoStore = connectMongo(session);

/**
 * mongoose 启动
 */
import * as mongoose from 'mongoose';
mongoose.connect(config.mongodbUrl);

/**
 * 应用环境初始化
 */
export const app = express();

/**
 * api server 不再设置 views view engine
 */

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


/**
 * 通用路由中间件
 */

app.use(session({
  name: 'api.Server.Session',
  secret: 'api.Server.Key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3 * 24 * 60 * 60 * 1000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  })
}));

if (app.get('env') === 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger(
    '[:date[iso]] :method :url :status :res[content-length] (:res[content-type]) - :response-time ms (:remote-addr) ', {
      stream: logStream
    }));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());


/**
 * 静态路由管理
 */
app.use(favicon(path.join(process.cwd(), '/public/favicon.ico')));
app.use('/node_modules', express.static(path.join(process.cwd(), '/node_modules')));
app.use('/public', express.static(path.join(process.cwd(), '/public')));

/**
 * 路由请求头日志
 */
import { routeTool } from './util/routeTool';
app.use(routeTool.logReq);

/**
 * 常规路由处理
 */
import { routes } from './routes';
routes(app);

/**
 * 错误处理路由-404
 */
app.use(function(req, res, next) {
  var err:any = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * 错误处理路由-开发状态-error stacktrace
 */
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      error: err.message || err,
      syserror: err
    });
  });
}

/**
 * 错误处理路由-生产状态-no error stacktrace
 */
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: err.message || err,
  });
});