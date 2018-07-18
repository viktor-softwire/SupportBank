'use strict';

const readLine = require('readline-sync');
const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger('logs\\debug.log');

const fileName = `Transactions2013.json`;

// Logging config
log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs\\debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

// Each instance represents one tranaction (one line in file)
class Transaction {
    constructor(transactionDetails) {

        if (transactionDetails.length !== 5) {
            logger.fatal('Wrong number of parameters for Transaction constructor\n' +
                                `(have ${transactionDetails.length} instead of 5)`)
        }

        const [dateString, from, to, narrative, amountStrig] = transactionDetails;

        this.date = moment(dateString, 'DD/MM/YYYY');

        if (!this.date.isValid()) {
            
            // Try different fomrat (neccessary since also parsing JSON)
            this.date = moment(dateString)
            if (!this.date.isValid()) {
                // If still not valid
                logger.warn(`Invaild date (or wrong format): ${dateString}`);
            }
        }

        this.from = from;
        this.to = to;
        this.narrative = narrative;
        this.ammount = convertMoneyStringToInt(amountStrig);
    }
}


// Each instance represents one user, account = balance
class User {
    constructor(name) {
        logger.debug(`Created User instance ${name}`);
        this.name = name;
        this.account = 0;
    }

    deduct(ammount) {
        this.account -= ammount;
    }

    add(ammount) {
        this.account += ammount;
    }

    logAccount() {
        const convertedAccount = convertMoneyIntToString(this.account);
        console.log(`${this.name} has ${convertedAccount} in the bank`);
    }

}

// Selecting operation mode

logger.debug('Application has started');

console.log('Please select mode: ');
console.log('(List All  or  List [Account])');
const response = readLine.prompt();

logger.debug(`User has entered operation mode: ${response}`);

if (response === 'List All') {
    logger.debug('User input has been matched to List All');
    const transactions = loadDocument(fileName);
    getAllUsers(transactions);

} else if (response.substring(0, 5) === 'List ') {
    logger.debug('User input has been mathced to List [NAME]');
    const userName = response.substring(5); 
    logger.debug(`User has inputted name: ${userName}`);
    const transactions = loadDocument(fileName);
    getUser(userName, transactions);

} else {
    logger.debug('User input has not been recognized');
    console.log('Wrong mode of operation');
}

function loadDocument(fileName) {
    logger.debug(`Trying to load file: ${fileName}`);

    // Reading json file to string
    let rawFile;
    try {
        rawFile = fs.readFileSync(fileName, 'utf8');
    } catch (err) {
        logger.error(`Could not open ${fileName}; error message:`);
        logger.error(`${err.message}`);
        return null;
    }

    if (fileName.substr(-3) === 'csv') {
        logger.debug('CSV format detected');
        return parseCSV(rawFile);
    }

    if (fileName.substr(-4) === 'json') {
        logger.debug('JSON format detected');
        return parseJSON(rawFile);    
    }

    // Non-accepted format
    logger.fatal('Not accepted file format')
    return null;
    
}


// Logs specific user's bank account
function getUser(name, tranactions) {
    logger.debug(`Getting account information on ${name}`);
    const users = calculateAccounts(tranactions);
    if (users.has(name)) {
        logger.debug('User has been found');
        users.get(name).logAccount();
    } else {
        logger.debug('User has not been found');
        console.log('User not found');
    }
}



// Logs all users' bank accounts
function getAllUsers(transactions) {
    logger.debug(`Getting all users' info`);
    const users = calculateAccounts(transactions);
    
    logger.debug('Starting to print out users\' info');
    users.forEach(function(value) {
        value.logAccount();
    });
}


function createTransactions(records) {

    // Creating an array of tranactions
    const len = records.length;
    const transactions = [];
    logger.debug(`Length of transactions (including header): ${len}`);

    // Iterating from 1 (first row is header)
    for (let i = 1; i < len; i++) {
        transactions[i] = new Transaction(records[i]);
    }

    logger.debug('Transactions have been successfully parsed');
    return transactions;
}

function parseJSON(rawFile) {

    // Parsing to [[TRANSACTION-DETAILS], ...]
    logger.debug('Parsing string as JSON');

    try {
        const records = JSON.parse(rawFile);
        const recordsArray = [];

        // Turning JSON ojects into arrays
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const currentArray = [record.Date, record.FromAccount, record.ToAccount, record.Narrative, record.Amount];

            // Include the header row in CSV
            recordsArray[i+1] = currentArray;
        }
        
        return createTransactions(recordsArray);

    } catch(err) {
        logger.error(`Could not parse file as JSON; error message:`);
        logger.error(`${err.message}`);
        return null;
    } 
}

function parseCSV(rawFile) {

    // Parsing to [[TRANSACTION-DETAILS], ...]
    logger.debug('Parsing string as CVS');
    try {
        const records = parse(rawFile);
        return createTransactions(records);

    } catch(err) {
        logger.error(`Could not parse file as CVS; error message:`);
        logger.error(`${err.message}`);
        return null;
    }

}

// Returns the created accounts in a Map object
function calculateAccounts(transactions) {

    logger.debug('Started calculating accounts');

    // Storing all previously encountered users
    const accounts = new Map();

    // Going through every transaction
    const len = transactions.length;

    // Starting iterating from 1 - first row is undefined (i.e. header)
    for (let i = 1; i < len; i++) {

        const current = transactions[i];
        logger.debug(`Started processing transaction ${current.from} -> ${current.to} £${convertMoneyIntToString(current.ammount)}\n` + 
                        `@${current.date} message: ${current.narrative}`);

        // Deduct from `from`
        if (accounts.has(current.from)) {
            logger.debug(`Deducting ${current.ammount} from ${current.from}`);
            accounts.get(current.from).deduct(current.ammount);
        } else {
            logger.debug(`Adding new user ${current.from} to Map`);
            const newUser = new User(current.from);
            logger.debug(`Deducting ${current.ammount} from ${current.from}`);
            newUser.deduct(current.ammount);
            accounts.set(current.from, newUser);
        }

        // Then add to `to`
        if (accounts.has(current.to)) {
            logger.debug(`Adding ${current.ammount} to ${current.to}`);
            accounts.get(current.to).add(current.ammount);
        } else {
            logger.debug(`Adding new user ${current.to} to Map`);
            const newUser = new User(current.to);
            logger.debug(`Adding ${current.ammount} to ${current.to}`);
            newUser.add(current.ammount);
            accounts.set(current.to, newUser);
        }

    }
    
    logger.debug('Transactions have been processed');
    // List all accounts
    return accounts;
}

// Converts money from "xx.yy" to xxyy (int)
function convertMoneyStringToInt(amt) {
    logger.debug(`Converting ${amt} to int`);
    const parts = String(amt).split(`.`);
    
    if (isNaN(amt)) {
        logger.error(`Trying to convert non-money format: ${amt}`);
        return null;
    }
    
    if ((parts.length === 0) || (parts.length > 2)) {
        logger.error(`Invalid format: ${amt}`);
    }

    const pence = parts[1] || 0;
    const sign = (+parts[0]) < 0 ? -1 : 1;
    const result = (+parts[0])*100 + sign*(+pence);
    logger.debug(`Result of conversion: ${result}`); 
    return result;
}


// Converts money from xxyy (int) to "xx.yy"
function convertMoneyIntToString(amt) {
    
    logger.debug(`Converting ${amt} to string`);

    if (!Number.isInteger(amt)) {
        logger.error(`Trying to convert a non-integer number: ${amt}`);
        return null;
    }


    if (typeof(amt) !== 'number') {
        logger.fatal('Trying to a convert not a number');
    }

    const sign = amt < 0 ? '-' : '';
    const amtToUse = Math.abs(amt);


    const pennies = amtToUse % 100;
    const pounds = (amtToUse - pennies) / 100;
    logger.debug(`Result of conversion: ${sign}${pounds}.${pennies}`);
    return `${sign}${pounds}.${pennies}`;


}