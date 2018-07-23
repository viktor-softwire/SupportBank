const XMLparser = require('xml-parser');
const loggerMessages = require('./loggerMessages');

module.exports = function(rawFile) {
    loggerMessages.logDebug('Parsing string as XML');

    try {
        // Turn it into JSON
        const rawTransactionList = XMLparser(rawFile);
        const rawObjects = rawTransactionList.root.children;

        // Getting the array representation
        const recordsArray = [];
        for(let i = 0; i < rawObjects.length; i++) {
            const rawRecord = rawObjects[i];
            const recordDate = rawRecord.attributes.Date;
            const recordNarrative = rawRecord.children[0].content;
            const recordValue = rawRecord.children[1].content;
            const recordParties = rawRecord.children[2].children;
            const recordFrom = recordParties[0].content;
            const recordTo = recordParties[1].content;

            const currentArray = [recordDate, recordFrom, recordTo, recordNarrative, recordValue];
            recordsArray[i] = currentArray;
            
        }

        return recordsArray;
    
    } catch(err) {
        loggerMessages.logError('Could not parse file as JSON; error message:');
        loggerMessages.logError(`${err.message}`);
        return null;
    } 
}
