# Site Link Checker

## Generate Json
```
node index.js [url]
```
example: `node index.js http://example.com`

* json file locate in: json/[domain_datetime].json

## Generate Report
```
node generate.js [json file path]
```
example: `node generate.js json/xxx.json`
* html file locate in: html/[domain_datetime].html