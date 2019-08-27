const fs = require('fs');
const path = require('path');

const { readDirDeepSync } = require('read-dir-deep');


function replaceExtension(dir) {
    for (const oldFile of readDirDeepSync(dir)) {
        const newFile = oldFile.replace(/.js$/, '.mjs');
        if (newFile !== oldFile) {
            fs.renameSync(oldFile, newFile);
        }
    }
}

function manifest(pkg) {
    if (pkg.source) {
        pkg.source = pkg.source.replace(/^dist-src\/(.+)\.js$/i, 'dist-src/$1.mjs');
    }
    if (pkg.module) {
        pkg.module = pkg.module.replace(/^dist-web\/(.+)\.js$/i, 'dist-web/$1.mjs');
    }
    delete pkg.devDependencies;
    return pkg;
}

function afterJob(buildOptions) {
    ['dist-src', 'dist-web'].forEach(dir => {
        const root = path.join(buildOptions.out, dir);
        if (fs.existsSync(root)) {
            replaceExtension(root);
        }
    });
}

exports.manifest = manifest;
exports.afterJob = afterJob;
