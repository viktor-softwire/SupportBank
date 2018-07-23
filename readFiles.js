const fs = require('fs');
const loggerMessages = require('./loggerMessages')

module.exports = function(fileName) {

    loggerMessages.logDebug(`Trying to load file: ${fileName}`);

    // Reading json file to string
    try {
        return fs.readFileSync(fileName, 'utf8');
    } catch (err) {
        loggerMessages.logError(`Could not open ${fileName}; error message:`);
        loggerMessages.logError(`${err.message}`);
        return null;
    }
}