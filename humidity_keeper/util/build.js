const fs = require('fs-extra');
const childProcess = require('child_process');


try {
    // Remove current build
    fs.removeSync('./dist/');
    // Copy front-end files
    //fs.copySync('./src/public', './dist/public');
    //fs.copySync('./src/views', './dist/views');
    fs.copySync('../humidity_keeper_app/dist', './dist/app-dist');
    // Transpile the typescript files
    childProcess.exec('tsc --build tsconfig.prod.json');
} catch (err) {
    console.log(err);
}
