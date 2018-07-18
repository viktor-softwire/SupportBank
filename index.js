const readLine = require(`readline-sync`);
const fs = require(`fs`);
const parse = require('csv-parse/lib/sync');
const moment = require(`moment`);

const fileName = `Transactions2014.csv`;

class Transaction {
    constructor(transactionDetails) {
        this.date = moment(transactionDetails[0], `DD/MM/YYYY`);
        this.from = transactionDetails[1];
        this.to = transactionDetails[2];
        this.narrative = transactionDetails[3];
        this.ammount = convertMoneyStringToInt(transactionDetails[4]);
    }
}

class User {
    constructor(name) {
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


console.log(`Please select mode: `);
console.log(`(List All  or  List [Account])`);
const response = readLine.prompt();

if (response === `List All`) {
    const tranactions = parseCSV(fileName);
    getAllUsers(tranactions);
} else if (response.substring(0, 5) === `List `) {
    const userName = response.substring(5); 
    const tranactions = parseCSV(fileName);
    getUser(userName, tranactions);
} else {
    console.log(`Wrong mode of operation`);
}

// Logs specific user's bank account
function getUser(name, tranactions) {
    const users = calculateAccounts(tranactions);
    if (users.has(name)) {
        users.get(name).logAccount();
    } else {
        console.log(`User not found`);
    }
}



// Logs all users' bank accounts
function getAllUsers(tranactions) {
    const users = calculateAccounts(tranactions);
    
    users.forEach(function(value, key, map) {
        value.logAccount();
    });
}

function parseCSV(fileName) {
    // Reading csv file to string
    const rawFile = fs.readFileSync(fileName, `utf8`);

    // Parsing to [[TRANSACTION-DETAILS], ...]
    const records = parse(rawFile);

    // Creating an array of tranactions
    const len = records.length;
    const transactions = new Array(len);
    for (let i = 0; i < len; i++) {
        transactions[i] = new Transaction(records[i]);
    }

    return transactions;

}

// Returns the created accounts in a Map object
function calculateAccounts(transactions) {

    // Storing all previously encountered users
    const accounts = new Map();

    // Going through every transaction
    const len = transactions.length;
    for (i = 1; i < len; i++) {

        const current = transactions[i];

        // Deduct from `from`
        if (accounts.has(current.from)) {
            accounts.get(current.from).deduct(current.ammount);
        } else {
            newUser = new User(current.from);
            newUser.deduct(current.ammount);
            accounts.set(current.from, newUser);
        }

        // Then add to `to`
        if (accounts.has(current.to)) {
            accounts.get(current.to).add(current.ammount);
        } else {
            newUser = new User(current.to);
            newUser.add(current.ammount);
            accounts.set(current.to, newUser);
        }

    }
    
    // List all accounts
    return accounts;
}

// Converts money from "xx.yy" to xxyy (int)
function convertMoneyStringToInt(amt) {
    const parts = amt.split(`.`);
    if (parts.length === 2) {
        if ((+parts[0]) < 0) {
            return (+parts[0])*100 - (+parts[1]);
        } else {
            return (+parts[0])*100 + (+parts[1]);
        }
    } else {
        return (+parts[0])*100;
    }
}


// Converts money from xxyy (int) to "xx.yy"
function convertMoneyIntToString(amt) {
    if (amt < 0) {
        amt = -amt;
        const pennies = amt % 100;
        const pounds = (amt - pennies) / 100;
        return `-${pounds}.${pennies}`;
    } else {
        const pennies = amt % 100;
        const pounds = (amt - pennies) / 100;
        return `${pounds}.${pennies}`;
    }
}