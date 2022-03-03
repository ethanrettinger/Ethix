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
    switch (req.body.operation) {
        case 'install':
            // copy the package from packages/ to public/termpackages
            const package = req.body.package;
            const packagePath = path.join(__dirname, 'packages', package);
            const destPath = path.join(__dirname, 'public', 'termpackages', package);
            const files = fs.readdirSync(packagePath);
            files.forEach(file => {
                // async
                fs.copyFile(path.join(packagePath, file), path.join(destPath, file), err => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
            let scripts = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'termpackages', package, 'package.json'), 'utf8')).scripts;
            res.send({
                success: true,
                message: 'Successfully reinstalled package',
                scripts: scripts
            });
            break;
        case 'reinstall':
            // delete the package from public/termpackages
            // if the package doesn't exist in the public/termpackages folder, continue normally
            const package = req.body.package;
            const packagePath = path.join(__dirname, 'public', 'termpackages', package);
            if (!fs.existsSync(packagePath)) {
                res.send({
                    success: false,
                    message: 'No package found',
                });
                return;
            }
            
            fs.rm(packagePath, { recursive: true }, err => {
                if (err) {
                    console.log(err);
                }
            });
            const destPath = path.join(__dirname, 'public', 'termpackages', package);
            const files = fs.readdirSync(packagePath);
            files.forEach(file => {
                // async
                fs.copyFile(path.join(packagePath, file), path.join(destPath, file), err => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
            // read the package json file and get the scripts array
            let scripts = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'termpackages', package, 'package.json'), 'utf8')).scripts;
            res.send({
                success: true,
                message: 'Successfully reinstalled package',
                scripts: scripts
            });
            break;
        case 'uninstall':
            // delete the package from public/termpackages
            // if the package doesn't exist in the public/termpackages folder, return error
            const package = req.body.package;
            const packagePath = path.join(__dirname, 'public', 'termpackages', package);
            if (!fs.existsSync(packagePath)) {
                res.send({
                    success: false,
                    message: 'No package found',
                });
                return;
            }

            fs.rm(packagePath, { recursive: true }, err => {
                if (err) {
                    console.log(err);
                }
            });
            res.send({
                success: true,
                message: 'Successfully uninstalled package',
            });
            break;
        case 'create':
            // create a new package in packages/
            let package = req.body.package;
            let packagePath = path.join(__dirname, 'packages', package);
            if (fs.existsSync(packagePath)) {
                res.send({
                    success: false,
                    message: 'Package already exists',
                });
                return;
            }
            
            await fs.promises.mkdir(packagePath);
            await fs.promises.writeFile(
                path.join(__dirname, 'packages', package, 'package.json'),
                JSON.stringify({
                    name: package,
                    version: '1.0.0',
                    description: 'This is an auto-generated package.',
                    author: 'Me',
                    scripts: ["index.js"],
                })
            );
            await fs.promises.writeFile(
                path.join(__dirname, 'packages', package, 'index.js'),
                `\// Write your code here.`
            );
            let scripts = JSON.parse(fs.readFileSync(path.join(__dirname, 'packages', package, 'package.json'), 'utf8')).scripts;
            res.send({
                success: true,
                message: 'Successfully created package',
                scripts: scripts
            });
            break;
        default:
            res.send({
                success: false,
                message: 'Invalid Ethix Package Manager operation provided',
            });
            break;
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