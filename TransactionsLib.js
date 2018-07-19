const moment = require('moment');
const loggerMessages = require('./loggerMessages');
const moneyConverter = require('./moneyConverter');
const fs = require('fs');

class Transaction {
    constructor(transactionDetails, logger) {

        if (transactionDetails.length !== 5) {
            loggerMessages.logFatal('Wrong number of parameters for Transaction constructor\n' +
                                `(have ${transactionDetails.length} instead of 5)`, logger)
        }

        const [dateString, from, to, narrative, amountStrig] = transactionDetails;

        this.date = parseTime(dateString, logger);
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.ammount = moneyConverter.convertMoneyStringToInt(amountStrig, logger);
    
    }

}

function parseTime(dateString, logger) {
    
    // CVS format
    date = moment(dateString, 'DD/MM/YYYY');

    if (!date.isValid()) {

        // If no. days since 1900-01-01 (XML format)
        if (Number.isInteger(+dateString)) {

            const baseDate = moment('19000101');
            return date = baseDate.add((+dateString), 'days');

        }

        // Otherwise
        try {

            // Try different fomrat (neccessary since also parsing JSON and XML)
            date = moment(dateString)

            if (!date.isValid()) {
                // If still not valid
                loggerMessages.loggWarn(`Invaild date (or wrong format): ${dateString}`, logger);
            }

        } catch(err) {
            loggerMessages.logWarn(`Invaild date (or wrong format): ${dateString}`, logger);
        }
    }
       

}

function createTransactions(records, logger) {

    // Creating an array of tranactions
    const len = records.length;
    const transactions = [];
    loggerMessages.logDebug(`Length of transactions (including header): ${len}`, logger);

    // Iterating from 1 (first row is header)
    for (let i = 1; i < len; i++) {
        transactions[i] = new Transaction(records[i], logger);
    }

    loggerMessages.logDebug('Transactions have been successfully parsed', logger);
    return transactions;
}

// Exports an array of transactions into JSON format
function exportTransactions(tranactions, outputFileName, logger) {

    loggerMessages.logDebug('Starting to write out transactions', logger);
    const outputJSON = JSON.stringify(tranactions.slice(1));    // Slicing needed because first entry is null (header line)
    
    try {
        fs.writeFileSync(outputFileName, outputJSON, 'utf-8');
        loggerMessages.logDebug('Transactions have been successfully written out', logger);
    } catch(err) {
        loggerMessages.logError(`Cannot write transactions to ${outputFileName}; error message: `, logger);
        loggerMessages.logError(err, logger);
        console.log('Transactions could not have been written out');
    }

}

module.exports = {Transaction, createTransactions, exportTransactions};
