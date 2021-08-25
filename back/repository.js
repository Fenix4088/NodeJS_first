const { writeJSONToFile } = require('./utils/fs');
const { readJSONFromFile } = require('./utils/fs');
const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  name: String,
  isBanned: Boolean
});
const User = mongoose.model('User', usersSchema);

const lessons = [
  { id: 1, name: 'Lesson1' },
  { id: 2, name: 'Lesson2' },
];

const getUsers = (name) => {
  if(name) {
    return User.find({name: new RegExp(`${name}`,'i')})
  }
  return User.find()
};

const addUser = async (user) => {
  const newUser = new User(user);
  return newUser.save();
};

const deleteUser = async (id) => {
  return User.deleteOne({_id: id})
};


const updateUser = async (id, name, isBanned) => {
  return User.findByIdAndUpdate(id, {name, isBanned}, {new: true})
}

const getLessons = () => {
  return lessons;
};

module.exports = {
  getUsers,
  addUser,
  getLessons,
  deleteUser,
  updateUser
};
