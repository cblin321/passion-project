//auth imports
import passport from "passport"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

//service imports
import * as user_service from "../services/user_service.js"

//backend imports
import express from "express"

const indexRouter = express.Router()

indexRouter.post("/login", passport.authenticate("local", { session: false }), (req, res) => {
    const email = req.body.email
    const user = { email }
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ token })
})

indexRouter.post("/signup", async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    console.log(email, password)
    const hashed = await bcrypt.hash(password, 10)
    try {
        const user = await user_service.add_one(email, hashed)
        if (user.password !== hashed || user.email !== email)
            next(new Error("Database error"))
        const token = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET)
        res.json({ token })
    } catch (err) {
        next(err)
    }
})

export default indexRouter
