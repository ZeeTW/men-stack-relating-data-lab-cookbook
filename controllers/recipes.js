const router = require('express').Router()
const User = require('../models/user.js')
const Recipe = require('../models/recipe.js')
const Ingredient = require('../models/ingredient.js')
const isSignedIn = require('../middleware/is-signed-in.js')
//routes

router.get('/', isSignedIn, async (req,res)=>{
  const user = req.session.user._id
  console.log(user)
  const recipes = await Recipe.find({owner: user})
  console.log(recipes)
  res.locals.recipes = recipes
  console.log("Recipes being sent to the view:", recipes)
  res.render('recipes/index.ejs', {recipes})
})

router.get('/new', async (req, res) => {
  const ingredient = await Ingredient.find()
  res.render('recipes/new.ejs', { ingredient })
})
router.post('/', async (req, res) => {
  try {
    req.body.owner = req.session.user._id
    const newRecipe = new Recipe(req.body)
    // newRecipe.owner = req.session.user._id
    await newRecipe.save()
    res.redirect('/recipes')
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})

router.get('/:recipeId', isSignedIn, async (req,res)=>{
  const recipe = await Recipe.findById(req.params.recipeId).populate('ingredients')
  res.locals.recipe = recipe
  res.render('recipes/show.ejs')
})

router.delete('/:recipeId', isSignedIn, async(req,res)=>{
  await Recipe.deleteOne({ _id: req.params.recipeId, owner: req.session.user._id })
  res.redirect('/recipes')
})

router.get('/:recipeId/edit', isSignedIn, async(req,res)=>{
  const recipe = await Recipe.findById(req.params.recipeId)
  const ingredients = await Ingredient.find()
  res.render('recipes/edit.ejs',{recipe, ingredients})
})

router.put('/:recipeId', isSignedIn, async(req,res)=>{
  const recipe = await Recipe.findByIdAndUpdate(req.params.recipeId,req.body)
  await recipe.save()
  res.redirect(`/recipes/${recipe._id}`)
})

module.exports = router