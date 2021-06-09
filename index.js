const express = require('express');
let app = express();
require('./config');
const config = require('config');
const error = require('./middleware/error');
const winston = require('winston');
require('./middleware/prod.js')(app);
// Request logger
app.use(require('morgan')('tiny'));
// Skip cross origin browser restriction
app.use(require('cors')());
app.use(require('./routes.js'));
app.use(error);
app.use(express.json());

//const urlParse = require('url');
const mongoose = require('mongoose');

process.on('uncaughtException', (ex) =>{
    winston.error(ex.message, ex);
    process.exit(1);
});

winston.exceptions.handle(new winston.transports.File({filename: 'uncaughtExceptions.log'}));

process.on('unhandledRejection', (ex) => {
    console.log('Unhandled rejection');
    winston.error(ex.message, ex);
});

if(!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined ');
    process.exit(1);
}

const mongoOptions = {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    autoCreate: true,
}

mongoose.connect(`${config.get('db_url')}`, mongoOptions)
    .then(() =>  {
		if(process.env.NODE_ENV === "production") console.log('Connected to production database');
		else console.log('Connected to development database');
	})
    .catch(err => console.error('Error while connecting DB: ', err));

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});


