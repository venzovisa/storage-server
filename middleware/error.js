const winston = require('winston');
const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.Console()
    ]
});

module.exports = function(err, req, res, next){
    logger.error(err.message, err);
    res.status(500).send('Error while getting data');
};