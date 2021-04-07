import { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import { logger } from "./logger";


type HttpMethods = "POST" | "GET"

function jwtSign(data: any) {
    const key = process.env.JWT_KEY
    if (!key) {
        throw new Error("environment variable JWT_KEY is not present.")
    }
    return jwt.sign({
        data
    }, key);
}

function parseBearerToken(req: NextApiRequest) {
    const key = process.env.JWT_KEY;
    if (!key) {
        logger.error("environment variable JWT_KEY is not present!");
        return null;
    }

    const header = req.headers['authorization'];
    if (header && header.startsWith("Bearer ")) {
        const token = header.substring(7, header.length);
        try {
            return jwt.verify(token, key);
        } catch {
            return null;
        }

    } else {
        return null;
    }
}

function httpMethodAllowed(req: NextApiRequest, res: NextApiResponse, methods: Array<HttpMethods>) {
    const method = req.method as HttpMethods
    if (methods.includes(method)) {
        return true;
    }
    res.status(405).json({ error: "Method not allowed" })
    return false;
}

interface AuthContext {
    always?: boolean
    dashboard?: boolean
}

function httpRequestAuthorised(req: NextApiRequest, res: NextApiResponse, context: AuthContext) {
    const yes = { authorised: true };
    if (context) {
        if (context.always) return yes

        const jwt: any = parseBearerToken(req)
        if (jwt) {
            const user = jwt.data.user
            if (context.dashboard) {
                if (user.hasDashboardAccess) return { ...yes, user }
            }
        }
    }

    const status = 401;
    res.status(status).json({ error: "unauthorised" })
    return { authorised: false }
}

export { httpMethodAllowed, httpRequestAuthorised, parseBearerToken, jwtSign }
