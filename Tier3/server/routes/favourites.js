const router = require('express').Router();
const User = require('../models/users');

router.get('/', async (req, res) => {
  console.log('getting user:', req.user);
  let success = true;
  let favs = [];
  try {
    const user = await User.findOne({ _id: req.user._id });
    favs = user.favourites.map(f => ({
      name: f.name,
    }));
  } catch (e) {
    success = false;
  }
  res.json({ favs, success });
});

router.post('/:name*?', async (req, res) => {
  let success = true;
  try {
    const user = await User.findOne({ _id: req.user._id });
    user.favourites = user.favourites.concat(req.body.name);
    user.save();
  } catch (e) {
    success = false;
  }
  res.json({ success });
});

module.exports = router;
