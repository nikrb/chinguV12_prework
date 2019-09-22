const mongoose = require('mongoose');
const { Schema } = mongoose;

const FavouriteSchema = new mongoose.Schema({
  user: String,
  song: String,
  // user: { type: Schema.Types.ObjectId, ref: 'User'},
  // song: { type: Schema.Types.ObjectId, ref: 'Song' },
});

module.exports = mongoose.model('Favourite', FavouriteSchema);
