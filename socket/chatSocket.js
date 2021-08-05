const MODEL = require('../models/model');

const currentData = () => {
  let today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  const hour = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();
  today = `${month}-${day}-${year} ${hour}:${minutes}:${seconds}`;

  return today;
};

const userList = [];

const messageListener = (socket, io) => {
  socket.on('message', async (message) => {
    const timestamp = currentData();
    await MODEL.addMessage(message, timestamp);
    io.emit('message', `${timestamp}-${message.nickname}: ${message.chatMessage}`);
  });
};

const disconnectListener = (socket, io) => {
  socket.on('disconnect', () => {
    const user = userList.findIndex((e) => e.id === socket.id.slice(0, 16));
    userList.splice(user, 1);
    io.emit('updateUsers', userList);
  });
};

const updateNickName = (socket, io) => {
  socket.on('updateNick', (nickname) => {
    const index = userList.findIndex((user) => user.id === socket.id.slice(0, 16)); 

    userList.splice(index, 1, {
      id: socket.id.slice(0, 16),
      name: nickname,
    });
    socket.emit('updateNick', nickname);
    io.emit('updateUsers', userList);
  });
};

module.exports = (io) => io.on('connection', async (socket) => {
  const randomName = socket.id.slice(0, 16); 
  userList.unshift({ id: randomName, name: '' }); 
  io.emit('updateUsers', userList);
  const messageHistory = await MODEL.msgHistory();
  io.emit('messageHistory', messageHistory); 
  messageListener(socket, io); 
  updateNickName(socket, io);
  disconnectListener(socket, io);
});