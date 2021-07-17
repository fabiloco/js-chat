const path = require('path');
const express = require('express');
const app = express();

const socketIO = require('socket.io');

// settings
app.set('port', process.env.PORT || 3000);


// static files
app.use(express.static(path.join(path.parse(__dirname).dir, '/public')));


// start server
const server = app.listen(app.get('port'), (err) => {
    if(err) console.error('Error', errr);

    console.log(`Server running on http://localhost:${app.get('port')}`);
});

const io = socketIO(server);

// websockets
io.on('connection', (socket) => {
    console.log('New connection: ', socket.id);
    socket.on('chat:message', (msg) => {
        io.emit('chat:message', msg);
    });

    socket.on('chat:typing', (msg) => {
        socket.broadcast.emit('chat:typing', msg);
    });
});