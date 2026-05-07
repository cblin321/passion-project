import { prisma } from "../lib/prisma.js"

async function create_one(file_id, user_id, title, originalName) {
    return await prisma.file.create({
        include: {
            fileUsers: {
                include: {
                    user: {
                        select: { id: true, email: true }
                    }
                }
            }
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
            fileUsers: {
                include: {
                    user: {
                        select: { id: true, email: true }
                    }
                }
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
        },
        orderBy: {
            title: 'asc'
        },
        include: {
            fileUsers: {
                include: {
                    user: {
                        select: { id: true, email: true }
                    }
                }
            }
        }
    })
}


async function update_one(file_id, data) {
    return await prisma.file.update({
        where: {
            id: file_id
        },
        data,
        include: {
            fileUsers: {
                include: {
                    user: {
                        select: { id: true, email: true }
                    }
                }
            }
        }
    })
}

async function delete_one(file_id) {
    return await prisma.file.delete({
        where: {
            id: file_id
        }
    })
}

export {
    create_one,
    get_all_by_user,
    get_one_by_id,
    update_one,
    delete_one
}
