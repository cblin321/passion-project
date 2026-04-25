//service imports
import * as user_service from "./services/user_service.js"

//auth imports
import passport from "passport"
import bcrypt from "bcryptjs"
import { Strategy as local_strategy } from "passport-local"
import { Strategy as jwt_strategy, ExtractJwt as extract_jwt } from "passport-jwt"

//server 
import express from "express"
import cors from "cors"
import indexRouter from "./routers/indexRouter.js"
import fileRouter from "./routers/fileRouter.js"

// env
import dotenv from "dotenv"
dotenv.config()
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN


const app = express()

const origin = new RegExp(`^https?://([a-z0-9-]+\\.)*${FRONTEND_ORIGIN.replace(".", "\\.")}$`)
app.use(cors({ origin }))
app.use((req, res, next) => {
    next()
})
//app.use(cors())

// boilerplate
app.use(passport.initialize())
app.use(express.urlencoded({ extended: false, limit: "50mb" }))
app.use(express.json({ limit: "50mb" }))
//app.use(cors())

// passport config
const jwt_opts = {
    jwtFromRequest: extract_jwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: ACCESS_TOKEN_SECRET,
}
const local_opts = {
    usernameField: "email",
    passwordField: "password"
}
passport.use(new jwt_strategy(jwt_opts, async (jwt_payload, done) => {
    const email = jwt_payload.email
    try {
        const user = await user_service.find_one_by_email(email)
        return done(null, user)
    } catch (err) {
        console.log(err)
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

app.use("/", indexRouter)
app.use("/file", fileRouter)

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message })
})

app.listen(3000)

