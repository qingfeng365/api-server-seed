import { log } from '../../util/logTool';

export const controller:any = {};

controller.index = function (req, res, next) {
  res.json({ info: '/api 根路由不可以直接使用,要指定下级路由...' });
}

controller.registerPath = function (router) {
  router.addPathGetHanlder('/', controller.index);
}



