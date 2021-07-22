const path = require('path');
require('dotenv').config();

const express = require('express');
const app = express();

const socketIO = require('socket.io');


// settings
app.set('port', process.env.PORT || 3001);


// static files
app.use(express.static(path.join(path.parse(__dirname).dir, '/public')));


// start server
const server = app.listen(app.get('port'), (err) => {
    if(err) console.error('Error', errr);

    console.log(`Server running on http://localhost:${app.get('port')}`);
});

const io = socketIO(server);
// Web sockets
require('./sockets.js')(io);
// database connection
require('./database.js');