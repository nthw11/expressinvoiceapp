import express from 'express'
import User from '../models/User.js'
import { loginValidation, newUserValidation } from '../util/loginValidation.js'
import {
  genPassword,
  validatePassword,
  issueJWT,
} from '../auth/auth.js'
import { verifyToken } from '../auth/verifyToken.js'

const router = express.Router()

router
  //POST Login existing user
  .post('/', async (req, res, next) => {
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    const { username, password } = req.body

    await User.findOne({ username: username })
      // .populate('invoices')
      .then(async (user) => {
        if (!user) {
          res.status(401).send('could not find user')
        } else {
          const passCheck = await validatePassword(password, user.password)
          if (!passCheck) {
            res.status(401).send('password is incorrect')
          } else {
            const userMinusPassword = {
              _id: user._id,
              username: user.username,
              firstName: user.userInfo.firstName,
              lastName: user.userInfo.lastName,
              phone: user.userInfo.phone,
              email: user.email,

              streetAddress: user.userInfo.address.streetAddress,
              city: user.userInfo.address.city,
              state: user.userInfo.address.state,
              zipCode: user.userInfo.address.zip,
              invoices: user.invoices,
            }
            const token = issueJWT(user)
            res.json({ user: userMinusPassword, token: token }).status(200)
          }
        }
      })
  })

  //POST Register new user
  .post('/register', async (req, res, next) => {
    const { username, firstName, lastName, email, phone, password, streetAddress, city, state, zip } =
      req.body
    const { error } = newUserValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const dupEmailCheck = await User.findOne({ email: email })
    if (dupEmailCheck)
      return res.status(400).send('email already exists in database')

    const hashedPassword = await genPassword(password)

    await User.create({
      username: username,
      email: email,
      userInfo: {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: {
          streetAddress: streetAddress,
          city: city,
          state: state,
          zip: zip,
        },
      },
      password: hashedPassword,
    })
      .then((user) => {
        const userMinusPassword = {
          _id: user._id,
          username: user.username,
          firstName: user.userInfo.firstName,
          lastName: user.userInfo.lastName,
          phone: user.userInfo.phone,
          email: user.email,
          streetAddress: user.userInfo.address.streetAddress,
          city: user.userInfo.address.city,
          state: user.userInfo.address.state,
          zipCode: user.userInfo.address.zip,
          invoices: user.invoices,
        }
        const token = issueJWT(user)
        res.json({ user: userMinusPassword, token: token }).status(200)
      })

  })

export default router
