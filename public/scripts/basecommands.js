commandManager.add(
    'epm',
    'Download a package from the Ethix Package Manager Repository',
    'epm (install|reinstall|uninstall|create|search) (package name)',
    async args => {
        if (!args[1]) {
            return terminal.err('No package name provided');
        }
        switch (args[0]) {
            case 'install':
                terminal.log('Installing package...'.yellow());
                fetch('/packages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        package: args[1],
                        operation: args[0],
                        user: 'default',
                    }),
                })
                    .then(res => {
                        return res.json();
                    })
                    .then(res => {
                        if (!res.success) {
                            return terminal.err(res.error);
                        }
                        // iterate through res.scripts and append them to the DOM
                        res.scripts.forEach((script, index) => {
                            let script2 = document.createElement('script');
                            script2.id = `package-${args[1]}-${index}`;
                            script2.src = `/termpackages/${args[1]}/${script}`;
                            document.body.appendChild(script2);
                        });
                        terminal.log('Package downloaded successfully!'.green());
                    })
                    .catch(err => {
                        console.log(err);
                    });
                break;
            case 'reinstall':
                terminal.log('Reinstalling package...'.yellow());
                fetch('/packages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        package: args[1],
                        operation: 'uninstall',
                        user: 'default',
                    }),
                })
                    .then(res => {
                        return res.json();
                    })
                    .then(res => {
                        if (!res.success) {
                            terminal.log('Skipping uninstall (package is not installed)'.gray());
                        }
                        // iterate through all scripts in res.scripts and remove them from the DOM
                        if (res.success) {
                            res.scripts.forEach((script, index) => {
                                let script2 = document.getElementById(`package-${args[1]}-${index}`);
                                script2?.parentNode?.removeChild(script2);
                            });
                            terminal.log('Deleted package successfully...'.yellow());
                        }

                        // send a request to the server to install the package
                        fetch('/packages', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                package: args[1],
                                operation: 'install',
                                user: 'default',
                            }),
                        })
                            .then(res => {
                                return res.json();
                            })
                            .then(res => {
                                if (!res.success) {
                                    return terminal.err('An error prevented your package from reinstalling.');
                                }
                                // iterate through res.scripts and append them to the DOM
                                res.scripts.forEach((script, index) => {
                                    let script2 = document.createElement('script');
                                    script2.id = `package-${args[1]}-${index}`;
                                    script2.src = `/termpackages/${args[1]}/${script}`;
                                    document.body.appendChild(script2);
                                });
                                terminal.log('Package reinstalled successfully!'.green());
                                location.reload(true);
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    })
                    .catch(err => {
                        console.log(err);
                    });
                break;
            case 'uninstall':
                terminal.log('Uninstalling package...'.yellow());
                fetch('/packages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        package: args[1],
                        operation: args[0],
                        user: 'default',
                    }),
                })
                    .then(res => {
                        return res.json();
                    })
                    .then(res => {
                        if (!res.success) {
                            return terminal.err(res.message);
                        }
                        // iterate through res.scripts and remove them from the DOM
                        res.scripts.forEach((script, index) => {
                            let script2 = document.getElementById(`package-${script.split('.')[0]}-${index}`);
                            script2?.parentNode?.removeChild(script2);
                        });
                        terminal.log('Package uninstalled successfully!'.green());
                        location.reload(true);
                    })
                    .catch(err => {
                        terminal.err(err);
                    });
                break;
            case 'create':
                terminal.log('Creating package...'.yellow());
                fetch('/packages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        package: args[1],
                        operation: args[0],
                        user: 'default',
                    }),
                })
                    .then(res => {
                        return res.json();
                    })
                    .then(res => {
                        if (!res.success) {
                            return terminal.err(res.message);
                        }
                        terminal.log('Package created successfully!'.green());
                        terminal.log('Navigate to ' + '/packages/'.green() + ' in the server view the package.');
                    })
                    .catch(err => {
                        terminal.err(err);
                    });
                break;
            case 'search':
                terminal.log('Searching package repository for "'.yellow() + args[1].green() + '"...'.yellow());
                fetch('/repo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: args[1],
                    }),
                }).then(res => {
                    return res.json();
                }).then(res => {
                    if (!res.success) {
                        return terminal.err(res.error);
                    }
                    terminal.log('Found ' + res.results.length + ' results:');
                    terminal.log('\tPackage\t\t\t\tVersion\t\t\t\tDescription'.gray())
                    res.results.forEach(result => {
                        terminal.log(`\t${result.name}\t\t\t\t${result.version}\t\t\t\t${result.description}`);
                    });
                });
                break;
            default:
                terminal.err('Invalid operation');
                break;
        }
    }
);

commandManager.add('help', 'Lists a(ll) command(s) and their proper usage.', 'help [command]', args => {
    terminal.log('\t() = required'.gray());
    terminal.log('\t[] = optional'.gray());
    terminal.log('\t{} = optional with default value'.gray());
    terminal.log('\tkey=value = accepts an option and a value'.gray());
    terminal.log('\t[one|two] = accepts a specific value'.gray());
    terminal.log('\t[one,two] = accepts a list of values'.gray());
    terminal.log('\t" " = accepts a string with spaces'.gray());
    terminal.log('Available commands:'.green());
    for (let command in commandManager.getAll()) {
        terminal.log(`- ${commandManager.getAll()[command].usage}`);
        terminal.log(`\t${commandManager.getAll()[command].description}\n`.italic());
    }
});

commandManager.add('echo', 'Prints a message to the terminal.', 'echo (message)', args => {
    terminal.log(args.join(' '));
});

commandManager.add('ls', 'Lists all files in the current directory.', 'ls [directory]', args => {
    let dir = args[0] || '';
    fetch(`/files/${dir}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(res => {
            return res.json();
        })
        .then(res => {
            if (!res.success) {
                terminal.err(res.message);
                return;
            }
            terminal.log(res.files.join('\n'));
        })
        .catch(err => {
            terminal.err(err.message);
        });
});
