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
