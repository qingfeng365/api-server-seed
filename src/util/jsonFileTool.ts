import * as fs from 'fs';

export const jsonFileTool​​ = {
  readFileToJson: (filename: string) => {
    let data: string;
    let obj: any;
    try {
      data = fs.readFileSync(filename,'utf-8');
      obj = JSON.parse(data);
    } catch (e) {
      console.log(e.message);
      obj = {};
    } finally {
      
    }
    return obj;
  }
}
