// server
import express from "express"

// auth 
import passport from "passport"

// services
import * as file_service from "../services/file_service.js"
import upload, * as s3_service from "../services/s3_service.js"
import * as file_user_service from "../services/file_user_service.js"
import * as user_service from "../services/user_service.js"
import crypto from "crypto"

const file_router = express.Router()

const auth = passport.authenticate("jwt", { session: false, failWithError: true })

const ROLE_LEVEL = { OWNER: 3, EDITOR: 2, VIEWER: 1 }

const isRole = (roles) => {
    return async (req, res, next) => {
        const file_id = req.params.file_id
        const file = await file_service.get_one_by_id(file_id)
        // index of this user in fileUser that matches one of the required roles
        const userIndex = file.fileUsers.findIndex(user => parseInt(user.userId) === req.user.id
            && roles.some(role => role === user.role))
        if (userIndex === -1) {
            const err = new Error("Unauthorized your role has insufficient permissions")
            err.status = 401
            next(err)
            return
        }

        req.file = file
        next()
    }
}
file_router.get("/:file_id/users/:user_id", auth, async (req, res, next) => {
    const { file_id, user_id } = req.params
    const userRelation = await file_user_service.find_one(req.params.user_id, file_id)
    if (!userRelation) {
        const err = new Error("Unauthorized")
        err.status = 401
        next(err)
        return
    }
    const relation = await file_user_service.find_one(user_id, file_id)

    res.json(relation)
})

file_router.delete("/:file_id/users/:user_id", auth, async (req, res, next) => {
    const { file_id } = req.params
    const toRemoveId = req.params.user_id

    const userRole = (await file_user_service.find_one(req.user.id, req.params.file_id)).role

    const toRemoveRole = (await file_user_service.find_one(toRemoveId, req.params.file_id)).role

    const userRoleRank = ROLE_LEVEL[userRole]
    const toRemoveRoleRank = ROLE_LEVEL[toRemoveRole]
    if (userRoleRank < toRemoveRoleRank) {
        const err = new Error("Unauthorized")
        err.status = 401
        next(err)
        return
    }
    try {
        const db_res = await file_user_service.delete_one(toRemoveId, file_id)
        res.json(db_res)
    } catch (err) {
        next(err)
    }
})

file_router.delete("/:file_id", auth, isRole(["OWNER"]), async (req, res, next) => {
    const { file_id } = req.params
    try {
        await s3_service.delete_one_by_id(file_id)
        const db_res = await file_service.delete_one(file_id)
        res.json(db_res)
    } catch (err) {
        next(err)
    }
})

//sharing
file_router.post("/:file_id/users/add", auth, async (req, res, next) => {
    const { email, role } = req.body
    const toAdd = await user_service.find_one_by_email(email)
    let userRole = await file_user_service.find_one(req.user.id, req.params.file_id)

    userRole = userRole.role

    const userRoleRank = ROLE_LEVEL[userRole]
    const grantedRoleRank = ROLE_LEVEL[role]
    if (userRoleRank < grantedRoleRank) {
        const err = new Error("Unauthorized")
        err.status = 401
        next(err)
        return
    }


    if (toAdd) {
        const userId = toAdd.id
        const fileId = req.params.file_id
        const db_res = await file_user_service.add_one(fileId, userId, role)
        res.json(db_res)
        return
    }

    const err = new Error("Not a valid user")
    err.status = 500
    next(err)
})


file_router.get("/:file_id", auth, async (req, res, next) => {
    const file_id = req.params.file_id

    const file = await file_service.get_one_by_id(file_id)
    console.log(file)

    const split_name = file.originalName.split(".")
    let filename;

    if (split_name.length > 0)
        filename = `${file.title}.${split_name[split_name.length - 1]}`
    else
        filename = file.title

    res.set("Content-Disposition", `attachment; filename="${filename}"`)
    res.set("Content-Type", "application/octet-stream")
    res.set("Access-Control-Expose-Headers", "Content-Disposition")

    const s3_res = await s3_service.get_one_by_id(file_id)

    s3_res.Body.pipe(res)
})

file_router.get("/", auth, async (req, res) => {
    const files = await file_service.get_all_by_user(req.user.id)
    res.json(files)
})


file_router.post("/create", auth, (req, res, next) => {
    req.file_id = crypto.randomUUID()
    next()
}, upload.single("file"), async (req, res, next) => {
    const title = req.body.title
    const file = await file_service.create_one(req.file_id, req.user.id, title, req.file.originalname)
    if (!(file.title === title && file.fileUsers?.length === 1 && req.file_id !== file.file_id)) {
        next(new Error("Database error"))
        return
    }

    const file_user = file.fileUsers[0]

    if (!(file_user.userId === req.user.id && file_user.fileId === file.id)) {
        next(new Error("Database error"))
        return
    }

    res.json(req.file)

})

//edit perms, filename
file_router.post("/:file_id", auth, isRole(["EDITOR", "OWNER"]), async (req, res) => {
    const userRole = (await file_user_service.find_one(req.user.id, req.params.file_id)).role
    const userRoleRank = ROLE_LEVEL[userRole]

    const changedUsers = req.body.changedUsers && await Promise.all(req.body.changedUsers.map(async user => {
        const currentRole = (await file_user_service.find_one(user.userId, req.params.file_id)).role
        const currentRoleRank = ROLE_LEVEL[currentRole]
        const newRoleRank = ROLE_LEVEL[user.role]
        if (currentRoleRank <= userRoleRank && newRoleRank <= userRoleRank)
            return user
        return null
    })).then(results => results.filter(Boolean))

    let db_res;
    if (changedUsers?.length)
        await file_user_service.update_many(req.params.file_id, changedUsers)

    if (req.body.title)
        db_res = await file_service.update_one(req.params.file_id, { title: req.body.title })

    if (!db_res)
        db_res = await file_service.get_one_by_id(req.params.file_id)

    return res.json(db_res)
})



export default file_router
