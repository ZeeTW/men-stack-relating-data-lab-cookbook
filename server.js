const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const session = require('express-session')
const passUsertoView = require('./middleware/pass-user-to-view')
const app = express()

const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')

//port config
const PORT = process.env.PORT ? process.env.PORT : '3000'

// data connection
mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log(`connected to MongoDB Database: ${mongoose.connection.name}`)
})

//middlewares
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSIONS_SECRET,
    resave: false,
    saveUnintialized: true
  })
)
app.use(passUsertoView)

//require controllers
const authCtrl = require('./controllers/auth')
const isSignedIn = require('./middleware/is-signed-in')
const recipesController = require('./controllers/recipes.js')
const ingredientsController = require('./controllers/ingredients.js')

//Use controller
app.use('/auth', authCtrl)
app.use('/recipes', recipesController)
app.use('/ingredients', ingredientsController)
app.use(isSignedIn);
//root route
app.get('/', async (req, res) => {
  res.render('index.ejs')
})

//Route for testing

//listen for the HTTP requests
app.listen(PORT, () => {
  console.log(`Auth App is listening for requests on port ${PORT}`)
})
