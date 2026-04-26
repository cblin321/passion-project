// services
import { S3Client } from "@aws-sdk/client-s3"

const s3 = new S3Client({
    endpoint: "http://localhost:3900",
    region: "garage",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

async function create_one() {

}

async function get_one() {

}

export {
    get_one,
    create_one
}
