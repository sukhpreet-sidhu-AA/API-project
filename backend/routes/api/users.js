const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth, authorization } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('firstName')
    .exists({ checkFalsy:true })
    .isLength({ min: 1, max: 20})
    .withMessage('First Name is required'),
  check('lastName')
    .exists({ checkFalsy:true })
    .isLength({ min: 1, max: 20})
    .withMessage('Last Name is required'),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;

    const existingUser = await User.findAll({
      raw:true,
      where:{
        [Op.or]:{
          username,
          email
        }
      },
      attributes: [ 'id', 'username', 'firstName', 'lastName', 'email' ]
    })
    
    // console.log(existingUser);

    if(existingUser.length !== 0) {
      const err = new Error('User already Exists');
      err.message = 'User already exists'
      err.status = 500;
      err.errors = {}

      existingUser.forEach(ele => {
        if(ele.username === username)
          err.errors.username = 'User with that username already exists';
        if(ele.email === email)
          err.errors.email = 'User with that email already exists';
      })

      return next(err)
    }
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, hashedPassword, firstName, lastName });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);







module.exports = router;