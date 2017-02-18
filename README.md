# kuzgun
simple, ssh based deployment command line tool

note: It's new, and not perfectly functional right now. Be aware of that.

## What is it?
kuzgun is very simple deployment tool, its basically responsible to pull your changes on server.

## How does it work?
It is very simple. Choose your git branch, git push, and send it to the server with kuzgun (`kuzgun brak`).
It will simply go to your server and tell git to pull in your desired directory.
That's everything.


## Installation

----------

```
npm install kuzgun -g
```

## Usage
Watch the video: [usage video](https://www.youtube.com/watch?v=pCsU8JC5wVk)
Assume that you have a working project, first `cd` to your repository, and run `kuzgun init`.

----------

```
cd my-repository/
kuzgun birth
```

*It will ask you bunch of project information, than it will save it to `.kuzgun` file, so you can change it later or run `kuzgun init` again*

Then you need to send kuzgun to the server. It will arrange configrations for you.

*If you have never logged in to your server before, then login once and save your computer to `known_hosts`, then exit*

----------

Run this for configuration:

```
kuzgun flight
```

It will add your selected ssh-key to `.ssh/authorized_keys` on the server, then it will go to the dir you've selected and `git clone` from your repo.
Note that it will be in the same directory (for example, `git clone myrepoaddress`).

----------

Then you're ready to go. After you run `git push`, then run:

```
kuzgun brak
```
    
Your changes are on your server now!
*ravens warble like brakk brakk when they flying, because of that its brak*

# Tips
If you are using something like [forever](https://www.npmjs.com/package/forever%22forever%22) or [pm2](https://www.npmjs.com/package/pm2%22pm2%22) etc. you can simply specify what commands kuzgun will execute preupdate and afterupdate in the `.kuzgun` file.

----------

And if you willing to connect your server with ssh on your own, you can simply run

```
kuzgun capture
```

This will copy your clipboard something like this

```
> ssh myusername@myserver
```

## What the hell does kuzgun mean?
Kuzgun means "Raven" in Turkish.

Not very long ago, we used ravens for communication. We sent letters with them.
It inspired their characteristic features, and it's meaningful, because raven collect your commands, and take it to the server.
It's flying, It's commanding by your name.
Its your virtual raven.
