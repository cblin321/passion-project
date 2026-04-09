import { prisma } from "../lib/prisma.js"

const find_one_by_id = async (id) => {
    return await prisma.user.findUniqueOrThrow({
        where: { id },
    })
}

const find_one_by_email = async (email) => {
    return await prisma.user.findUniqueOrThrow({
        where: { email },
    })
}

const add_one = async (email, password) => {
    return await prisma.user.create({
        data: {
            email,
            password,
        }
    })
}


export {
    find_one_by_id,
    find_one_by_email,
    add_one,
}
