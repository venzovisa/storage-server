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

// For parsing incoming POST data
//const fs = require('fs');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
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

const port = process.env.PORT || 3000;
//const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

// JSON File Read/Write
// let movies;
//
// fs.open('data.json', 'r', (err, fd) => {
//     if (err) throw err;
//
//     fs.readFile('data.json', 'utf8',(err, data) => {
//         if (err) throw err;
//         movies = JSON.parse(data);
//         const isMovie = movies.data.movies.find(item =>
//                 item.title.toLowerCase() === body.title.toLowerCase()
//         );
//         movies.data.movies.push(body);
//         movies = JSON.stringify(movies);
//
//         if (!isMovie){
//             fs.writeFile('data.json', movies, 'utf8', (err) => {
//                 if (err) throw err;
//                 console.log('The new movie has been added!');
//                 res.sendStatus(201);
//             });
//         }
//         else {
//             console.log('The movie already exist!');
//             res.sendStatus(304);
//         }
//
//     });
//
//     fs.close(fd, (err) => {
//         if (err) throw err;
//     });
//
// });




