# EPM Documentation

This file contains all of the documentation you'll ever need to develop any sort of package in the Package Manager for the Ethix Shell.

> (!) NOTE (!) The Ethix shell is currently in the Alpha development phase. The built-in package manager is incredibly buggy, so please inform the creator of any issues encountered. Thank you.

The EPM (Ethix Package Manager) is (currently) a local repository of installable packages that users can manage through their system via the epm command in the Ethix shell. Packages can be created with ease with just a few simple steps.

## GUIDE: Creating a hello world package
1. Open the Ethix terminal
2. Type `epm create HelloWorld`
3. A new HelloWorld folder will appear in `/packages`. Open `package.json`
4. Configure the settings to your needs accordingly. 
5. Open `index.js`
6. Write the following code. I will provide a breakdowna after :)
```
commandManager.add(
    "HelloWorld",
    "Prints 'Hello World'",
    "HelloWorld",
    () => {
        terminal.log('Hello, world!');
    }
);
```
7. After you're done, save the file and open the Ethix shell. Type `epm install HelloWorld`
8. If you didn't fuck anything up, the `HelloWorld` command will be shown in the `help` command and will be executable directly.


## DOCUMENTATION
---
### Terminal

The `terminal` is the output text on the screen. It is a DIV element with span elements as the messages. The ID of the terminal element is `output`. The input box at the bottom of the screen is, of course, `input`.

There are two main global variables: `terminal` and `commandManager`.
The `terminal` object is an instance of the **Terminal** class. Here are some methods

---

```terminal.log(text)```

 Write a line of text to the terminal. Supports HTML formatting```

```terminal.cls()```

Clear the terminal

```terminal.log_nnl(text)```

Log text to the terminal on the same line as the previous terminal line. (Essentially no automatic newline)

```terminal.err(text)```

Write an error to the terminal. Automatically dark red and starts with ***ERROR***


---
### Command Manager

The `commandManager` variable is an instance of the `commandManager` class. The `commandManager` variable can add, get, remove, and run different commands.

--- 

```commandManager.add(commandName, description, usage, function)```

The `commandName` is the command written in the terminal to run the command. `Description` is the description of the command as shown in `help`. `Usage` is the usage command, again, as shown in help. Finally, the function is the function called when the command is ran.

When a command is ran, an argument is passed to it containing all of the arguments written by the user. The argument is an array of strings. Here's an example:

```
commandManager.add("E", "", "", arguments => {
    terminal.log(arguments)
});
```

(In the terminal)
`E arg1 arg2 arg3 hello hi` logs `["arg1", "arg2", "arg3", "hello", "hi"]`


`commandManager.remove(commandName)`

Removes a command. Not intended for package use, but can be used in case of compatibility issues.

`commandManager.get(commandName)`

Gets the `Command` object of a given command name

`commandManager.getAll()`

Returns all of the command objects

`commandManager.run(command)`

Runs a command. `command` is formatted the same way it is entered in the terminal.

`commandManager.tabComplete(text)`

Deprecated.

---

### Colors

There are several embedded colors with plenty more coming.
In order to format something in the console, just write a string with the color name and () after. For example:

`terminal.log("Hello World".green())`

Logs Hello World in green. Can be chained like so:

`terminal.log("Hello World".green().bold())`

Logs green **Hello World**

All colors:
- red
- orange
- yellow
- green
- blue
- purple
- gray
- lightred
- lightorange
- lightyellow
- lightgreen
- lightblue
- lightpurple
- lightgray
- bold
- italic
- underline
- strike

> Note: You can also add newlines and tabs into messages written to the terminal with \n and \t respectively.

---

### Filesystem/API Endpoints

### Reading/Writing to files
The terminal can interact with the /fs/ directory directly. This directory acts as a **root** directory, meaning that referencing, for example `/file.txt` would reference `/fs/file.txt`


You can send post and get requests to write to and read files respectively. Here's some examples for this

```
// append data to /user/file.txt

fetch('/file/user/file.txt', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        fileContents: await getContents('/user/file.txt') + "\nHello world! This was appended!"
    })
});

async function getContents(dir) {
    await fetch(`/file${dir}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res.json();
    }).then(json => {
        var returnData = json;
    }
    
    return returnData;
}
```

The `/file/*` endpoint takes the data at * and locates the file relative to `/fs/`. The POST
method writes to the file. In the body of your request, you can specify an operation, but the default is 'write' (case sensitive).
Here are the operations:

* Write (Overwrite file with new content)
* Append (Add text to end of file)
* Delete (Self explanatory)


### Reading/Writing to directories

Sending a `POST` request to /file/ will automatically create the file if it does not exist.
You can send a `GET` request to `/files/*` (* being the directory relative to /fs/) which acts as an
MKDIR command. The return value is an array. If no files exist, `res.success` will be `false`, and the message will be `File not found`.

Here's an example function that gets all of the files in the root directory (not recursive).

```
async function listRoot() {
    let files = [];
    await fetch('/files/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res.json();
    }).then(json => {
        files = json;
    }
    
    return files
}
```

### Installing packages (for dependencies)

You can send a POST request to `/packages` to manage your packages. However, reinstalling packages must be done through the frontend. This section will probably be deleted soon, since I want to revamp package dependencies and conflictions.

### Listing installed packages

Sending a `GET` to /installedpackages will return an array called `packages` (res.packages).

### Log Management

The `Log` is what saves commands and terminal output to a persistent file that is read every time the page is loaded. To write a new line to the log, send a POST to /log. 

**The log file is automatically deleted if its size exceeds 1MB to keep the website performant.**

Send a `GET` to /log to read the entire log file. 


## package.json usage

The package.json file is what is used in your packages to tell the terminal how to parse and install your packages. Here is the default structure of a package.json (It is reccomended to format your file once you open it)

Currently, you must write the name of every file you'd like to be copied when installing in `scripts` (excluding package.json). I will change this in the future!

```
{
    "name": "Package",
    "version": "1.0.0",
    "description": "...",
    "author": "Me",
    "scripts": [
        "index.js"
    ]
}
```

Here is what I want it to look like soon:

```
{
    "name": "Package",                           //Package Name
    "version": "1.0.0",                          //Package Version (Major).(Minor).(Very Minor)
    "description": "...",                        // Package description as shown in the EPM -q command (doesn't exist as of writing)
    "author": "Me",                              // Author of the package
    "terminalVersion": "1.0.4",                  // Most recent known supported terminal version
    requiredFiles: ["script.js", "cssFile.css"], // All files that will be copied over when installing the package
    dependencies: ["alias", "cedel"],            //All packages that will be installed alongside the package if they aren't
    conflictions: ["HelloWorld"]                 //All packages that will be removed (if the user approves)
}
```

