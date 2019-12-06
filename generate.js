const fs = require('fs');
const path = require('path');
const template = 'report_template.html';

if (!process.argv[2]) {
    console.log('please input json. eg: json/xxx.json');
    return;
}


const jsonPath = process.argv[2];

let html = fs.readFileSync(template).toString();
let json = fs.readFileSync(jsonPath).toString();
let output = html.replace('::json::', json);
let outputFilename = 'report/' + path.basename(jsonPath, '.json') + '.html';
fs.writeFileSync(outputFilename, output);