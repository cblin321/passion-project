import { prisma } from "../lib/prisma.js"

async function create_one(file_id, user_id, title, originalName) {
    return await prisma.file.create({
        include: {
            fileUsers: true
        },
        data: {
            id: file_id,
            title,
            originalName,
            fileUsers: {
                create: [
                    {
                        user: { connect: { id: user_id } },
                        role: "OWNER"
                    }
                ]
            }

        }
    })
}

async function get_one_by_id(file_id) {
    return await prisma.file.findUniqueOrThrow({
        where: {
            id: file_id
        },
        include: {
            fileUsers: true
        }
    })
}

async function get_all_by_user(user_id) {
    return await prisma.file.findMany({
        where: {
            fileUsers: {
                some: { userId: user_id }
            }
        },
        include: {
            fileUsers: true
        }
    })
}

async function update_many(file_id, changedUsers) {
    const updatedFields = 
    const transactions = changedUsers.map(user => {
        return prisma.fileUsers.update({
            where: {
                userId_fileId: {
                    userId: user.userId,
                    fileId: file_id
                }
            },
            data: {
                ...changedUsers
            }
        })
    })
    const res = prisma.$transaction([

    ])
}

export {
    create_one,
    get_all_by_user,
    get_one_by_id
}
