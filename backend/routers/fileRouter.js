// server
import express from "express"

// auth 
import passport from "passport"

// services
import * as file_service from "../services/file_service.js"

const file_router = express.Router()

file_router.get("/create", passport.authenticate("jwt", { session: false, failWithError: true }), (req, res) => {
    res.json({
        id: req.user.id,
        email: req.user.email,
    })
})

file_router.post("/create", passport.authenticate("jwt", { session: false, failWithError: true }), async (req, res, next) => {
    const name = req.body.name
    const file = file_service.create_one(req.user.id, name)
    if (!(file.name === name && file.fileUsers?.length === 1))
        next(new Error("Database error"))

    const file_user = file.fileUsers[0]

    if (!(file_user.userId === req.user.id && file_user.fileId === file.id))
        next(new Error("Database error"))
})

export default file_router
