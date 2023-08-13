const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const createDOMPurify = require('dompurify');
const crypto = require('crypto');
const { JSDOM } = require('jsdom');
const User = require('../../models/user');

const router = express.Router();

// Configure mongoose promises
mongoose.Promise = global.Promise;

// GET to /checksession
router.get('/checksession', (req, res) => {
  if (req.user) {
    return res.send(JSON.stringify(req.user));
  }
  return res.send(JSON.stringify({}));
});

// Get to /logout
router.get('/logout', (req, res) => {
  req.logout();
  return res.send(JSON.stringify(req.user));
});

// Post to /login
router.post('/login', async (req, res) => {
  // look up the user by theyr email
  const query = User.findOne({ email: req.body.email });
  const foundUser = await query.exec();

  // if they exist, they'll have a username, so add that to our body
  if (foundUser) { req.body.username = foundUser.username; }

  passport.authenticate('local')(req, res, () => {
    // if logged in, we should have user info to send back
    if (req.user) {
      return res.send(JSON.stringify(req.user));
    }
    //Otherwise return an error
    return res.send(JSON.stringify({ error: 'There was an error logging in' }));
  });
});

// Post to /register
router.post('/register', async (req, res) => {
  // First, check and make sure the email doesn't already exist
  const query = User.findOne({ email: req.body.email });
  const foundUser = await query.exec();
  if (foundUser) { return res.send(JSON.stringify({ error: 'Email or username already exists' })); }

  // Creat a user object to save, using values from incoming JSON
  if (!foundUser) {
    // sanitize data
    const window = (new JSDOM('')).window;
    const DOMPurify = createDOMPurify(window)
    const sanitizedBody = {
      username: DOMPurify.sanitize(req.body.username),
      email: DOMPurify.sanitize(req.body.email),
      firstName: DOMPurify.sanitize(req.body.firstName),
      lastName: DOMPurify.sanitize(req.body.lastName),
      password: DOMPurify.sanitize(req.body.password)
    };

    const newUser = new User(sanitizedBody);

    // Save, via passport's "register" method, the user
    return User.register(newUser, req.body.password, (err) => {
      // if there's a problem, send back a JSON object with the error
      if (err) {
        return res.send(JSON.stringify({ error: err.message }));
      }
      // Otherwise log them in
      return passport.authenticate('local')(req, res, () => {
        // if logged in, we should have user info to send back
        if (req.user) {
          return res.send(JSON.stringify(req.user));
        }
        // Otherwise return an error
        return res.send(JSON.stringify({ error: 'There was an error registering user' }));
      });
    });
  }
  //return an error if all else fails
  return res.send(JSON.stringify({ error: 'There was an error refistering the user' }));
});

// POST to savepassword
router.post('/savepassword', async (req, res) => {
  let result;
  try {
    // Look up user in the DB based on reset hash
    const query = User.findOne({ passwordReset: req.body.hash });
    const foundUser = await query.exec();

    // If the user exists save their new password
    if (foundUser) {
      // User passport's built-in password set method
      foundUser.setPassword(req.body.password, (err) => {
        if (err) {
          result = res.send(JSON.stringify({ error: 'Password could not be saved. Please try again' }));
        } else {
          // Once the password's set, save the user object
          foundUser.save({}).then((error) => {
            if (error) {
              result = res.send(JSON.stringify({ error: 'Password could not be saved. Please try again' }));
            } else {
              // Send a success message
              result = res.send(JSON.stringify({ sucess: true }));
            }
          });
        }
      });
    } else {
      result = res.send(JSON.stringify({ error: 'Reset hash not found in database. '}));
    }
  } catch (err) {
    result = res.send(JSON.stringify({ error: 'There was an error connecting to the database.'}));
  }
  return result;
});



module.exports = router;
