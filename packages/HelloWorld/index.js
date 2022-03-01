commandManager.add("hello", "Says hello world", "hello", args => {
    terminal.log("Hello world!".orange().bold());
});