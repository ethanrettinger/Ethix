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

app.post('/command', (req, res) => {
    fs.appendFileSync(path.join(__dirname, 'commands.log'), req.body.command + '\n');
});
app.get('/command', (req, res) => {
    res.send({
        commands: fs.readFileSync(path.join(__dirname, 'commands.log'), 'utf8').split('\n'),
    })
});
app.post('/packages', async (req, res) => {
    switch (req.body.operation) {
        case 'install':
            // copy the package from packages/ to public/termpackages
            package = req.body.package;
            packagePath = path.join(__dirname, 'packages', package);
            destPath = path.join(__dirname, 'public', 'termpackages', package);
            let files = fs.readdirSync(packagePath);
            try {
                await fs.promises.mkdir(destPath);
            } catch (err) {
                if (err.code !== 'EEXIST') {
                    res.send({
                        success: false,
                        error: err,
                    });
                    return;
                } else {
                    res.send({
                        success: false,
                        error: 'Package already installed',
                    });
                    return;
                }
            }

            // write all of the files in the package to the public/termpackages folder
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let filePath = path.join(packagePath, file);
                let destFilePath = path.join(destPath, file);
                fs.copyFileSync(filePath, destFilePath);
            }
            // get the scripts key from the package.json
            let packageJson = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'))).scripts;
            res.send({
                success: true,
                message: 'Successfully reinstalled package',
<<<<<<< HEAD
                scripts: packageJson,
=======
                scripts: packageJson
            });
            break;
        case 'reinstall':
            // delete the package from public/termpackages
            // if the package doesn't exist in the public/termpackages folder, continue normally
            package = req.body.package;
            packagePath = path.join(__dirname, 'packages', package);
            destPath = path.join(__dirname, 'public', 'termpackages', package);
            if (!fs.existsSync(packagePath)) {
                res.send({
                    success: false,
                    message: 'No package available.',
                });
                return;
            }
            
            try { fs.rmSync(destPath, { recursive: true }, err => { }); } catch (err) { console.log(err) }
            fs.mkdirSync(destPath);
            items = fs.readdirSync(path.join(__dirname, 'packages', package));
            for (let i = 0; i < items.length; i++) {
                let file = items[i];
                let filePath = path.join(packagePath, file);
                let destFilePath = path.join(destPath, file);
                fs.copyFileSync(filePath, destFilePath);
            }
            // get the scripts key from the package.json
            scriptsJson = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'))).scripts;
            res.send({
                success: true,
                message: 'Successfully reinstalled package',
                scripts: scriptsJson
>>>>>>> bfe0a648877db6879888543f074a7f480a570564
            });
            break;
        case 'uninstall':
            // delete the package from public/termpackages
            // if the package doesn't exist in the public/termpackages folder, return error
            package = req.body.package;
            packagePath = path.join(__dirname, 'public', 'termpackages', package);
            destPath = path.join(__dirname, 'public', 'termpackages', package);
            if (!fs.existsSync(packagePath)) {
                res.send({
                    success: false,
                    message: 'No package found',
                });
                return;
            }
            scripts_ = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'))).scripts;
            fs.rm(packagePath, { recursive: true }, err => {});
            res.send({
                success: true,
                message: 'Successfully uninstalled package',
                scripts: scripts_,
            });
            break;
        case 'create':
            // create a new package in packages/
            package = req.body.package;
            packagePath = path.join(__dirname, 'packages', package);
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
                    scripts: ['index.js'],
                })
            );
            await fs.promises.writeFile(
                path.join(__dirname, 'packages', package, 'index.js'),
                `\// Write your code here.`
            );
            scripts = JSON.parse(
                fs.readFileSync(path.join(__dirname, 'packages', package, 'package.json'), 'utf8')
            ).scripts;
            res.send({
                success: true,
                message: 'Successfully created package',
                scripts: scripts,
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
    // if req.body.operationn is not defined do not throw an error
    // if it is not defined assume the operation is 'write'
    let op = req.body.operation || 'write';
    switch(op) {
        case 'write':
            file = req.params[0];
            file_path = path.join(__dirname, 'fs', file);
            fs.writeFileSync(file_path, req.body.fileContents);
            res.send({
                success: true,
                message: 'File saved',
            });
            break;
        case 'append':
            file = req.params[0];
            file_path = path.join(__dirname, 'fs', file);
            fs.appendFileSync(file_path, req.body.fileContents);
            res.send({
                success: true,
                message: 'File saved',
            });
            break;
        case 'delete':
            file = req.params[0];
            file_path = path.join(__dirname, 'fs', file);
            // if the file does not exist return an error
            if (!fs.existsSync(file_path)) {    
                res.send({
                    success: false,
                    message: 'File does not exist',
                });
                return;
            }
            fs.unlinkSync(file_path);
            res.send({
                success: true,
                message: 'File deleted',
            })
            break;
        default:
            res.send({
                success: false,
                message: 'Invalid file operation provided',
            });
            break;
    }
});
app.get('/files/*', (req, res) => {
    let file = req.params[0];
    let file_path = path.join(__dirname, 'fs', file.toString() + '\\');
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
app.get('/log', (req, res) => {
    let log = fs.readFileSync(path.join(__dirname, 'log.log'), 'utf8');
    res.send(log);
});
app.post('/log', (req, res) => {
    let log = req.body.log;
    // append the log to ./log.log
<<<<<<< HEAD
    if (fs.statSync('log.log').size > 1000000) {
=======
    if(fs.statSync('log.log').size > 1000000) {
>>>>>>> bfe0a648877db6879888543f074a7f480a570564
        fs.writeFileSync(path.join(__dirname, 'log.log'), '-- LOG FILE CLEARED --');
    }
    fs.appendFileSync(path.join(__dirname, 'log.log'), log);
    res.send({
        success: true,
        message: 'Log saved',
    });
});

app.post('/repo', (req, res) => {   
    // the repo endpoint searches the /packages folder for a package with the name of the repo
    // if there are packages that include the name of the query in the body, return them


    let query = req.body.query;
    let packages = fs.readdirSync(path.join(__dirname, 'packages'));
    let results = [];
    for (let i = 0; i < packages.length; i++) {
        let package = packages[i];
        let packageJson = JSON.parse(
            fs.readFileSync(path.join(__dirname, 'packages', package, 'package.json'), 'utf8')
        );
        let packageName = packageJson.name;
        if (packageName.toLowerCase().includes(query.toLowerCase())) {
            results.push({
                name: packageName,
                version: packageJson.version,
                description: packageJson.description
            });
        }
    }
    if(results.length < 1) {
        res.send({
            success: false,
            message: 'No packages found',
        });
        return;
    } else {
        res.send({
            success: true,
            message: 'Packages found',
            results: results,
        });
    }
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
