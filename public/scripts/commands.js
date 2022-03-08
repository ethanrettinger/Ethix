// create modular command system for the terminal
// users can script their own commands and import them


class Command {
    constructor(name, description, usage, func) {
        this.name = name;
        this.description = description;
        this.usage = usage;
        this.func = func;
    }
}


class CommandManager {
    constructor() {
        this.commands = {};
    }

    add(name, description, usage, func) {
        this.commands[name] = new Command(name, description, usage, func);
    }

    remove(name) {
        delete this.commands[name];
    }

    get(name) {
        return this.commands[name];
    }

    getAll() {
        return this.commands;
    }

    run(command) {
        let commandName = command.split(" ")[0];
        let commandArgs = command.split(" ").slice(1);
        this.commands[commandName].func(commandArgs);
    }
    tabComplete(text) {
        for (let command in this.commands) {
            if (command.toLowerCase().startsWith(text.toLowerCase())) {
                return command;
            }
        }
    }
}


