import { log } from './logTool';
import * as _ from 'underscore';

export const routeTool = {
  logReq: function (req, res, next) {
    log.info('%s %s :\r\n req.body: \r\n %j \r\n\r\n req.params: \r\n %j \r\n\r\n req.query: \r\n %j \r\n',
      req.method, req.originalUrl, req.body, req.params, req.query);
    log.info('req.headers:\r\n %j \r\n', req.headers);
    next();
  }
} 