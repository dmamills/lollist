const { createClient } = require('redis');
const LIST_KEY = process.env['LIST_KEY'] || 'LIST_KEY';
const USER_KEY = 'USER_';

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
const assignNextUser = withClient(async (client) => client.rPopLPush(LIST_KEY, LIST_KEY));
const getList = withClient((client) => client.lRange(LIST_KEY, 0, -1))

const removeFromList = withClient(async (client, name) => {
  await client.lRem(LIST_KEY, 0, name)
  return client.del(`${USER_KEY}${name}`);
});

const addToListWithUserNames = withClient(async (client, names) => {
  await addToList(names.name);
  return client.set(`${USER_KEY}${names.name}`, JSON.stringify(names));
});

const getUserByName = withClient(async (client, name) => {
  const value = await client.get(`${USER_KEY}${name}`)
  if(value) {
    try {
    return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return {};
});

const getListWithFullUserInfo = async () => {
  const users = await getList();
  const userPromises = users.map(u => getUserByName(u));
  return Promise.all(userPromises).then((values) => 
    values.map((user, index) => ({
        ...user,
        name: users[index],
    })
  ));
};

const userExists = withClient(async (client, name) => client.exists(`${USER_KEY}${name}`))

module.exports = {
  createConnection,
  getList,
  addToList,
  removeFromList,
  assignNextUser,
  addToListWithUserNames,
  getUserByName,
  getListWithFullUserInfo,
  userExists
}
