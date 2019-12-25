const mv = require('mv');
const fs = require('graceful-fs');
const fse = require('fs-extra');
const request = require('request');
const path = require('path');
const walk = require('walk');
const unzip = require('unzipper');
const child_process = require('child_process');
const ncp = require('ncp');

const gameIconsUrl = "https://game-icons.net/archives/png/zip/000000/ffffff/game-icons.net.png.zip";
const tempFilePath = "./temp.zip";
const tempDir = "./temp";
const imgDir = "./generator/img";
const customIconDir = "./resources/custom-icons";
const cssPath = "./generator/css/icons.css";
const jsPath = "./generator/js/icons.js";
const processIconsCmd = `parallel -q mogrify -alpha copy -channel-fx "red=100%,blue=100%,green=100%" ::: $(ls *.png)`

// ----------------------------------------------------------------------------
// Download
// ----------------------------------------------------------------------------
function downloadFile(url, dest) {
    console.log("Downloading...");
    return new Promise((resolve, reject) => {
        request(url).pipe(fs.createWriteStream(dest)).on('error', reject).on('close', resolve);
    });
}

// ----------------------------------------------------------------------------
// Unzip
// ----------------------------------------------------------------------------
function unzipAll(src, dest) {
    console.log("Unzipping...");
    return new Promise((resolve, reject) => {
        fs.createReadStream(tempFilePath)
        .pipe(unzip.Parse())
        .on('entry', function(entry) {
            const fileName = entry.path;
            const baseName = path.basename(fileName);
            const type = entry.type;
            if (type === "File") {
                entry.pipe(fs.createWriteStream(path.join(dest, baseName)));
            }
            else {
                entry.autodrain();
            }
        })
        .on('close', resolve)
        .on('error', reject);
    });
}

// ----------------------------------------------------------------------------
// Process icons
// ----------------------------------------------------------------------------
function processAll(path) {
    console.log("Processing (this will take a while)...");
    return new Promise((resolve, reject) => {
        child_process.exec(processIconsCmd, {cwd: path}, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}

// ----------------------------------------------------------------------------
// Generate CSS
// ----------------------------------------------------------------------------
function generateCSS(src, dest) {
    console.log("Generating CSS...");
    return new Promise((resolve, reject) => {
        fs.readdir(src, (err, files) => {
            if (err) {
                reject(err);
            }
            else {
                const content = files
                    .map(name => `.icon-${name.replace(".png", "")} { background-image: url(../img/${name});}\n`)
                    .join("");
                fs.writeFile(dest, content, err => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            }
        });
    });
}

// ----------------------------------------------------------------------------
// Generate JS
// ----------------------------------------------------------------------------
function generateJS(src, dest) {
    console.log("Generating JS...");
    return new Promise((resolve, reject) => {
        fs.readdir(src, (err, files) => {
            if (err) {
                reject(err);
            }
            else {
                const content = "var icon_names = [\n" + files
                    .map(name => `    "${name.replace(".png", "")}"`)
                    .join(",\n") +
`
];

var class_icon_names = [
    "class-barbarian",
    "class-bard",
    "class-cleric",
    "class-druid",
    "class-fighter",
    "class-monk",
    "class-paladin",
    "class-ranger",
    "class-rogue",
    "class-sorcerer",
    "class-warlock",
    "class-wizard"
];

icon_names = icon_names.concat(class_icon_names);
`;
                fs.writeFile(dest, content, err => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            }
        });
    });
}

// ----------------------------------------------------------------------------
// Copy
// ----------------------------------------------------------------------------
function copyAll(src, dest) {
    console.log("Copying...");
    return new Promise((resolve, reject) => {
        fse.copy(src, dest, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

fse.emptyDir(tempDir)
.then(() => downloadFile(gameIconsUrl, tempFilePath))
.then(() => unzipAll(tempFilePath, tempDir))
.then(() => copyAll(tempDir, imgDir))
.then(() => copyAll(customIconDir, imgDir))
.then(() => processAll(imgDir))
.then(() => generateCSS(imgDir, cssPath))
.then(() => generateJS(imgDir, jsPath))
.then(() => console.log("Done."))
.catch(err => {
    console.error(err.message);
    process.exit(1);
});
