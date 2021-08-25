const express = require('express');
const { getUsers, addUser, deleteUser, updateUser } = require('../repository');
const router = express.Router();

router.use(function timeLog(req, res, next) {
  next();
});

router.get('/', async (req, res) => {
  const { name } = req.query;
  if (name) {
    const lookingUsers = await getUsers(name);
    if (lookingUsers.length) {
      res.status(200).send(lookingUsers);
    } else {
      res.status(200).send({ message: 'User not found' });
    }
  } else {
    const allUsers = await getUsers();
    res.status(200).send(allUsers);
  }
});

router.get('/:id', async (req, res) => {
  const users = await getUsers();
  const user = users.find((u) => u.id === +req.params.id);
  if (user) {
    res.send(user);
  } else {
    res.send(404);
  }
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (name.trim()) {
    const addResponse = await addUser({ name, isBanned: false });
    const users = await getUsers();
    res.status(200).send(users);
  } else {
    res.status(404).send({ error: 'User should have a name' });
  }
});

router.delete('/', async (req, res) => {
  const { id } = req.query;
  if (id) {
    const response = await deleteUser(id);
    res.status(200).send({ success: 'Deleted' });
  } else if (!id) {
    res.status(404).send({ error: 'User should have id!' });
  }
});

router.put('/', async (req, res) => {
  const { id, name, isBanned } = req.body;
  const updatedDoc = await updateUser(id, name, isBanned);
  res.status(200).send(updatedDoc);
});

module.exports = router;
