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

    let message = {
        user: user,
        content: input.value,
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

// Evento whisper
socket.on('whisper', msg => {
    console.log(msg);
    actions.innerHTML = '';
    let item = document.createElement('li');
    item.innerHTML = `<div class="whisper"><i><strong>${msg.user}</strong>: ${msg.content}</i></div>`;
    messages.appendChild(item);
});


// Evento new user connected
formUser.addEventListener('submit', e => {
    e.preventDefault();
    user = inputUser.value.trim();

    socket.emit('user:connect', user, data => {
        if(data) {
            modal.style.display = 'none';
            modalWarning.style.display = 'none';
            usersList.innerHTML='';

            userView.innerHTML = `You're logged as <strong>${user}</strong>`;
        } else {
            modal.style.display = 'flex';
            modalWarning.style.display = 'block';
        }
    });
});

document.addEventListener('DOMContentLoaded', e => {
    modal.style.display = 'flex';
});

// Evento actualizar la lista de usuarios
socket.on('user:update', (users) => {
    console.log("hola", users);
    usersList.innerHTML='';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        usersList.appendChild(li);
    });
});

// Cargando mensajes viejos
socket.on('chat:oldmsgs', data => {
    console.log(data);
    for(let i = 0 ; i < data.length; i++) {
        let item = document.createElement('li');
        item.innerHTML = `<div><strong>${data[i].user}</strong>: ${data[i].message}</div>`;
        messages.appendChild(item);
    }
});