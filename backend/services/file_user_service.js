// prisma
import { prisma } from "../lib/prisma.js"

async function update_many(file_id, changedUsers) {
    const transactions = changedUsers.map(user => {
        console.log({
            where: {
                userId_fileId: {
                    userId: user.userId,
                    fileId: file_id
                }
            },
            data: {
                role: user.role
            }
        })
        return prisma.fileUsers.update({
            where: {
                userId_fileId: {
                    userId: user.userId,
                    fileId: file_id
                }
            },
            data: {
                role: user.role
            }
        })
    })
    const res = await prisma.$transaction(transactions)
    console.log(res)

    return res
}

async function add_one(file_id, user_id, role) {
    return await prisma.fileUsers.create({
        data: {
            userId: user_id,
            fileId: file_id,
            role
        },
    })
}

async function delete_one() {

}

async function find_one() {

}

export {
    update_many,
    add_one,
    delete_one
}
