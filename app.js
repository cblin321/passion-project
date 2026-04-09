//service imports
import * as user_service from "./services/user_service.js"
//auth imports
import passport from "passport"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Strategy as local_strategy } from "passport-local"
import { Strategy as jwt_strategy, ExtractJwt as extract_jwt } from "passport-jwt"
//express imports
import express from "express"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const jwt_opts = {
    jwtFromRequest: extract_jwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: ACCESS_TOKEN_SECRET,
}
const local_opts = {
    usernameField: "email",
    passwordField: "password"
}
app.use(passport.initialize())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
passport.use(new jwt_strategy(jwt_opts, async (jwt_payload, done) => {
    const id = jwt_payload.sub
    try {
        const user = await user_service.find_one_by_id(id)
        return done(null, user)
    } catch (err) {
        return done(err, false)
    }
}))
passport.use(new local_strategy(local_opts, async (email, password, done) => {
    try {
        const user = await user_service.find_one_by_email(email)
        const password_match = await bcrypt.compare(password, user.password)
        if (!password_match)
            return done(null, false, { message: "Incorrect password" })
        return done(null, user)
    } catch (err) {
        return done(err, false)
    }
}))
app.listen(3000)
app.post("/login", passport.authenticate("local", { session: false }), (req, res) => {
    const email = req.body.email
    const user = { email }
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ token })
})
app.post("/sign-up", async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const hashed = await bcrypt.hash(password, 10)
    try {
        const user = await user_service.add_one(email, hashed)
        if (user.password !== hashed || user.email !== email)
            res.status(500).json({ message: "Database error" })
        const token = jwt.sign({ email }, ACCESS_TOKEN_SECRET)
        res.json({ token })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
