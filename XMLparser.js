const XMLparser = require('xml-parser');
const loggerMessages = require('./loggerMessages');

module.exports = function(rawFile) {
    loggerMessages.logDebug('Parsing string as XML');

    try {
        // Turn it into JSON
        const rawTransactionList = XMLparser(rawFile);
        const rawObjects = rawTransactionList.root.children;

        // Getting the array representation
        const recordsArray = rawObjects.map(rawRecord => {

            const recordDate = rawRecord.attributes.Date;
            const recordNarrative = rawRecord.children[0].content;
            const recordValue = rawRecord.children[1].content;
            const recordParties = rawRecord.children[2].children;
            const recordFrom = recordParties[0].content;
            const recordTo = recordParties[1].content;

            const currentArray = {date: recordDate, from: recordFrom, to: recordTo, narrative: recordNarrative, value: recordValue};
            return currentArray;
            
        });

        return recordsArray;
    
    } catch(err) {
        loggerMessages.logError('Could not parse file as JSON; error message:');
        loggerMessages.logError(`${err.message}`);
        return null;
    } 
}
