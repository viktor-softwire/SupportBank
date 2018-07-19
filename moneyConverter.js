const loggerMessages = require('./loggerMessages');

// Converts money from "xx.yy" to xxyy (int)
function convertMoneyStringToInt(amt, logger) {
    loggerMessages.logTrace(`Converting ${amt} to int`, logger);
    const parts = String(amt).split(`.`);
    
    if (isNaN(amt)) {
        loggerMessages.logError(`Trying to convert non-money format: ${amt}`, logger);
        return null;
    }
    
    if ((parts.length === 0) || (parts.length > 2)) {
        loggerMessages.logError(`Invalid format: ${amt}`, logger);
    }

    const pence = parts[1] || 0;
    const sign = (+parts[0]) < 0 ? -1 : 1;
    const result = (+parts[0])*100 + sign*(+pence);
    loggerMessages.logTrace(`Result of conversion: ${result}`, logger); 
    return result;
}


// Converts money from xxyy (int) to "xx.yy"
function convertMoneyIntToString(amt, logger) {
    
    loggerMessages.logTrace(`Converting ${amt} to string`, logger);

    if (!Number.isInteger(amt)) {
        loggerMessages.logError(`Trying to convert a non-integer number: ${amt}`, logger);
        return null;
    }


    if (typeof(amt) !== 'number') {
        loggerMessages.logFatal('Trying to a convert not a number', logger);
    }

    const sign = amt < 0 ? '-' : '';
    const amtToUse = Math.abs(amt);


    const pennies = amtToUse % 100;
    const pounds = (amtToUse - pennies) / 100;
    loggerMessages.logTrace(`Result of conversion: ${sign}${pounds}.${pennies}`, logger);
    return `${sign}${pounds}.${pennies}`;


}


module.exports = {convertMoneyIntToString, convertMoneyStringToInt}