// services
import { S3Client, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import multerS3 from "multer-s3"
import multer from "multer"

const s3 = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const multer_s3 = multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    key: function(req, file, cb) {
        cb(null, req.file_id)
    },
})

const upload = new multer({
    storage: multer_s3
})

async function get_one_by_id(file_id) {
    return await s3.send(new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: file_id
    }))
}

async function delete_one_by_id(file_id) {

    const res = await s3.send(new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: file_id
    }))

    const result = await s3.send(
        new ListObjectsV2Command({
            Bucket: "my-bucket",
        })
    )

    console.log(result.Contents)

    return res
}

export default upload

export {
    get_one_by_id,
    delete_one_by_id
}
