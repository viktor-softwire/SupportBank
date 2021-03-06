'use strict';

const readLine = require('readline-sync');

const Transaction = require('./Transaction');
const User = require('./User');
const loadDocument = require('./loadDocument');
const logMessages = require('./loggerMessages');

const fileName = `Transactions2014.csv`;

logMessages.configureLogger();

logMessages.logDebug('Application has started');

// Selecting operation mode
console.log('Please select mode: ');
console.log('(List All  or  List [Account]  or  Export File [FileName])');
const response = readLine.prompt();

logMessages.logDebug(`User has entered operation mode: ${response}`);

// Selecting operation mode
if (response === 'List All') {
    logMessages.logDebug('User input has been matched to List All');
    const transactions = loadDocument(fileName);
    User.getAllUsers(transactions);

} else if (response.substring(0, 5) === 'List ') {
    logMessages.logDebug('User input has been mathced to List [NAME]');
    const userName = response.substring(5); 
    logMessages.logDebug(`User has inputted name: ${userName}`);
    const transactions = loadDocument(fileName);
    User.getUser(userName, transactions);

} else if (response.substring(0, 11) === 'Export File') {
    logMessages.logDebug('User input has been mathced to Export File [NAME]');
    const outputFileName = response.substring(11);
    logMessages.logDebug(`User has inputted export file name ${outputFileName}`);
    const transactions = loadDocument(fileName);
    Transaction.exportTransactions(transactions, outputFileName);

} else {

    // Not recognized command
    logMessages.logDebug('User input has not been recognized');
    console.log('Wrong mode of operation');
}

