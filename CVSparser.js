const parse = require('csv-parse/lib/sync');
const loggerMessages = require('./loggerMessages');

module.exports = function(rawFile) {

    // Parsing to [[TRANSACTION-DETAILS], ...]
    loggerMessages.logDebug('Parsing string as CVS');
    try {
        const records = parse(rawFile);
        return records;

    } catch(err) {
        loggerMessages.logError('Could not parse file as CVS; error message:');
        loggerMessages.logError(`${err.message}`);
        return null;
    }
}