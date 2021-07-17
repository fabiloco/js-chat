import showModal from './modal.js';

const socket = io();

const messages = document.getElementById('messages');

const form = document.getElementById('form');
const input  = document.getElementById('input');

const userView = document.getElementById('userView');

const actions = document.getElementById('actions');

let user = null;

input.addEventListener('keypress', e => {
    socket.emit('chat:typing', user);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let message = {
        user: user,
        content: input.value,
    }

    console.log(message);

    if(input.value) {
        socket.emit('chat:message', message);
        input.value = '';
    }
});

socket.on('chat:typing', user => {
    console.log(user + ' is typing..');
    actions.innerHTML = `<em>${user} is typing something...</em>`
});

socket.on('chat:message', msg => {
    actions.innerHTML = '';
    let item = document.createElement('li');
    item.innerHTML = `<div><strong>${msg.user}</strong>: ${msg.content}</div>`;
    messages.appendChild(item);
});



formUser.addEventListener('submit', e => {
    localStorage.setItem('user', inputUser.value);
});

window.addEventListener('DOMContentLoaded', (e) => {
    user = showModal(user);
    userView.innerHTML = `<div> You're logged as: <strong>${user}</strong> </div>`;
});