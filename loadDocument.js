const readFiles = require('./readFiles');
const CVSparser = require('./CVSparser');
const JSONparser = require('./JSONparser');
const XMLparser = require('./XMLparser');
const loggerMessages = require('./loggerMessages');
const Transaction = require('./Transaction');

module.exports = function(fileName) {

    const rawFile = readFiles(fileName);
    
    let parser;
    if (fileName.substr(-3) === 'csv') {
        loggerMessages.logDebug('CSV format detected');
        parser = CVSparser
    }

    if (fileName.substr(-3) === 'xml') {
        loggerMessages.logDebug('XML format detected');
        parser = XMLparser;
    }

    if (fileName.substr(-4) === 'json') {
        loggerMessages.logDebug('JSON format detected');
        parser = JSONparser; 
    }

    
    // Non-accepted format
    if (!parser) {
        loggerMessages.logFatal('Not accepted file format');
        return null;
    }

    const rawData = parser(rawFile);
    return Transaction.createTransactions(rawData);
}