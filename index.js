#! /usr/bin/env node
'use strict';

var kuzgun      = require('commander'),
    request     = require("request"),
    fs          = require("fs"),
    path        = require("path"),
    r           = require("inquirer"),
    Client      = require('ssh2').Client,
    ncp         = require("copy-paste"),
    chalk       = require("chalk");

// prompt
kuzgun
    .version('1.0.0')
    .arguments('[options] <file ...>')
    .option('-i, --init <init>', 'create kuzgun file')
    .option('-t, --test <test>', 'testet')
    .option('-B, --birth <birth>', 'create kuzgun file mystically')
    .option('-b, --brak <brak>', 'send kuzgun for pulling repository')
    .option('-f, --flight <flight>', 'send kuzgun for observation flight')
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
}else{
    var ravenFile = JSON.parse(fs.readFileSync('.kuzgun', 'utf8'));
    var privateKey = ravenFile.sshprivate;
}
if(kuzgun.test){
    console.log(kuzgun.test)
}

if(kuzgun.flight){
    // for add ssh key to knowing hosts
    var flightClient = new Client();
    flightClient.on('ready', function() {
        console.log(chalk.magenta('Kuzgun has been arrived the destination'));
        flightClient.exec("mkdir ~/.ssh; touch ~/.ssh/authorized_keys; chmod 600 ~/.ssh/authorized_keys; chmod 700 ~/.ssh; printf '%s\n' '"+ fs.readFileSync(ravenFile.sshpublic) +"' > ~/.ssh/authorized_keys; mkdir "+ravenFile.dir +"; cd "+ravenFile.dir+"; git clone "+ravenFile.repository+" .", function(err, stream) {
            console.log(chalk.magenta("Kuzgun trying to configurate everything"));
            if (err) {
                console.log(chalk.red('Kuzgun has been fall while configuring: ' + err));
                return flightClient.end();
            }
            stream.on('end', function() {
                console.log(chalk.yellow("Kuzgun had set up everything!"));
                return flightClient.end();
            }).on('data', function(data) {
                console.log(data.toString());
            });
        });
    }).connect({
        host: ravenFile.server,
        username: ravenFile.suser,
        password: ravenFile.spassword,
        port: 22
    });
}

if(kuzgun.capture) {
    var sshInfo = 'ssh ' + ravenFile.suser + '@' + ravenFile.server,
        isWin = /^win/.test(process.platform);
    if( isWin ){
        console.log(chalk.red("This feature is unnecessary in windows because windows terminal emulator doesn't have ssh support."));
    }
    ncp.copy(sshInfo, function () {
        console.log(chalk.magenta("ssh predefined login informations has been copied to your clipboard."));
        console.log(chalk.magenta("have a good flight"));
    });
}

if(kuzgun.brak){
    var brakClient = new Client();
    var kuzgunPath = ravenFile.dir,
        kuzgunBranch= ravenFile.alias+" "+ravenFile.branch;
    brakClient.on('ready', function() {
        brakClient.exec('cd '+kuzgunPath+'; git pull '+kuzgunBranch, function(err, stream) {
            if (err) {
                console.log(chalk.red('Kuzgun has been fall while pulling the repository, log: ' + err));
                return brakClient.end();
            }
            stream.on('end', function() {
                return brakClient.end();
            }).on('data', function(data) {
                console.log(data.toString());
            });
            stream.on('close', function(code, signal) {
                console.log(chalk.magenta('Stream :: close :: code: ' + code + ', signal: ' + signal));
                brakClient.end();
            }).on('data', function(data) {
                console.log(chalk.magenta('Server Said (STDOUT): ' + data));
            }).stderr.on('data', function(data) {
                console.log(chalk.magenta('Server Said (STDERR): ' + data));
            });
        });
    }).connect({
        host: ravenFile.server,
        username: ravenFile.suser,
        privateKey: fs.readFileSync(privateKey),
        port: 22
    });
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
            type: "password",
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
        },
        {
            name: "repository",
            message: "repository url",
            default: ""
        },
        {
            name:"alias",
            message: "repository remote alias",
            default: "origin"
        },
        {
            name:"branch",
            message: "branch name that kuzgun going to pull?",
            default: "master"
        },
        {
            name:"dir",
            message: "working directory:"
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
            sshpublic: sshExactPath+'/'+answers.sshpublic,
            alias: answers.alias,
            branch: answers.branch,
            dir: answers.dir,
            repository: answers.repository
        };
        console.log(JSON.stringify(ravenJson, null, '   '));
        var outputFilename = ".kuzgun";
        fs.writeFile(outputFilename, JSON.stringify(ravenJson, null, 4), function(err) {
         if(err) {
            console.log(chalk.red("kuzgun suddenly fall:" + err));
         } else {
            console.log(chalk.green("kuzgun is ready to serve"));
            console.log(chalk.yellow("don't forget to add .kuzgun to .gitignore"));
         }
        });
    });

}
