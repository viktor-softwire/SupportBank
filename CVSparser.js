const parse = require('csv-parse/lib/sync');
const loggerMessages = require('./loggerMessages');

module.exports = function(rawFile, logger) {

    // Parsing to [[TRANSACTION-DETAILS], ...]
    loggerMessages.logDebug('Parsing string as CVS', logger);
    try {
        const records = parse(rawFile);
        return records;

    } catch(err) {
        loggerMessages.logError('Could not parse file as CVS; error message:', logger);
        loggerMessages.logError(`${err.message}`, logger);
        return null;
    }
}