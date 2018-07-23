const readFiles = require('./readFiles');
const CVSparser = require('./CVSparser');
const JSONparser = require('./JSONparser');
const XMLparser = require('./XMLparser');
const loggerMessages = require('./loggerMessages');
const Transaction = require('./Transaction');

module.exports = function(fileName) {

    const rawFile = readFiles(fileName);
    
    if (fileName.substr(-3) === 'csv') {
        loggerMessages.logDebug('CSV format detected');
        const rawData = CVSparser(rawFile);
        return Transaction.createTransactions(rawData);
    }

    if (fileName.substr(-3) === 'xml') {
        loggerMessages.logDebug('XML format detected');
        const rawData = XMLparser(rawFile);
        return Transaction.createTransactions(rawData);
    }

    if (fileName.substr(-4) === 'json') {
        loggerMessages.logDebug('JSON format detected');
        const rawData = JSONparser(rawFile); 
        return Transaction.createTransactions(rawData);   
    }

    // Non-accepted format
    loggerMessages.logFatal('Not accepted file format');
    return null;
}