const fs = require('fs');
const loggerMessages = require('./loggerMessages')

module.exports = function(fileName, logger) {

    loggerMessages.logDebug(`Trying to load file: ${fileName}`, logger);

    // Reading json file to string
    try {
        return fs.readFileSync(fileName, 'utf8');
    } catch (err) {
        loggerMessages.logError(`Could not open ${fileName}; error message:`, logger);
        loggerMessages.logError(`${err.message}`, logger);
        return null;
    }
}