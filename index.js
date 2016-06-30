#! /usr/bin/env node
'use strict';

var kuzgun      = require('commander'),
    request     = require("request"),
    fs          = require("fs"),
    path        = require("path"),
    r           = require("inquirer"),
    SSH         = require('simple-ssh'),
    ncp         = require("copy-paste");

// prompt
kuzgun
    .version('1.0.0')
    .arguments('[options] <file ...>')
    .option('-i, --init <init>', 'create kuzgun file')
    .option('-t, --test <test>', 'testet')
    .option('-B, --birth <birth>', 'create kuzgun file mystically')
    .option('-f, --flight <flight>', 'send kuzgun for observation flight')
    .option('-r, --reborn <reborn>', 'config for raven system')
    .option('-k, --raven <raven>', 'config for raven system')
    .option('-c, --capture <capture>', 'alias of ssh with information, capture your ravens body and flight')
    .parse(process.argv);

// ssh files
// get users home directory for spotting .ssh files
function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE;
}

// exit
// Fix stdout truncation on windows
function exit(code) {
    if (process.platform === 'win32' && process.stdout.bufferSize) {
        process.stdout.once('drain', function() {
            process.exit(code);
        });
        return;
    }
    process.exit(code);
}

// is .kuzgun file exist ?
Array.prototype.contains = function (v) {
    return this.indexOf(v) > -1;
}
var ravenWhereareYou = fs.readdirSync(process.cwd());
if( !ravenWhereareYou.contains(".kuzgun")){
    if(!kuzgun.init && !kuzgun.birth){
        console.log("no .kuzgun file found, how can it fly without coordinates?");
        exit(1);
    }
}
var ravenFile = JSON.parse(fs.readFileSync('.kuzgun', 'utf8'));
var  privateKey = ravenFile.sshprivate;
//console.log(JSON.stringify(ravenFile, null, '   '));
var ssh = new SSH({
    host: ravenFile.server,
    user: ravenFile.suser,
    //pass: ravenFile.spassword
    key: fs.readFileSync(privateKey)
});

if(kuzgun.test){
    ssh
        .exec("touch something.happening",{
            out: console.log.bind(console)
        })
        .start();
    ssh.on('error', function(err) {
        console.log('Oops, something went wrong.');
        console.log(err);
        ssh.end();
    });
}

if(kuzgun.flight){
    // for add ssh key to knowing hosts
    ssh
        .exec("mkdir ~/.ssh; touch ~/.ssh/authorized_keys; chmod 600 ~/.ssh/authorized_keys; chmod 700 ~/.ssh",{
            out: console.log.bind(console)
        }).exec("printf '%s\n' '"+ fs.readFileSync(ravenFile.sshpublic) +"' > ~/.ssh/authorized_keys", {
            out: console.log.bind(console)
        })
        .start();
    ssh.on('error', function(err) {
        console.log('Oops, something went wrong.');
        console.log(err);
        ssh.end();
    });
}

if(kuzgun.capture) {
    var sshInfo = 'ssh ' + ravenFile.suser + '@' + ravenFile.server,
        isWin = /^win/.test(process.platform);
    if( isWin ){
        console.log("This feature is unnecessary in windows because windows terminal emulator doesn't have ssh support.");
    }
    ncp.copy(sshInfo, function () {
        console.log("ssh predefined login informations has been copied to your clipboard.");
        console.log("have a good flight");
    });
}


if(kuzgun.brak){

}

if(kuzgun.init || kuzgun.birth){
    // make it happen
    var userhome = getUserHome(),
        sshExactPath  = userhome +"/.ssh";
    // get ssh path
    var sshPath = fs.readdirSync(sshExactPath),
        sshPub      = [],
        sshPrivate  = [];

    // spot .pub files with REGEX
    var patt = /^(.*\.)?[^.]*pub$/igm;
    var match="";
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
        var outputFilename = ".kuzgun";
        fs.writeFile(outputFilename, JSON.stringify(ravenJson, null, 4), function(err) {
         if(err) {
            console.log("kuzgun suddenly fall:" + err);
         } else {
            console.log("kuzgun is ready to serve");
         }
        });
    });

}
