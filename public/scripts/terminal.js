class Term {
    log(message) {
        document.getElementById("output").innerHTML += message.replaceAll("\n", "<br>").replaceAll("\t", "\u00a0\u00a0\u00a0\u00a0") + "<br>";
        document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight;
    }

    cls() {
        document.getElementById("output").innerHTML = "";
        document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight;
    }

    log_nnl(message) {
        document.getElementById("output").innerHTML += message.replaceAll("\n", "<br>").replaceAll("\t", "\u00a0\u00a0\u00a0\u00a0");
        document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight;
    }

    err(message) {
        document.getElementById("output").innerHTML += "ERROR: ".red().bold() + message.replaceAll("\n", "<br>").replaceAll("\t", "\u00a0\u00a0\u00a0\u00a0").red() + "<br>".red();
        document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight;
    }
}


// create string prototypes that allow for color formatting