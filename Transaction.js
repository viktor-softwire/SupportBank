const moment = require('moment');
const loggerMessages = require('./loggerMessages');
const moneyConverter = require('./moneyConverter');
const fs = require('fs');

class Transaction {
    constructor(transactionDetails) {

        if (transactionDetails.length !== 5) {
            loggerMessages.logFatal('Wrong number of parameters for Transaction constructor\n' +
                                `(have ${transactionDetails.length} instead of 5)`)
        }

        const [dateString, from, to, narrative, amountStrig] = transactionDetails;

        this.date = parseTime(dateString);
        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.ammount = moneyConverter.convertMoneyStringToInt(amountStrig);
    
    }

}

function parseTime(dateString) {
    
    // CVS format
    const date = moment(dateString, 'DD/MM/YYYY');

    if (!date.isValid()) {

        // If no. days since 1900-01-01 (XML format)
        if (Number.isInteger(+dateString)) {

            const baseDate = moment('19000101');
            return baseDate.add((+dateString), 'days');

        }

        // Otherwise
        try {

            // Try different fomrat (neccessary since also parsing JSON and XML)
            const newDate = moment(dateString)

            if (!newDate.isValid()) {
                // If still not valid
                loggerMessages.loggWarn(`Invaild date (or wrong format): ${dateString}`);
                return;
            } else {
                return newDate
            }

        } catch(err) {
            loggerMessages.logWarn(`Invaild date (or wrong format): ${dateString}`);
            return;
        }
    }
    
    return date;

}

function createTransactions(records) {

    // Creating an array of tranactions
    const len = records.length;
    const transactions = [];
    loggerMessages.logDebug(`Length of transactions (including header): ${len}`);

    // Iterating from 1 (first row is header)
    const slicedRecords = records.slice(1);
    slicedRecords.map(record => transactions.push(new Transaction(record)));
    
    loggerMessages.logDebug('Transactions have been successfully parsed');
    return transactions;
}

// Exports an array of transactions into JSON format
function exportTransactions(tranactions, outputFileName) {

    loggerMessages.logDebug('Starting to write out transactions');
    const outputJSON = JSON.stringify(tranactions.slice(1));    // Slicing needed because first entry is null (header line)
    
    try {
        fs.writeFileSync(outputFileName, outputJSON, 'utf-8');
        loggerMessages.logDebug('Transactions have been successfully written out');
    } catch(err) {
        loggerMessages.logError(`Cannot write transactions to ${outputFileName}; error message: `);
        loggerMessages.logError(err);
        console.log('Transactions could not have been written out');
    }

}

module.exports = {Transaction, createTransactions, exportTransactions};
