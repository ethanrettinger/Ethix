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
