// server
import express from "express"

// auth 
import passport from "passport"

// services
import * as file_service from "../services/file_service.js"
import cors from "cors"
import multer from "multer"

const upload = multer({
    dest: "uploads",
    limits: {
        fileSize: 1024 ** 2 * 50
    }
})

const file_router = express.Router()

file_router.get("/", passport.authenticate("jwt", { session: false, failWithError: true }), async (req, res) => {
    const files = await file_service.get_all_by_user(req.user.id)
    console.log(files)
    res.json(files)
})

file_router.post("/create", passport.authenticate("jwt",
    { session: false, failWithError: true }),
    upload.single("file"), async (req, res, next) => {

        console.log("create file")
        const title = req.body.title
        const file = await file_service.create_one(req.user.id, title)
        if (!(file.title === title && file.fileUsers?.length === 1))
            next(new Error("Database error"))
        console.log("created file ", file)

        const file_user = file.fileUsers[0]

        if (!(file_user.userId === req.user.id && file_user.fileId === file.id))
            next(new Error("Database error"))

        res.json(req.file)

    })

export default file_router
