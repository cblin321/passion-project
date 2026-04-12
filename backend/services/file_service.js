import { prisma } from "../lib/prisma.js"
import * as user_service from "user_service.js"

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

export default {
    create_one
}
