import { NextApiRequest, NextApiResponse } from "next"

type HttpMethods = "POST" | "GET"

function httpMethodAllowed(req: NextApiRequest, res: NextApiResponse, methods: Array<HttpMethods>) {
    const method = req.method as HttpMethods
    if (methods.includes(method)) {
        return true;
    }
    res.status(405).json({ error: "Method not allowed" })
    return false;
}

export { httpMethodAllowed }