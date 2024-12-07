const isSignedIn = (req, res, next) => {
  if (req.session.user) return next()
    console.log('user is signed in')
  res.redirect('/auth/sign-in')
}

module.exports = isSignedIn
