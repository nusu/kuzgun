#! /usr/bin/env node

var kuzgun = require('commander'),
    request = require("request"),
    fs      = require("fs"),
    path    = require("path");

// prompt
kuzgun
    .version('0.0.2')
    .arguments('[options] <file ...>')
    .option('-b, --brak <brak>', 'initiate kuzgun system')
    .parse(process.argv);

if(program.brak){
    console.log("brakk brakk!");
}

