"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonFileTool_1 = require("./util/jsonFileTool");
const path = require("path");
let NODE_ENV = 'development';
let PORT = '8000';
const envfile = path.join(process.cwd(), 'config/env.json');
const env = jsonFileTool_1.jsonFileTool.readFileToJson(envfile);
if (env) {
    NODE_ENV = env.NODE_ENV || NODE_ENV;
    PORT = env.PORT || PORT;
}
process.env.NODE_ENV = NODE_ENV;
process.env.PORT = PORT;
