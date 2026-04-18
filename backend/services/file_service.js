import { prisma } from "../lib/prisma.js"

async function create_one(user_id, name) {
    return await prisma.file.create({
        include: {
            fileUsers: true
        },
        data: {
            name,
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

async function get_all_by_user(user_id) {
    return await prisma.file.findMany({
        where: {
            fileUsers: {
                some: { userId: user_id }
            }
        }
    })
}

export {
    create_one,
    get_all_by_user
}
