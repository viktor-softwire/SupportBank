const loggerMessages = require('./loggerMessages');

module.exports = function(rawFile) {
    
    // Parsing to [[TRANSACTION-DETAILS], ...]
    loggerMessages.logDebug('Parsing string as JSON');

    try {
        const records = JSON.parse(rawFile);
        const recordsArray = records.map(record => {
            return {date: record.Date, from: record.FromAccount, to: record.ToAccount, narrative: record.Narrative, value: record.Amount};
        });
               
        return recordsArray;

    } catch(err) {
        loggerMessages.logError('Could not parse file as JSON; error message:');
        loggerMessages.logError(`${err.message}`);
        return null;
    } 
}