import { log } from '../../util/logTool';
import captchapng = require('captchapng');
import { cacheTool } from '../../util/cacheTool';

export const controller: any = {};

const CacheGroupName = 'validimgcode';

controller.getValidImg = function (req, res, next) {
  let cacheId = req.query.id;

  log.log('getValidImg cacheId:' + cacheId);

  if (cacheId) {
    var validValue = parseInt(Math.random() * 9000 + 1000 + '', 10);

    log.log('getValidImg validValue:' + cacheTool.get(CacheGroupName, cacheId));
    
    cacheTool.set(CacheGroupName, cacheId, validValue, 1000 * 60 * 30);


    let p = new captchapng(80, 30, validValue); // width,height,numeric
    p.color(60, 179, 215, 100); // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
    var img = p.getBase64();
    var imgbase64 = new Buffer(img, 'base64');
    res.set('Content-Type', 'image/png');
    res.send(imgbase64);
  } else {
    res.send('');
  }
};

controller.checkValidImgCode = function (req, res, next) {
  let cacheId = req.body.id;
  let code = req.body.code;

  log.log('checkValidImgCode:' + cacheId + ':' + code);

  let checkcode = cacheTool.get(CacheGroupName, cacheId);

  if (checkcode) {
    if (checkcode == code) {
      res.json({
        ok: true
      });
    } else {
      res.status(400).json({
        error: 'invalid code!'
      });
    }
  } else {
    res.status(400).json({
      error: 'invalid code!'
    });
  }
};

controller.registerPath = function (router) {
  router.addPathGetHanlder('/', controller.getValidImg);
  router.addPathPostHanlder('/', controller.checkValidImgCode);
}