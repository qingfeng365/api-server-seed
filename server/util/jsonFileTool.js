"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
exports.jsonFileTool = {
    readFileToJson: (filename) => {
        let data;
        let obj;
        try {
            data = fs.readFileSync(filename, 'utf-8');
            obj = JSON.parse(data);
        }
        catch (e) {
            console.log(e.message);
            obj = {};
        }
        finally {
        }
        return obj;
    }
};
