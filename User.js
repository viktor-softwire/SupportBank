const loggerMessages = require('./loggerMessages');
const moneyConverter = require('./moneyConverter');

// Each instance represents one user, account = balance
class User {
    constructor(name) {
        loggerMessages.logDebug(`Created User instance ${name}`);
        this.name = name;
        this.account = 0;
    }

    updateAccount(ammount) {
        this.account += ammount;
    }

    deduct(ammount) {
        this.account -= ammount;
    }

    add(ammount) {
        this.account += ammount;
    }

    logAccount() {
        const convertedAccount = moneyConverter.convertMoneyIntToString(this.account);
        console.log(`${this.name} has ${convertedAccount} in the bank`);
    }

}

// Logs specific user's bank account
function getUser(name, transactions) {
    loggerMessages.logDebug(`Getting account information on ${name}`);
    const users = calculateAccounts(transactions);
    const user = users.get(name);
    if (user) {
        loggerMessages.logDebug('User has been found');
        user.logAccount();
    } else {
        loggerMessages.logDebug('User has not been found');
        console.log('User not found');
    }
}

// Logs all users' bank accounts
function getAllUsers(transactions) {
    loggerMessages.logDebug('Getting all users\' info');
    const users = calculateAccounts(transactions);
    
    loggerMessages.logDebug('Starting to print out users\' info');
    users.forEach(function(value) {
        value.logAccount();
    });
}

// Returns the created accounts in a Map object
function calculateAccounts(transactions) {

    loggerMessages.logDebug('Started calculating accounts');

    // Storing all previously encountered users
    const accounts = new Map();

    // Going through every transaction
    const len = transactions.length;

    // Starting iterating from 1 - first row is undefined (i.e. header)
    for (let i = 1; i < len; i++) {

        const current = transactions[i];
        loggerMessages.logDebug(`Started processing transaction ${current.from} -> ${current.to} £${moneyConverter.convertMoneyIntToString(current.ammount)}\n` + 
                        `@${current.date} message: ${current.narrative}`);

        // Deduct from `from`
        processTrasactionForUser(current.from, accounts, -current.ammount);
        
        // Then add to `to`
        processTrasactionForUser(current.to, accounts, current.ammount);

    }
    
    loggerMessages.logDebug('Transactions have been processed');
    // List all accounts
    return accounts;
}

function processTrasactionForUser(accountName, accounts, ammount) {
    const currentAccount = accounts.get(accountName);

    // Already in Map
    if (currentAccount) {
        loggerMessages.logTrace(`Changing ${currentAccount} with ${ammount}`);
        currentAccount.updateAccount(ammount);

    // Insert into map
    } else {
        loggerMessages.logTrace(`Adding new user ${accountName} to Map`);
        const newUser = new User(accountName);
        loggerMessages.logTrace(`Changing ${currentAccount} with ${ammount}`);
        newUser.updateAccount(ammount);
        accounts.set(accountName, newUser);
    }

}

module.exports = {User, getUser, getAllUsers}