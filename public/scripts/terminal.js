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
}