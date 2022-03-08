commandManager.add(
    'alias',
    'Create a quick-alias for a long command',
    'alias (create|remove) (alias) "[command]"',
    async args => {
        if (args[0] == 'create') {
            if (args[1] == undefined) {
                return 'Please specify an alias name.';
            } else if (args[2] == undefined) {
                return 'Please specify a command.';
            } else {
                let alias = args[1];
                // join the rest of the args into a string
                let command = args.slice(2).join(' ');
                fetch('/file/aliases.json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fileContents: JSON.stringify(fetch('/file/aliases.json', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }).then(res => {
                            return res.json();
                        }).then(json => {
                            json[alias] = command;
                            return json;
                        }))  
                    }),
                })
                    .then(res => {
                        return res.json();
                    })
                    .then(json => {
                        if (json.success) {
                            return window.location.reload();
                        } else {
                            return terminal.err('Alias creation failure.');
                        }
                    });
            }
        } else if (args[0] == 'remove') {
            if (args[1] == undefined) {
                return 'Please specify an alias name.';
            } else {
                let alias = args[1];
                fetch('/file/aliases.json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fileContents: // fetch aliases.json and append the new alias
                        JSON.stringify(fetch('/file/aliases.json', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }).then(res => {
                            return res.json();
                        }).then(json => {
                            json[alias] = undefined;
                            return json;
                        }))                       
                    }),
                })
                    .then(res => {
                        return res.json();
                    })
                    .then(json => {
                        if (json.success) {
                            return window.location.reload();
                        } else {
                            return terminal.err('Alias removal failure.');
                        }
                    });
            }
        }
        
    }
);

fetch('/file/aliases.json', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
})
    .then(res => {
        return res.json();
    })
    .then(json => {
        json = JSON.parse(json.fileContents);

        let aliases = Object.keys(json);
        aliases.forEach(alias => {
            commandManager.add(alias, `Alias for ${json[alias].green()}`, alias, async args => {
                return await commandManager.run(json[alias]);
            });
            terminal.log(`Loaded alias: ${alias} -> ${json[alias]}`);
        });
    });
