const conn = require('./connection');

const COL = 'messages';

const addMessage = async (message, timestamp) => {
  const messageFormat = {
    message: message.chatMessage,
    nickname: message.nickname,
    timestamp,
  };
  const add = await conn().then((db) => db.collection(COL).insertOne(messageFormat));

  return add.ops[0];
};

const msgHistory = async () => {
  const result = await conn().then((db) => db.collection(COL).find().toArray());
  return result;
};

module.exports = {
  addMessage, msgHistory,
};