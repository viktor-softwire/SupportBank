'use strict';

const readLine = require('readline-sync');
const fs = require('fs');
const log4js = require('log4js');
const logger = log4js.getLogger('logs\\debug.log');
const TransactionsLib = require('./TransactionsLib');
const UsersLib = require('./UsersLib');
const loadDocument = require('./loadDocument');
const fileName = `Transactions2012.xml`;

// Logging config
log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs\\debug.log', level: 'debug' } ,
        console: { type: 'console'}, 
        severity : { type: 'logLevelFilter', appender: 'console', level: 'warn'}
    },
    categories: {
        default: { appenders: ['file', 'severity'], level: 'debug'}
    }
});

logger.debug('Application has started');

// Selecting operation mode
console.log('Please select mode: ');
console.log('(List All  or  List [Account]  or  Export File [FileName])');
const response = readLine.prompt();

logger.debug(`User has entered operation mode: ${response}`);

// Selecting operation mode
if (response === 'List All') {
    logger.debug('User input has been matched to List All');
    const transactions = loadDocument(fileName, logger);
    UsersLib.getAllUsers(transactions, logger);

} else if (response.substring(0, 5) === 'List ') {
    logger.debug('User input has been mathced to List [NAME]');
    const userName = response.substring(5); 
    logger.debug(`User has inputted name: ${userName}`);
    const transactions = loadDocument(fileName, logger);
    UsersLib.getUser(userName, transactions, logger);

} else if (response.substring(0, 11) === 'Export File') {
    logger.debug('User input has been mathced to Export File [NAME]');
    const outputFileName = response.substring(11);
    logger.debug(`User has inputted export file name ${outputFileName}`);
    const transactions = loadDocument(fileName, logger);
    TransactionsLib.exportTransactions(transactions, outputFileName);

} else {

    // Not recognized command
    logger.debug('User input has not been recognized');
    console.log('Wrong mode of operation');
}

