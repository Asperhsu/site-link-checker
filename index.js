const fs = require('fs');
const url = require('url');
const dateFormat = require('date-format');
const blc = require('broken-link-checker');

if (!process.argv[2]) {
    console.log('please input url. eg: http://example.com');
    return;
}

// input
let options = {
    acceptedSchemes: ['https'],
    rateLimit: 10, // ms
    excludeExternalLinks: true,
    // honorRobotExclusions: false,
};
let siteUrl = process.argv[2];
let customData = {};

// output
let links = [];
let invalidLinks = [];
let junks = [];

var siteChecker = new blc.SiteChecker(options, {
	robots: function(robots, customData){
        // console.log('robots', robots);
    },
	html: function(tree, robots, response, pageUrl, customData){
        // console.log('html', tree);
    },
	junk: function(result, customData){
        if (result.excluded) return;

        junks.push({
            base: result.base.original,
            link: result.url.original,
            line: result.html.location.line,
            tag: result.html.tag,
            reason: blc[result.brokenReason],
        });
    },
	link: function(result, customData){
        let item = {
            base: result.base.original,
            link: result.url.original,
            line: result.html.location && result.html.location.line,
            tag: result.html.tag,
        };

        if (result.broken) {
            invalidLinks.push(Object.assign({}, item, {
                reason: blc[result.brokenReason] || null,
            }));
        } else {
            links.push(item);
        }
    },
	page: function(error, pageUrl, customData){
        console.log(pageUrl);
    },
	site: function(error, siteUrl, customData){
        // console.log('site', error, siteUrl, customData);
    },
	end: function(){
        let dd = new Date();
        let dateTime = dateFormat('yyyy-MM-dd hh:mm:ss', dd);
        let data = {siteUrl, dateTime, links, invalidLinks, junks};

        let site = url.parse(siteUrl);
        let filename = site.hostname + '_' + dateFormat('yyyy-MM-dd_hhmmss', dd) + '.json';
        let json = JSON.stringify(data);

        fs.writeFileSync('json/' + filename, json);
    }
});

siteChecker.enqueue(siteUrl, customData);
