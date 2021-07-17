const modal = document.getElementById('userModal');
const formUser = document.getElementById('formUser');
const showModal = (user) => {
    if(!localStorage.getItem('user')) {
        modal.style.display = 'flex';
        return user;
    } else {
        modal.style.display = 'none';
        user = localStorage.getItem('user');
        return user;
    }
}

export default showModal;