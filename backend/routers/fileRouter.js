// server
import express from "express"

// auth 
import passport from "passport"

// services
import * as file_service from "../services/file_service.js"
import { fileURLToPath } from "url"
import * as path from "path"
import multer from "multer"
import * as fs from "fs"

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, req.file_id)
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 ** 2 * 50
    }
})

const file_router = express.Router()

const auth = passport.authenticate("jwt", { session: false, failWithError: true })

file_router.get("/:file_id", auth, async (req, res, next) => {
    const file_id = req.params.file_id

    const file = await file_service.get_one_by_id(file_id)
    const filepath = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), "uploads/", file_id)

    const split_name = file.originalName.split(".")
    let filename;

    if (split_name.length > 0)
        filename = `${file.title}.${split_name[split_name.length - 1]}`
    else
        filename = file.title

    res.set("Access-Control-Expose-Headers", "Content-Disposition")
    res.download(filepath, filename, { path: "root" })
})

file_router.get("/", auth, async (req, res) => {
    const files = await file_service.get_all_by_user(req.user.id)
    res.json(files)
})


file_router.post("/create", auth, (req, res, next) => {
    req.file_id = crypto.randomUUID()
    next()
}, upload.single("file"), async (req, res, next) => {
    console.log(req.file)
    const title = req.body.title
    const file = await file_service.create_one(req.file_id, req.user.id, title, req.file.originalname)
    if (!(file.title === title && file.fileUsers?.length === 1 && req.file_id !== file.file_id))
        next(new Error("Database error"))

    const file_user = file.fileUsers[0]

    if (!(file_user.userId === req.user.id && file_user.fileId === file.id))
        next(new Error("Database error"))

    res.json(req.file)

})

export default file_router
