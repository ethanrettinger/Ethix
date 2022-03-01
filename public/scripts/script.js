const commandManager = new CommandManager();
const terminal = new Term();

// write welcome message to the terminal
terminal.log("ETHIX Terminal v0.1.2".bold());
terminal.log("Last Updated: " + "2/28/2022".gray());
terminal.log("ETHIX -> Ethan's Unix Terminal".green());

// input handler
document.getElementById("in").addEventListener("keydown", function (e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    let command = document.getElementById("in").value;
    document.getElementById("in").value = "";
    terminal.log('$ > ' + command);
    // test if the command exists
    if (commandManager.get(command.split(" ")[0])) {
        commandManager.run(command);
    } else {
        terminal.err("Command not found");
    }
});
// when the tab key is pressed, autocomplete the command
document.getElementById("in").addEventListener("keydown", function (e) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    let cmd = document.getElementById("in").value;
    let possibleCommands = [];
    for (let command in commandManager.getAll()) {
        if (command.startsWith(cmd)) {
            possibleCommands.push(command);
        }
    }
    if (possibleCommands.length === 0) {
        terminal.err("No possible commands to autocomplete.");
    } else if (possibleCommands.length === 1) {
        document.getElementById("in").value = possibleCommands[0];
    } else {
        terminal.log(possibleCommands.join("\t"));
    }
});
// when the page is loaded, add all packages to the terminal
window.onload = function () {
    terminal.log("Loading packages...".yellow());
    // get all packages in ../termpackages/
    fetch('/installedpackages', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        return response.json();
    }).then(dat => {
        // for each package, add it to the terminal
        let {
            packages: data
        } = dat;
        for (let i = 0; i < data.length; i++) {
            terminal.log(`Located package ${data[i]}`.green());
            terminal.log(`Installing package ${data[i]}...`.yellow());
            let script = document.createElement('script');
            script.id = `package-${data[i]}`;
            script.src = `/termpackages/${data[i]}/index.js`;
            document.body.appendChild(script);
            terminal.log(`Package ${data[i]} installed!`.green());
        }
    });
}
// help command
commandManager.add("help", "Lists a(ll) command(s) and their proper usage.", "help [command]", (args) => {
    terminal.log("\t[] = optional".gray());
    terminal.log("\t() = required".gray());
    terminal.log("\t{} = optional with default value".gray());
    terminal.log("\tkey=value = accepts an option and a value".gray());
    terminal.log("\t[one|two] = accepts a specific value".gray());
    terminal.log("\t[one,two] = accepts a list of values".gray());
    terminal.log("\t\" \" = accepts a string with spaces".gray());
    terminal.log("Available commands:".green());
    for (let command in commandManager.getAll()) {
        terminal.log(`- ${commandManager.getAll()[command].usage}`);
        terminal.log(`\t${commandManager.getAll()[command].description}\n`.italic());
    }
});

commandManager.add("echo", "Prints a message to the terminal.", "echo (message)", (args) => {
    terminal.log(args.join(" "));
});

commandManager.add("epm", "Download a package from the internet. The URL must end with .js, as the downloader reads the content on the page", "epm (install|reinstall|delete|create) (package name)", async (args) => {
    if (!args[1]) {
        terminal.err("No package name provided");
        return;
    }
    switch (args[0]) {
        case "install":
            terminal.log("Installing package...".yellow());
            break;
        case "reinstall":
            terminal.log("Reinstalling package...".yellow());
            break;
        case "delete":
            terminal.log("Deleting package...".yellow());
            break;
        case "create":
            terminal.log("Creating package...".yellow());
            break;
        default:
            terminal.err("Invalid command");
            return;
    }
    if (args[0] !== "create") {
        fetch("/packages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: args[1],
                operation: args[0],
                user: "default"
            })
        }).then(res => {
            return res.json();
        }).then(res => {
            if (!res.success) {
                terminal.err(res.message);
                return;
            }
            if (args[0] === "install") {
                terminal.log("Package downloaded successfully!".green());
                let file = res.scriptContents;
                let script = document.createElement("script");
                script.id = `package-${args[1].split(".")[0]}`;
                script.src = `/termpackages/${args[1]}/index.js`;
                document.body.appendChild(script);
            } else if (args[0] === "delete") {
                terminal.log("Package deleted successfully!".green());
                let script = document.getElementById(`package-${args[1].split(".")[0]}`);
                script.parentNode.removeChild(script);
            } else if (args[0] === "reinstall") {
                let script = document.getElementById(`package-${args[1].split(".")[0]}`);
                script.parentNode.removeChild(script);
                let script2 = document.createElement("script");
                script2.id = `package-${args[1].split(".")[0]}`;
                script2.src = `/termpackages/${args[1]}/index.js`;
                document.body.appendChild(script2);
                terminal.log("Package reinstalled successfully!".green());
            }
        }).catch(err => {
            terminal.err(err);
        });
    } else if (args[0] === "create") {
        fetch("/packages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: args[1],
                operation: args[0],
                user: "default"
            })
        }).then(res => {
            return res.json();
        }
        ).then(res => {
            if (!res.success) {
                terminal.err(res.message);
                return;
            }
            terminal.log("Package created successfully!".green());
        }).catch(err => {
            terminal.err(err);
        });
    }
});

commandManager.add('ls', 'Lists all files in the current directory.', 'ls [directory]', (args) => {
    let dir = args[0] || '';
    fetch(`/files/${dir}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(res => {
        return res.json();
    }).then(res => {
        if (!res.success) {
            terminal.err(res.message);
            return;
        }
        terminal.log(res.files.join("\n"));
    }).catch(err => {
        terminal.err(err.message);
    });
});