// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
      check('firstName') // Validation for firstName
      .exists({ checkFalsy: true })
      .withMessage('Please provide a first name.'),
    check('lastName') // Validation for lastName
      .exists({ checkFalsy: true })
      .withMessage('Please provide a last name.'),
    handleValidationErrors
  ];


// sign up
  router.post('/', validateSignup, async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;

    try {
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
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Determine the field that caused the unique constraint error
            const isEmailError = error.errors.some(err => err.path === 'email');
            const isUsernameError = error.errors.some(err => err.path === 'username');

            let errors = {};
            if (isEmailError) {
                errors.email = 'User with that email already exists.';
            }
            if (isUsernameError) {
                errors.username = 'User with that username already exists.';
            }

            return res.status(400).json({
                message: "User already exists.",
                errors: errors
            });
        } else {
            // Pass other types of errors to the error-handling middleware
            next(error);
        }
    }
});

module.exports = router;
