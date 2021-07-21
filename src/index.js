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


let users = ['fabi'];

// websockets
io.on('connection', (socket) => {

    socket.on('chat:message', (msg) => {
        io.emit('chat:message', msg);
    });

    socket.on('chat:typing', (msg) => {
        socket.broadcast.emit('chat:typing', msg);
    });

    socket.on('user:connect', (user, cb) => {
        if(users.includes(user)) {
            cb(false);
            console.log(user,'user already exist on the chat');
        } else {
            cb(true);
            users.push(user);
            console.log(user,'user connected');
            socket.user = user;
            updateUsers();
        }
    });

    socket.on('disconnect', () => {
        console.log(socket.user, 'disconnected');
        if(!users.includes(socket.user))
            return;
        
        let index = users.indexOf(socket.user);
        users.splice(index, 1);

        updateUsers();
    });

    const updateUsers = () => {
        io.emit('user:update', users);
    }
});

