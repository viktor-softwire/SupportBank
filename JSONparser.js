const loggerMessages = require('./loggerMessages');

module.exports = function(rawFile) {
    
    // Parsing to [[TRANSACTION-DETAILS], ...]
    loggerMessages.logDebug('Parsing string as JSON');

    try {
        const records = JSON.parse(rawFile);
        const recordsArray = [];

        // Turning JSON ojects into arrays
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const currentArray = [record.Date, record.FromAccount, record.ToAccount, record.Narrative, record.Amount];

            // Include the header row in CSV
            recordsArray[i+1] = currentArray;
        }
        
        return recordsArray;

    } catch(err) {
        loggerMessages.logError('Could not parse file as JSON; error message:');
        loggerMessages.logError(`${err.message}`);
        return null;
    } 
}