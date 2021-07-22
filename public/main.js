// Importamos la libreria socket io del lado del cliente
const socket = io();

// seleccionamos los elementos de la interfaz para poder manipularlos
const messages = document.getElementById('messages');

const form = document.getElementById('form');
const input  = document.getElementById('input');

const userView = document.getElementById('userView');

const actions = document.getElementById('actions');

const modal = document.getElementById('userModal');
const inputUser = document.getElementById('inputUser');
const modalWarning = document.getElementById('modal-warning');

const usersList = document.getElementById('usersList');


// Iniciamos la variable del usuario
let user = null;


// Evento is typing
input.addEventListener('keypress', e => {
    socket.emit('chat:typing', user);
});

socket.on('chat:typing', user => {
    actions.innerHTML = `<em>${user} is typing something...</em>`
});


// Evento message
form.addEventListener('submit', (e) => {
    e.preventDefault();

    let msg = input.value.trim();

    if(msg === '') return;

    let message = {
        user: user,
        content: msg,
    }

    if(input.value) {
        socket.emit('chat:message', message);
        input.value = '';
    }
});

socket.on('chat:message', msg => {
    actions.innerHTML = '';
    let item = document.createElement('li');
    item.innerHTML = `<div><strong>${msg.user}</strong>: ${msg.content}</div>`;
    messages.appendChild(item);
});

// Evento error en el whisper
socket.on('chat:error', err => {
    if(!err) return;
    actions.innerHTML = err;
});

// Evento whisper
socket.on('whisper', msg => {
    actions.innerHTML = '';
    let item = document.createElement('li');
    item.innerHTML = `<div class="whisper"><i><strong>${msg.user}</strong>: ${msg.content}</i></div>`;
    messages.appendChild(item);
});


// Evento new user connected
formUser.addEventListener('submit', e => {
    e.preventDefault();
    user = inputUser.value.trim();

    if(user === '' || user.length < 3) {
        modal.style.display = 'flex';
        modalWarning.style.display = 'block';
        modalWarning.textContent = 'Username must have at least 3 characters';
        return;
    }

    socket.emit('user:connect', user, data => {
        if(data) {
            modal.style.display = 'none';
            modalWarning.style.display = 'none';
            usersList.innerHTML='';

            userView.innerHTML = `You're logged as <strong>${user}</strong>`;
        } else {
            modal.style.display = 'flex';
            modalWarning.style.display = 'block';
            modalWarning.textContent = 'That user is already on the chat';
        }
    });
});

document.addEventListener('DOMContentLoaded', e => {
    modal.style.display = 'flex';
});

// Evento actualizar la lista de usuarios
socket.on('user:update', (users) => {
    usersList.innerHTML='';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        usersList.appendChild(li);
    });
});

// Cargando mensajes viejos
socket.on('chat:oldmsgs', data => {
    for(let i = 0 ; i < data.length; i++) {
        let item = document.createElement('li');
        item.innerHTML = `<div><strong>${data[i].user}</strong>: ${data[i].message}</div>`;
        messages.appendChild(item);
    }
});