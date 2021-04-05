import multer from "multer"
import * as path from "path"

export const config = {
    api: {
        bodyParser: false,
    },
}

const storage = multer.diskStorage({
    destination: path.join(process.cwd(), "public/uploads"),
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage: storage }).array("files")

export default (req: any, res: any) => {
    upload(req, res, function (err: any) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message })
        } else if (err) {
            return res.status(500).json({ error: "Server Error!" })
        }

        const data = req.files.map((file: any) => {
            return {
                fileName: file.filename,
                mimeType: file.mimetype,
                path: `/uploads/${file.filename}`
            }
        })

        res.status(200).json({ data });
    })
}