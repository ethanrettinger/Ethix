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