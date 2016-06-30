# kuzgun
simple, ssh based deployment command line tool

## what is it ? ##
kuzgun is very simple deployment tool, its basically responsible to pull your changes on server.

## how it works ?##
as first you create a .kuzgun file with "kuzgun birth" command, It's basically create a json file and store your server's information, than you're going to send your kuzgun to server for a test flight.
In this test flight kuzgun will add your ssh-key to your server's authorized-keys, so whenever you try to login your server you will no need to enter a password.

and when It's come to the detect changes and pull in the server, mantality is simple too. choose your spesific branch for git and send your kuzgun to server right after git push
It will simply go your server and tell git pull
that's everything



## what the hell is kuzgun mean? ##
Kuzgun means "Raven" in Turkish.

not very long time ago we use ravens for communication, we send letters with them
I inspired their characteristic features, and It's meaningfull, because raven collect your commands, and take it to the server.
It's flying, It's commanding by your name.
Its your virtual raven.


# not usable at the moment.
