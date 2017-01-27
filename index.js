#! /usr/bin/env node
'use strict';

var kuzgun      = require('commander'),
    request     = require("request"),
    fs          = require("fs"),
    path        = require("path"),
    r           = require("inquirer"),
    Client      = require('ssh2').Client,
    ncp         = require("copy-paste"),
    chalk       = require("chalk"),
    notifier    = require('node-notifier'),
    nc          = new notifier.NotificationCenter();

// prompt
kuzgun
    .version('1.1.1')
    .arguments('[options] <file ...>')
    .option('-i, --init <init>', 'create kuzgun file')
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

// semicolon fix
function semicolonFix(myString){
    myString = myString.trim();
    var stringLength = myString.length;
    var lastChar = myString.charAt(stringLength - 1);
    var firstChar = myString.charAt(0);
    if( firstChar != ";"){
        myString = ";" + myString;
    }
    if( lastChar != ";"){
        myString = myString + ";";
    }
    return myString;
}

// array compare
Array.prototype.compare = function(arrayError) {
    var tut = 0;
    for( i=0; i<arrayError.length; i++ ){
        if(~this.indexOf(arrayError[i])){
            tut = tut + 1;
        }
        if(i == arrayError.length - 1){
            if(tut == arrayError.length){
                return true;
            }else{
                return false;
            }
        }
    }
}

// possible git output errors for error management
var moveRemove = [ 'move', 'or', 'remove', 'merge.\nAborting\n' ];
var forgottenPush = ['Already', 'up-to-date.\n'];
var successMsg = ['file', 'changed,'];
var identity = ['Please', 'tell', 'me', 'who', 'you', 'identity'];

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
		var preupdate = ravenFile.preupdate ? semicolonFix(ravenFile.preupdate) : ";";
		var afterupdate = ravenFile.afterupdate ? semicolonFix(ravenFile.afterupdate) : ";";
}


if(kuzgun.flight){
    // for add ssh key to knowing hosts
    var flightClient = new Client();
    flightClient.on('ready', function() {
        console.log(chalk.magenta('Kuzgun has been arrived the destination'));
        flightClient.exec("\n mkdir ~/.ssh; touch ~/.ssh/authorized_keys; chmod 600 ~/.ssh/authorized_keys; chmod 700 ~/.ssh;", { pty: true }, function(err, stream) {
            console.log(chalk.magenta("Kuzgun trying to configurate everything"));
            if (err) {
                console.log(chalk.red('Kuzgun has been fall while configuring: ' + err));
            }
            stream.on('end', function() {
                console.log(chalk.yellow("Kuzgun had set up everything!"));
            }).on('data', function(data) {
                console.log(data.toString());
            });
        });
        flightClient.exec("printf '%s\n' '"+ fs.readFileSync(ravenFile.sshpublic) +"' > ~/.ssh/authorized_keys", function(err, stream) {
            console.log(chalk.magenta("Kuzgun trying to copy your key to authorized_keys"));
            if (err) {
                console.log(chalk.red('Kuzgun has been fall while copying your public key to authorized keys, log: ' + err));
                return flightClient.end();
            }
            stream.on('end', function() {
                console.log(chalk.yellow("Kuzgun successfully pasted your key"));
            }).on('data', function(data) {
                console.log(data.toString());
            });
        });
        flightClient.exec("mkdir ~/"+ravenFile.dir +"; cd ~/"+ravenFile.dir+""+ preupdate +"git init .; git remote add -t \* -f origin "+ravenFile.repository+"; git pull origin "+ravenFile.branch+""+afterupdate, {pty: true}, function(err, stream) {
            console.log(chalk.magenta("Kuzgun trying to clone your repository"));
            if (err) {
                console.log(chalk.red('Kuzgun has been fall while pulling your repository, log: ' + err));
                return flightClient.end();
            }
            stream.on('end', function() {
                console.log(chalk.yellow("Kuzgun successfully cloned your repository"));
                return flightClient.end();
            }).on('data', function(data) {
                console.log(data.toString());
            });
            stream.on('keyboard-interactive', function(name, instr, lang, prompts, cb) {
                cb(['y']);
            });
        });
    }).connect({
        host: ravenFile.server,
        username: ravenFile.suser,
        password: ravenFile.spassword,
        privateKey: fs.readFileSync(privateKey),
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
        brakClient.exec('cd '+kuzgunPath+''+ preupdate +'git pull '+kuzgunBranch+''+afterupdate, function(err, stream) {
            if (err) {
                console.log(chalk.red('Kuzgun has been fall while pulling the repository, log: ' + err));
                return brakClient.end();
            }
            stream.on('end', function() {
                return brakClient.end();
            }).on('data', function(data) {

            });
            stream.on('close', function(code, signal) {
                brakClient.end();
            }).stdout.on('data', function(data) {
                var res = data.toString().split(' ');
                if(res.compare(forgottenPush)){
                    console.log(chalk.magenta("You must forgotten to push your changes, because I'm seeing Already up-to-date alert."));
                    nc.notify({
                        'title': 'Kuzgun with Error',
                        'message': 'you must forgotten to push your changes.'
                    });
                }
                if(res.compare(successMsg)){
                    console.log(chalk.yellow("I successfully pulled your commit"));
                    nc.notify({
                        'title': 'Kuzgun',
                        'message': 'successfully deployed.'
                    });
                }
                if(res.compare(moveRemove)){
                    nc.notify({
                        'title': 'Kuzgun with Error',
                        'message': 'there was untracked files in the server.'
                    });
                    console.log(chalk.magenta("kuzgun: Git said there was untrackted files, so you had to erase them first"));
                }
                if(res.compare(identity)){
                    nc.notify({
                        'title': 'Kuzgun with Error',
                        'message': "you need to set your account's default identity."
                    });
                    console.log(chalk.magenta("kuzgun: Git said you need to set your account's default identity."));
                    console.log(chalk.yellow('you can copy your ssh information with kuzgun capture'));
                }
                //console.log(chalk.yellow('kuzgun: ' + data));
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
            name: "preupdate",
            message: "preupdate commands (separate with ;) :",
            default: ""
        },
        {
            name: "afterupdate",
            message: "afterupdate commands (separate with ;) :",
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
            preupdate: answers.preupdate,
            afterupdate: answers.afterupdate,
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
