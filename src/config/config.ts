import { jsonFileTool } from '../util/jsonFileTool';
import * as path from 'path';
import '../env';

let common = {
  mongodbUrl:'',
  loglevel: 2,
  logkeepday: 10
}

let jsonFile =
  path.join(process.cwd(), 'config/env/', process.env.NODE_ENV+'.json');

const envConfig: any = jsonFileTool.readFileToJson(jsonFile);

let endConfig = common;

if(envConfig){
  endConfig = Object.assign({}, common, envConfig);
}

export var config = endConfig;