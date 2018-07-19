const fs = require('fs');

module.exports = function(fileName, logger) {

    logDebug(`Trying to load file: ${fileName}`, logger);

    // Reading json file to string
    try {
        return fs.readFileSync(fileName, 'utf8');;
    } catch (err) {
        logError(`Could not open ${fileName}; error message:`, logger);
        logError(`${err.message}`, logger);
        return null;
    }
}

function logDebug(msg, logger) {
    if (!logger) {
        logger.debug(msg);
    }
}

function logError(msg, logger) {
    if (!logger) {
        logger.error(msg);
    }
}