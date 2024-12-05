const router = require('express').Router()
const User = require('../models/user.js')
const Recipe = require('../models/recipe.js')
//routes
router.get('/', async (req, res) => {
  res.render('recipes/index.ejs')
})
router.get('/new', async (req, res) => {
  res.render('recipes/new.ejs')
})
module.exports = router