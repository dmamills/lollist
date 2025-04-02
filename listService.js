const { createClient } = require('redis');
const LIST_KEY = process.env['LIST_KEY'] || 'LIST_KEY';

const createConnection = async () => {
  const client = await createClient()
  .on('error', err => console.log('Redis Client Error', err))
  .connect();
  return client;
}

const withClient = (fn) => async (...args) => {
  const client = await createConnection()
  try {
    return await fn(client, ...args);
  } catch(e) {
    console.log(e);
    return
  } finally {
    await client.quit();
  }
}

const addToList = withClient(async (client, name) => client.lPush(LIST_KEY, name));
const removeFromList = withClient(async (client, name) => client.lRem(LIST_KEY, 0, name));
const assignNextUser = withClient(async (client) => client.rPopLPush(LIST_KEY, LIST_KEY));
const getList = withClient((client) => client.lRange(LIST_KEY, 0, -1))
const addToListWithUserNames = withClient(async (client, names) => {
  await addToList(names.name);
  return client.set(`USER_${names.name}`, JSON.stringify(names));
});
const getUserByName = withClient(async (client, name) => {
  const value = await client.get(`USER_${name}`)
  if(value) {
    try {
    return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return {};
})

module.exports = {
  createConnection,
  getList,
  addToList,
  removeFromList,
  assignNextUser,
  addToListWithUserNames,
  getUserByName,
}
