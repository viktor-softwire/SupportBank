const log4js = require('log4js');
const logger = log4js.getLogger('logs\\debug.log');


function configureLogger() {
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
}

function logTrace(msg) {
    logger.trace(msg);
}

function logDebug(msg) {
    logger.debug(msg)
}

function logWarn(msg) {
    logger.warn(msg);
}

function logError(msg) {
    logger.error(msg);
}

function logFatal(msg) {
    logger.fatal(msg);
}

module.exports = {logTrace, logDebug, logWarn, logError, logFatal, configureLogger}