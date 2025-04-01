const express = require('express');
const router = express.Router();
const { getList, addToList, removeFromList, assignNextUser } = require('./listService');
const { validateLinks, validateName } = require('./validation');
const Publisher = require('./publisher');
const SlackPublisher = require('./publishers/slack-publisher');

const publisher = new Publisher();
new SlackPublisher(publisher);

router.get('/', async (req, res) => {
  const list = await getList();
  res.json({ list });
});

router.post('/register', validateName, async (req, res) => {
  const addedName = req.body.name;
  await addToList(addedName);
  const list = await getList();

  publisher.publish('register', {
    addedName,
    currentList: list
  });

  res.json({ list, addedName });
});

router.post('/remove', validateName, async (req, res) => {
  const removedName = req.body.name;
  await removeFromList(removedName);
  const list = await getList();

  publisher.publish('removed', {
    removedName,
    currentList: list
  });

  return res.status(200).json({ removedName, list });
});

router.post('/assign', validateLinks, async (req,res) => {
  const assignedUser = await assignNextUser();
  const links = req.body?.links;
  const currentList = await getList();

  publisher.publish('assignment', {
    assignedUser,
    assigned: links,
    currentList
  });

  res.status(200).json({ assignedUser, assigned: links, currentList });
});

module.exports = router;