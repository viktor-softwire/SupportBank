const parse = require('csv-parse/lib/sync');
const loggerMessages = require('./loggerMessages');

module.exports = function(rawFile) {

    // Parsing to [[TRANSACTION-DETAILS], ...]
    loggerMessages.logDebug('Parsing string as CVS');
    try {
        const records = parse(rawFile);
        return records.map(record => {
            return {date: record[0], from: record[1], to: record[2], narrative: record[3], value: record[4]};
        });

    } catch(err) {
        loggerMessages.logError('Could not parse file as CVS; error message:');
        loggerMessages.logError(`${err.message}`);
        return null;
    }
}