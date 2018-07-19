const readFiles = require('./readFiles');
const CVSparser = require('./CVSparser');
const JSONparser = require('./JSONparser');
const XMLparser = require('./XMLparser');
const loggerMessages = require('./loggerMessages');
const TransactionsLib = require('./TransactionsLib');

module.exports = function(fileName, logger) {

    const rawFile = readFiles(fileName, logger);
    
    if (fileName.substr(-3) === 'csv') {
        loggerMessages.logDebug('CSV format detected', logger);
        const rawData = CVSparser(rawFile, logger);
        return TransactionsLib.createTransactions(rawData, logger);
    }

    if (fileName.substr(-3) === 'xml') {
        loggerMessages.logDebug('XML format detected', logger);
        const rawData = XMLparser(rawFile, logger);
        return TransactionsLib.createTransactions(rawData, logger);
    }

    if (fileName.substr(-4) === 'json') {
        loggerMessages.logDebug('JSON format detected', logger);
        const rawData = JSONparser(rawFile, logger); 
        return TransactionsLib.createTransactions(rawData, logger);   
    }

    // Non-accepted format
    loggerMessages.logFatal('Not accepted file format', logger);
    return null;
}