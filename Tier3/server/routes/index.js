const { Router } = require('express');

const favourites = require('./favourites');

const router = new Router();

router.get('/test', (req, res) => res.send('ok'));

router.get('/favourite', favourites.getAll);

// router.get('/favourite/:id*?', favourites.getById);

module.exports = router;
