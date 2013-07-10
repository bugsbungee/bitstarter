#!/usr/bin/env node
/* 
Automatically grade files for the presence of specified HTML 
tags/attributes.
Uses commander.js and cheerio. Teaches command line application 
development and basic DOM parsing.

*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://localhost";
var assertFileExists = function(infile) {
	var intr = infile.toString();
	if(!fs.existsSync(instr)) {
		console.log("%s does not exist. Exiting.", instr);
		process.exit(1);
	}
	return instr;
};

var assertUrlExists = function(inurl){
	console.log("Checking Url");
	return inurl.toString();
};
var cheerioHtmlFile = function(htmlfile) {
	return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
	return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
	$ = cheerioHtmlFile(htmlfile);
	var checks = loadChecks(checksfile).sort();
	var out = {};
	for(var ii in checks) {
		var present = $(checks[ii]).length >0;
		out[checks[ii]] = present;
	}
	return out;
};

var checkHtmlUrl = function(htmlurl, checksfile) {
	var htmlresult = '';
	console.log('Url ' + htmlurl.toString());
	rest.get(htmlurl).on('complete', function(result){
		htmlresult = result;
	});
	return htmlresult;	
};

var clone = function(fn) {
	return fn.bind({});
};

if(require.main == module) {
	program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <url>', 'Url to web page', clone(assertUrlExists))
	.parse(process.argv);
	
	if(!program.url) {
		console.log('Url is null');
		var checkJson = checkHtmlFile(program.file, program.checks);
		var outJson = JSON.stringify(checkJson, null, 4);
		console.log(outJson);
	} else {
		// Check the Url
		console.log("URL = "+ program.url.toString());
		console.log(checkHtmlUrl(program.url.toString()));
	}
	

} else {
	exports.checkHtmlFile = checkHtmlFile;
}
