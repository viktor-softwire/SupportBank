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

        this.date = moment(dateString, 'DD/MM/YYYY');

        if (!this.date.isValid()) {

            try {

                // Try different fomrat (neccessary since also parsing JSON)
                this.date = moment(dateString)

                if (!this.date.isValid()) {
                    // If still not valid
                    loggerMessages.loggWarn(`Invaild date (or wrong format): ${dateString}`, logger);
                }

            } catch(err) {
                loggerMessages.logWarn(`Invaild date (or wrong format): ${dateString}`, logger);
            }
        }   

        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.ammount = moneyConverter.convertMoneyStringToInt(amountStrig);
    
    }

}

function createTransactions(records) {

    // Creating an array of tranactions
    const len = records.length;
    const transactions = [];
    loggerMessages.logDebug(`Length of transactions (including header): ${len}`);

    // Iterating from 1 (first row is header)
    for (let i = 1; i < len; i++) {
        transactions[i] = new Transaction(records[i]);
    }

    loggerMessages.logDebug('Transactions have been successfully parsed');
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
