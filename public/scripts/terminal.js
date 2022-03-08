class Term {
    log(message) {
        let msg = message.replaceAll("\n", "<br>").replaceAll("\t", "\u00a0\u00a0\u00a0\u00a0") + "<br>";
        document.getElementById("output").innerHTML += msg;
        document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight;
        // send post to /log
        if(!message) message = ""; 
        fetch('/log', { 
            method: 'POST', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ log: msg })
        });
    }

    cls() {
        document.getElementById("output").innerHTML = "";
        document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight;
    }

    log_nnl(message) {
        if(!message) message = ""; 
        let msg = message.replaceAll("\n", "<br>").replaceAll("\t", "\u00a0\u00a0\u00a0\u00a0") + "<br>";
        document.getElementById("output").innerHTML += msg
        document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight;
        fetch('/log', { 
            method: 'POST', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ log: msg })
        });
    }

    err(message) {
        if(!message) message = ""; 
        let msg = "ERROR: ".red().bold() + message.replaceAll("\n", "<br>").replaceAll("\t", "\u00a0\u00a0\u00a0\u00a0").red() + "<br>".red();
        document.getElementById("output").innerHTML += msg
        document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight;
        fetch('/log', { 
            method: 'POST', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ log: msg })
        });
    }

    async backnav(int) {
        // send fetch request to /command and return the command[int]
        fetch('/command', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            return response.json();
        }).then(dat => {
            // res.commands is an array of all the commands
            // the int is the index of the command to return
            // the index is reversed because the most recent command is at the end of the array
            let data = dat.commands;
            let command = data[data.length - int - 1];
            if(command === undefined) { return; }
            document.getElementById('in').value = command;
        })
    }
}