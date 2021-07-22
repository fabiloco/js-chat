const path = require('path');
const express = require('express');
const app = express();

const socketIO = require('socket.io');

const mongoose = require('mongoose');

const Chat = require('./models/Chat.js');

// db connection
mongoose.connect('mongodb://localhost/chat-database', {useNewUrlParser: true})
    .then(db => {
        console.log('db is connected');
    })
    .catch( err => console.log(err));

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


let users = {};

// websockets
io.on('connection', async (socket) => {

    let messages = await Chat.find({});
    socket.emit('chat:oldmsgs', messages);

    socket.on('chat:message', async (msg) => {

        let message = msg.content.trim();

        if(message.substr(0, 3) === '/w ') {
            message = message.substr(3);
            
            const index = message.indexOf(' ');
            if(index !== -1) {
                var name = message.substring(0, index);
                message = message.substring(index + 1);

                if(name in users) {
                    users[name].emit('whisper', {
                        content: message,
                        user: socket.user,
                    });
                } else {
                    console.log('no se encontro el usuario');
                }
            } else {
                console.log('no se encontro mensaje');
            }
        } else {
            let newMessage = new Chat({
                user: socket.user,
                message: msg.content,
            });

            await newMessage.save();

            io.emit('chat:message', msg);
        }
    });

    socket.on('chat:typing', (msg) => {
        socket.broadcast.emit('chat:typing', msg);
    });

    socket.on('user:connect', (user, cb) => {
        if(user in users) {
            cb(false);
            console.log(user,'user already exist on the chat');
        } else {
            cb(true);
            console.log(user,'user connected');
            socket.user = user;
            users[socket.user] = socket;
            updateUsers();
        }
    });

    socket.on('disconnect', () => {
        console.log(socket.user, 'disconnected');
        if(!socket.user)
            return;
        
        delete users[socket.user];

        updateUsers();
    });

    const updateUsers = () => {
        io.emit('user:update', Object.keys(users));
    }
});