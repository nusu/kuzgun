#! /usr/bin/env node

var kuzgun      = require('commander'),
    request     = require("request"),
    fs          = require("fs"),
    path        = require("path"),
    r           = require("inquirer"),
    Client      = require("ssh2").Client;

// prompt
kuzgun
    .version('1.0.0')
    .arguments('[options] <file ...>')
    .option('-b, --brak <brak>', 'send raven to the data farm')
    .option('-r, --reborn <brak>', 'config for raven system')
    .parse(process.argv);

// ssh files
// get users home directory for spotting .ssh files
function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE;
}


if(kuzgun.send){

}


if(kuzgun.brak){
    // spot .pub files with REGEX
    var patt = /^(.*\.)?[^.]*pub$/igm;
    for (var i=0;i<sshPath.length;i++) {
        // if its not an ssh file
        if (sshPath[i] == "known_hosts" || sshPath[i] == "config") {
            var citrus = sshPath.splice(i, 1);
            i--;
        }
        // if it has .pub extension than push it to ssh public array
        while (match = patt.test(sshPath[i])) {
            sshPub.push(sshPath[i]);
        }
        // if it has not .pub extension than push it to ssh private array
        if(!patt.test(sshPath[i]) && sshPath[i] != null){
            sshPrivate.push(sshPath[i]);
        }
        // now we have sshPub, sshPrivate arrays with data.
    }
    /* development purposes only
    console.log(JSON.stringify(sshPath, null, '   '));
    console.log("now time to exclude private and pub key");
    console.log("public keys");
    console.log(JSON.stringify(sshPub, null, '   '));
    console.log("private keys");
    console.log(JSON.stringify(sshPrivate, null, '   '));
    */
}

if(kuzgun.reborn){
    // make it happen
    var userhome = getUserHome(),
        sshExactPath  = userhome +"/.ssh";
    // get ssh path
    var sshPath = fs.readdirSync(sshExactPath),
        sshPub      = [],
        sshPrivate  = [];

    // spot .pub files with REGEX
    var patt = /^(.*\.)?[^.]*pub$/igm;
    for (var i=0;i<sshPath.length;i++) {
        // if its not an ssh file
        if (sshPath[i] == "known_hosts" || sshPath[i] == "config") {
            var citrus = sshPath.splice(i, 1);
            i--;
        }
        // if it has .pub extension than push it to ssh public array
        while (match = patt.test(sshPath[i])) {
            sshPub.push(sshPath[i]);
        }
        // if it has not .pub extension than push it to ssh private array
        if(!patt.test(sshPath[i]) && sshPath[i] != null){
            sshPrivate.push(sshPath[i]);
        }
        // now we have sshPub, sshPrivate arrays with data.
    }
    // ssh files end


    var info = [
        {
            name: "server",
            message: "server ip or domain"
        },
        {
            name: "suser",
            message: "server username"
        },
        {
            name: "spassword",
            message: "server password"
        },
        {
            name: "sport",
            message: "server port",
            default: "22"
        },
        {
            type: "list",
            name: "sshprivate",
            message: "DSA type ssh Private Key",
            choices: sshPrivate
        },
        {
            type: "list",
            name: "sshpublic",
            message: "DSA type ssh Public Key",
            choices: sshPub
        }
    ];
    var ravenJson = {};
    r.prompt(info).then(function (answers) {
        ravenJson = {
            server: answers.server,
            suser: answers.suser,
            spassword: answers.spassword,
            sport: answers.sport,
            sshprivate: sshExactPath+'/'+answers.sshprivate,
            sshpublic: sshExactPath+'/'+answers.sshpublic
        };
        console.log(JSON.stringify(ravenJson, null, '   '));
        var outputFilename = "raven.json";
        fs.writeFile(outputFilename, JSON.stringify(ravenJson, null, 4), function(err) {
         if(err) {
            console.log(err);
         } else {
            console.log("raven is ready to serve");
         }
        });
    });

}
