const Chat = require('./models/Chat.js');

module.exports = io => {

    let users = {};

    io.on('connection', async (socket) => {

        let messages = await Chat.find({});
        socket.emit('chat:oldmsgs', messages);

        socket.on('chat:message', async msg => {
            err = undefined;
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
                        err = 'Error! type a valid user';
                        io.emit('chat:error', err);
                    }
                } else {
                    err = 'Error! type a valid message';
                    io.emit('chat:error', err);
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

};