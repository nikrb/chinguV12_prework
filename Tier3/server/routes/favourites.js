const { Favourite } = require('../models');

async function getAll(req, res) {
  const favs = await Favourite.find({});
  const list = favs.map(f => ({
    _id: f._id,
    user: f.user,
    song: f.song,
  }));
  res.json({ list, success: true });
}

module.exports = { getAll };
