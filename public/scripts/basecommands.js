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
// rewrite the above function to be more compact

commandManager.add("epm", "Download a package from the internet. The URL must end with .js, as the downloader reads the content on the page", "epm (install|reinstall|uninstall|create) (package name)", async (args) => {
    if (!args[1]) { return terminal.err("No package name provided"); }
    switch (args[0]) {
        case "install":
            terminal.log("Installing package...".yellow());
            fetch("/packages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    package: args[1],
                    operation: args[0],
                    user: "default"
                })
            }).then(res => {
                return res.json();
            }).then(res => {
                if (!res.success) { return terminal.err(res.message); }
                // iterate through res.scripts and append them to the DOM
                res.scripts.forEach((script, index) => {
                    let script2 = document.createElement("script");
                    script2.id = `package-${args[1]}-${index}`;
                    script2.src = `/termpackages/${args[1]}/${script}`;
                    document.body.appendChild(script2);
                });
                terminal.log("Package downloaded successfully!".green());
            }).catch(err => {
                console.log(err)
            });
            break;
        case "reinstall":
            terminal.log("Reinstalling package...".yellow());
            fetch("/packages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    package: args[1],
                    operation: "reinstall",
                    user: "default"
                })
            }).then(res => {
                return res.json();
            }).then(res => {
                if (!res.success) { return terminal.err(res.message); }
                // iterate through all scripts in res.scripts and remove them from the DOM
                res.scripts.forEach((script, index) => {
                    let script2 = document.getElementById(`package-${args[1]}-${index}`);
                    script2?.parentNode?.removeChild(script2);
                });


                // send a request to the server to install the package
                fetch("/packages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        package: args[1],
                        operation: "install",
                        user: "default"
                    })
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (!res.success) { return terminal.err(res.message); }
                    // iterate through res.scripts and append them to the DOM
                    res.scripts.forEach((script, index) => {
                        let script2 = document.createElement("script");
                        script2.id = `package-${args[1]}-${index}`;
                        script2.src = `/termpackages/${args[1]}/${script}`;
                        document.body.appendChild(script2);
                    });
                    terminal.log("Package reinstalled successfully!".green());
                    location.reload(true)
                }).catch(err => {
                    console.log(err)
                });
            }).catch(err => {
                console.log(err)
            });
            break;
        case "uninstall":
            terminal.log("Uninstalling package...".yellow());
            fetch("/packages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    package: args[1],
                    operation: args[0],
                    user: "default"
                })
            }).then(res => {
                return res.json();
            }).then(res => {
                if (!res.success) { return terminal.err(res.message); }
                // iterate through res.scripts and remove them from the DOM
                res.scripts.forEach((script, index) => {
                    let script2 = document.getElementById(`package-${script.split(".")[0]}-${index}`);
                    script2?.parentNode?.removeChild(script2);
                });
                terminal.log("Package uninstalled successfully!".green());
                location.reload(true)
            }).catch(err => {
                terminal.err(err);
            });
            break;
        case "create":
            terminal.log("Creating package...".yellow());
            fetch("/packages", {    
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    package: args[1],
                    operation: args[0],
                    user: "default"
                })
            }).then(res => {
                return res.json();
            }).then(res => {
                if (!res.success) { return terminal.err(res.message); }
                terminal.log("Package created successfully!".green());
                terminal.log("Navigate to " + "/packages/".green() + " in the server view the package.");
            }).catch(err => {
                terminal.err(err);
            });
            break;
        default:
            terminal.err("Invalid operation");
            break;
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