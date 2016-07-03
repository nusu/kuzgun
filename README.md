# kuzgun
simple, ssh based deployment command line tool

note: It's new, not perfectly functional right now be awere of it

## what is it ? ##
kuzgun is very simple deployment tool, its basically responsible to pull your changes on server.

## how it works ?##
Mantality is very simple. choose your spesific branch for git and send your kuzgun to server ( $ kuzgun brak ) right after git push
It will simply go your server and tell git pull in your desired directory
that's everything


## Installation ##

----------

    npm install kuzgun -g

## usage ##
watch the video: [usage video](https://www.youtube.com/watch?v=pCsU8JC5wVk)
assume that you have a working project, first cd to your repository, and run *kuzgun init*

----------

    $ cd my-repository/
    $ kuzgun birth

*It will ask you bunch of project information, than It will save it to .kuzgun file, so you can change it later or run kuzgun init again*

than you need to send kuzgun to server, It will arrange configrations for you

*If you never login to your server before than login for one time and save your computer to known_hosts than exit*

----------

run this for configuration:

    $ kuzgun flight

It will add your selected ssh-key to .ssh/authorized_keys in the server, than It will go to the dir you've selected and git clone from your repo.
note that It will in the same directory like: git clone myrepoaddress .

----------

than you're ready to go, when you push changes than execute:

    $ git push origin master
    $ kuzgun brak
your changes in your server now!
*ravens warble like brakk brakk when they flying, because of that its brak*

#Tips
if you are using something like [forever](https://www.npmjs.com/package/forever%22forever%22) or [pm2](https://www.npmjs.com/package/pm2%22pm2%22) etc. you can simply specify what commands kuzgun will execute preupdate and afterupdate in .kuzgun file

----------

and if you willing to connect your server with ssh by your own, you can simply run

    $ kuzgun capture
this will copy your clipboard something like this

> ssh myusername@myserver

## what the hell is kuzgun mean? ##
Kuzgun means "Raven" in Turkish.

not very long time ago we use ravens for communication, we send letters with them
I inspired their characteristic features, and It's meaningfull, because raven collect your commands, and take it to the server.
It's flying, It's commanding by your name.
Its your virtual raven.

