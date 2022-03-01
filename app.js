// create express server that can:
// - take in a command from the frontend

const express = require('express');
const app = express();
const port = 80;
const bodyparser = require('body-parser');
const fs = require('fs');
const path = require('path');
const e = require('express');

app.use(bodyparser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/command', (req, res) => {});

app.post('/packages', async (req, res) => {
    if (req.body.operation === 'install') {
        let url = path.join(__dirname, 'packages', req.body.url);
        if (!url) {
            res.send({
                success: false,
                message: 'No URL provided',
            });
            return;
        }

        try {
            var package_json = fs.readFileSync(url + '\\package.json', 'utf8');
        } catch (err) {
            res.send({
                success: false,
                message: 'No package.json found',
            });
            return;
        }
        package_json = JSON.parse(package_json);
        let package_name = package_json.name;
        let package_path = path.join(__dirname, 'public', 'termpackages', package_name);
        if (fs.existsSync(package_path)) {
            res.send({
                success: false,
                message: 'Package is already installed in the package folder.',
            });
            return;
        }
        fs.mkdirSync(package_path);
        fs.writeFileSync(
            path.join(__dirname, 'public', 'termpackages', package_name, 'package.json'),
            JSON.stringify(package_json)
        );
        for (let scriptz in package_json.scripts) {
            let script = package_json.scripts[scriptz];
            var file = await fs.promises.readFile(path.join(__dirname, 'packages', package_name, script), 'utf8');
            if (!file) {
                res.send({
                    success: false,
                    message: 'No script found named ' + script,
                });
                return;
            }
            fs.writeFileSync(path.join(__dirname, 'public', 'termpackages', package_name, script), file);
        }
        res.send({
            success: true,
            message: 'Package downloaded',
            scriptContents: file,
        });
    } else if (req.body.operation === 'reinstall') {
        let url = path.join(__dirname, 'packages', req.body.url);
        if (!url) {
            res.send({
                success: false,
                message: 'No URL provided',
            });
            return;
        }

        try {
            var package_json = await fs.promises.readFile(url + '\\package.json', 'utf8');
        } catch (err) {
            res.send({
                success: false,
                message: 'No package.json found',
            });
            return;
        }
        package_json = JSON.parse(package_json);
        let package_name = package_json.name;
        try {
            await fs.promises.rmdir(
                path.join(__dirname, 'public', 'termpackages', package_name),
                { recursive: true },
                err => {
                    if (err) {
                        console.log(err);
                    }
                }
            );
        } catch (err) {
            console.log(err);
        }
        let package_path = path.join(__dirname, 'public', 'termpackages', package_name);
        await fs.promises.mkdir(package_path);
        await fs.promises.writeFile(
            path.join(__dirname, 'public', 'termpackages', package_name, 'package.json'),
            JSON.stringify(package_json)
        );
        for (let scriptz in package_json.scripts) {
            let script = package_json.scripts[scriptz];
            var file = await fs.promises.readFile(path.join(__dirname, 'packages', package_name, script), 'utf8');
            if (!file) {
                res.send({
                    success: false,
                    message: 'No script found named ' + script,
                });
                return;
            }
            await fs.promises.writeFile(path.join(__dirname, 'public', 'termpackages', package_name, script), file);
        }
        res.send({
            success: true,
            message: 'Package downloaded',
            scriptContents: file,
        });
    } else if (req.body.operation === 'delete') {
        let url = path.join(__dirname, 'packages', req.body.url);
        if (!url) {
            res.send({
                success: false,
                message: 'No URL provided',
            });
            return;
        }
        try {
            fs.rmdirSync(path.join(__dirname, 'public', 'termpackages', req.body.url), { recursive: true }, err => {
                if (err) {
                    console.log(err);
                }
            });
        } catch (err) {
            console.log(err);
        }
        res.send({
            success: true,
            message: 'Package uninstalled',
        });
    } else if (req.body.operation === "create") {
        let url = path.join(__dirname, 'packages', req.body.url);
        if (!url) {
            res.send({
                success: false,
                message: 'No package name provided',
            });
            return;
        }
        let package_path = path.join(__dirname, 'packages', req.body.url);
        if (fs.existsSync(package_path)) {
            res.send({
                success: false,
                message: 'Package already exists',
            });
            return;
        }
        fs.mkdirSync(package_path);
        fs.writeFileSync(
            path.join(__dirname, 'packages', req.body.url, 'package.json'),
            JSON.stringify({
                name: req.body.url,
                version: '1.0.0',
                description: 'This is an auto-generated package.',
                author: 'Me',
                scripts: [ "index.js" ],
            })
        );
        fs.writeFileSync(
            path.join(__dirname, 'packages', req.body.url, 'index.js'),
            `\// Write your code here.`
        );
        res.send({
            success: true,
            message: 'Package created successfully in the package repository.',
        });

    } else {
        res.send({
            success: false,
            message: 'No operation provided',
        })
    }
});

// when a get request is sent to /file read the file and send it back
// the request will be formatted like /file/directory
app.get('/file/*', (req, res) => {
    let file = req.params[0];
    let file_path = path.join(__dirname, 'fs', file);
    if (!fs.existsSync(file_path)) {
        fs.writeFileSync(file_path, '');
        res.send({
            success: true,
            message: 'File found',
            fileContents: '',
        });
        return;
    } else {
        res.send({
            success: true,
            message: 'File found',
            fileContents: fs.readFileSync(file_path, 'utf8'),
        });
    }
});
app.post('/file/*', (req, res) => {
    let file = req.params[0];
    let file_path = path.join(__dirname, 'fs', file);
    fs.writeFileSync(file_path, req.body.fileContents);
    res.send({
        success: true,
        message: 'File saved',
    });
});
app.get('/files/*', (req, res) => {
    let file = req.params[0];
    let file_path = path.join(__dirname, 'fs', file.toString() + '\\');
    console.log(fs.readdirSync(file_path));
    console.log(file_path)
    if (!fs.existsSync(file_path)) {
        res.send({
            success: false,
            message: 'File not found',
        });
        return;
    } else {
        res.send({
            success: true,
            message: 'Directory found',
            files: fs.readdirSync(file_path),
        });
    }
});
app.get('/installedpackages', (req, res) => {
    let packages = fs.readdirSync(path.join(__dirname, 'public', 'termpackages'));
    res.send({
        success: true,
        message: 'Packages found',
        packages: packages,
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
