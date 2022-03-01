let content;
let openedFile;
commandManager.add("nano", "Open a fullscreen editor for a file.", "nano (file name)", async (args) => {
    // cache the terminal content
    content = document.getElementById("output").innerHTML;
    // clear the terminal
    document.getElementById("output").innerHTML = "";


    // make the terminal editable
    document.getElementById("output").contentEditable = true;
    document.getElementById("output").focus();


    // fetch the file contents of /file/name
    openedFile = args[0];
    await fetch(`/file/${openedFile}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => {
        return res.json();
    }).then(res => {
        if(!res.success) {
            terminal.err(res.message);
            return;
        }
        // set the contents of the terminal
        document.getElementById("output").innerHTML = res.fileContents;
    }).catch(err => {
        terminal.err(err);
    });
});

document.getElementById("output").addEventListener("keydown", async (event) => {
    // if ctrl+x is pressed and the terminal is editable write the file to console and clear the terminal
    if(event.ctrlKey && event.key === 'x' && document.getElementById("output").isContentEditable) {
        event.preventDefault();
        document.getElementById('line-number').remove();
        document.getElementById("output").contentEditable = false;
        fetch(`/file/${openedFile}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileContents: document.getElementById("output").innerHTML,
            })
        }).then((res) => {
            return res.json();
        }).then((res) => {
            if (!res.success) {
                terminal.err(res.message);
                return;
            }
            document.getElementById("output").innerHTML = content;
            terminal.log("File saved successfully.".green());
            document.getElementById("input").focus();
        });
    }
});