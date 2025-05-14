const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  name: { type: String, required: false },
  duration: Number,
  calories: Number,
  photo: String,
  exp: Number,
  date: String,
});

const UserSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  password: String,
  monster: String,
  monsterImg: String,
  exp: Number,
  workouts: [WorkoutSchema],
});

module.exports = mongoose.model('User', UserSchema);
