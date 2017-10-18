"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonFileTool_1 = require("../util/jsonFileTool");
const path = require("path");
require("../env");
let common = {
    mongodbUrl: '',
    loglevel: 2,
    logkeepday: 10
};
let jsonFile = path.join(process.cwd(), 'config/env/', process.env.NODE_ENV + '.json');
const envConfig = jsonFileTool_1.jsonFileTool.readFileToJson(jsonFile);
let endConfig = common;
if (envConfig) {
    endConfig = Object.assign({}, common, envConfig);
}
exports.config = endConfig;
