const socket = window.io();

window.onbeforeunload = () => {
  socket.disconnect();
};

let nome;

const dataTest = 'data-testid';
const textinput = '.textinput';

document.querySelector('.messageForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const chatMessage = document.querySelector(textinput).value;
  let nickname;
  if (nome) nickname = nome; 
  if (!nome) nickname = socket.id; 
  socket.emit('message', { chatMessage, nickname });
  document.querySelector(textinput).value = '';
});

const createMessage = (message) => {
  const messageContainer = document.querySelector('.messagesContainer');
  const li = document.createElement('li');
  li.setAttribute(dataTest, 'message');
  li.innerText = message;
  messageContainer.appendChild(li);
};

socket.on('message', (data) => createMessage(data));

document.querySelector('.nicknameBox').addEventListener('submit', (e) => {
  e.preventDefault();
  const nickname = document.querySelector('.username').value;
  socket.emit('updateNick', nickname); 
  document.querySelector(textinput).value = ''; 
});

socket.on('updateNick', (nick) => {
  nome = nick;
});

const lista = document.querySelector('.listausuarios');

const updateUsers = (users) => {
  const result = users.find((user) => user.id === socket.id.slice(0, 16));
  const resultIndex = users.findIndex((user) => user.id === socket.id.slice(0, 16));
  users.unshift(result);
  users.splice(resultIndex + 1, 1);
  
  lista.innerHTML = '';
  users.forEach((element) => {
    const user = document.createElement('li');
    user.setAttribute(dataTest, 'online-user');
    user.innerText = element.name !== '' ? element.name : element.id;
    lista.appendChild(user);
  });
};

socket.on('updateUsers', (data) => updateUsers(data));

const messageHistory = (data) => {
  const messageContainer = document.querySelector('.messagesContainer');
  messageContainer.innerHTML = '';
data.forEach(({ message, nickname, timestamp }) => {
  const li = document.createElement('li');
  li.setAttribute(dataTest, 'message');
  const messageFormat = `${timestamp}-${nickname}: ${message}`;
  li.innerText = messageFormat;
  messageContainer.appendChild(li);
});
};

socket.on('messageHistory', (data) => messageHistory(data));

socket.on('disconnectList', (data) => updateUsers(data));
