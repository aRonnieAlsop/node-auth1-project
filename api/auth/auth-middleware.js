/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/

const User = require('../users/users-model')

const restricted = (req, res, next) => {
  console.log('restricted')
  next()
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
const checkUsernameFree = async (req, res, next) => {
  try {
    const users = await User.findBy({ username: req.body.username })
    if (!users.length) next()
    else next({ status: 422, message: 'Username taken' })
  } catch (err) {
    next(err) // need to have custom build middleware there or otherwise express will send to a default location
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
const checkUsernameExists = async (req, res, next) => {
  try {
    const users = await User.findBy({ username: req.body.username })
    if (!users.length) next({ status: 401, message: 'Invalid credentials' })
    else next()
  } catch (err) {
    next(err)
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
const checkPasswordLength = (req, res, next) => {
  if (!req.body.password || req.body.password.length <= 3) {
    next({ status: 422, message: 'Password must be longer than 3 chars'})
  } else {
    next()
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,

}