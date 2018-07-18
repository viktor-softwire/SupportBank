const readLine = require(`readline-sync`);
const fs = require(`fs`);
const parse = require('csv-parse/lib/sync');
const moment = require(`moment`);



class Transaction {
    constructor(transactionDetails) {
        this.date = moment(transactionDetails[0], `DD/MM/YYYY`);
        this.from = transactionDetails[1];
        this.to = transactionDetails[2];
        this.narrative = transactionDetails[3];
        this.ammount = transactionDetails[4];
    }
}

console.log(`Please select mode: `);
console.log(`(List All  or  List [Account])`);
// const response = readLine.prompt();

parseCSV();


class User {
        constructor(name) {
        this.name = name;

    }
}


function parseCSV() {
    // Reading csv file to string
    const rawFile = fs.readFileSync(`Transactions2014.csv`, `utf8`);

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



function listAccount() {

}