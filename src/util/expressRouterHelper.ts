let fn = function (router) {
  router.addPathGetHanlder = function (path, hanlder) {
    var hanlders = Array.prototype.slice.call(arguments, 1);
    router.get(path, hanlders);
  };
  router.addPathPostHanlder = function (path, hanlder) {
    var hanlders = Array.prototype.slice.call(arguments, 1);
    router.post(path, hanlders);
  };
  router.addPathPutHanlder = function (path, hanlder) {
    var hanlders = Array.prototype.slice.call(arguments, 1);
    router.put(path, hanlders);
  };
  router.addPathDeleteHanlder = function (path, hanlder) {
    var hanlders = Array.prototype.slice.call(arguments, 1);
    router.delete(path, hanlders);
  };
  router.addUseHanlder = function (use, hanlder) {
    var hanlders = Array.prototype.slice.call(arguments, 1);
    router.use(use, hanlders);
  };
  router.addParamHanlder = function (param, hanlder) {
    var hanlders = Array.prototype.slice.call(arguments, 1);
    router.param(param, hanlders);
  };
  return router;
};

export const expressRouterHelper = fn;