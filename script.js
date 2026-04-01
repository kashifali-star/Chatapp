const socket = io();

const chat = document.getElementById('chat');
const input = document.getElementById('input');

const username = localStorage.getItem('username');
if(!username) window.location = "index.html";

// Load old messages
fetch('/messages')
.then(res => res.json())
.then(data => {
    data.forEach(m => addMsg(`${m.username}: ${m.text}`));
});

// Send message
function sendMsg(){
    const msg = input.value.trim();
    if(!msg) return;

    const data = { username, text: msg };

    socket.emit('chat message', data);

    fetch('/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    input.value = '';
}

// Receive messages
socket.on('chat message', (data) => {
    addMsg(`${data.username}: ${data.text}`);
});

function addMsg(msg){
    const p = document.createElement('p');
    p.innerText = msg;
    chat.appendChild(p);
    chat.scrollTop = chat.scrollHeight;
}
