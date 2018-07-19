const loggerMessages = require('./loggerMessages');
const moneyConverter = require('./moneyConverter');

// Each instance represents one user, account = balance
class User {
    constructor(name, logger) {
        loggerMessages.logDebug(`Created User instance ${name}`, logger);
        this.name = name;
        this.account = 0;
    }

    deduct(ammount) {
        this.account -= ammount;
    }

    add(ammount) {
        this.account += ammount;
    }

    logAccount(logger) {
        const convertedAccount = moneyConverter.convertMoneyIntToString(this.account, logger);
        console.log(`${this.name} has ${convertedAccount} in the bank`);
    }

}

// Logs specific user's bank account
function getUser(name, tranactions, logger) {
    loggerMessages.logDebug(`Getting account information on ${name}`, logger);
    const users = calculateAccounts(tranactions);
    if (users.has(name)) {
        loggerMessages.logDebug('User has been found', logger);
        users.get(name).logAccount();
    } else {
        loggerMessages.logDebug('User has not been found', logger);
        console.log('User not found');
    }
}

// Logs all users' bank accounts
function getAllUsers(transactions, logger) {
    loggerMessages.logDebug('Getting all users\' info', logger);
    const users = calculateAccounts(transactions);
    
    loggerMessages.logDebug('Starting to print out users\' info', logger);
    users.forEach(function(value) {
        value.logAccount();
    });
}

// Returns the created accounts in a Map object
function calculateAccounts(transactions, logger) {

    loggerMessages.logDebug('Started calculating accounts', logger);

    // Storing all previously encountered users
    const accounts = new Map();

    // Going through every transaction
    const len = transactions.length;

    // Starting iterating from 1 - first row is undefined (i.e. header)
    for (let i = 1; i < len; i++) {

        const current = transactions[i];
        loggerMessages.logDebug(`Started processing transaction ${current.from} -> ${current.to} £${moneyConverter.convertMoneyIntToString(current.ammount)}\n` + 
                        `@${current.date} message: ${current.narrative}`, logger);

        // Deduct from `from`
        if (accounts.has(current.from)) {
            loggerMessages.logTrace(`Deducting ${current.ammount} from ${current.from}`, logger);
            accounts.get(current.from).deduct(current.ammount);
        } else {
            loggerMessages.logTrace(`Adding new user ${current.from} to Map`, logger);
            const newUser = new User(current.from);
            loggerMessages.logTrace(`Deducting ${current.ammount} from ${current.from}`, logger);
            newUser.deduct(current.ammount);
            accounts.set(current.from, newUser);
        }

        // Then add to `to`
        if (accounts.has(current.to)) {
            loggerMessages.logTrace(`Adding ${current.ammount} to ${current.to}`, logger);
            accounts.get(current.to).add(current.ammount);
        } else {
            loggerMessages.logTrace(`Adding new user ${current.to} to Map`, logger);
            const newUser = new User(current.to);
            loggerMessages.logTrace(`Adding ${current.ammount} to ${current.to}`, logger);
            newUser.add(current.ammount);
            accounts.set(current.to, newUser);
        }

    }
    
    loggerMessages.logDebug('Transactions have been processed', logger);
    // List all accounts
    return accounts;
}

module.exports = {User, getUser, getAllUsers}