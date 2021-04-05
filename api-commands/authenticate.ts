import { ZodEmailPassword } from "../tools/zod-schemas";
import * as z from 'zod';
import { prisma } from "../prisma/client";
import { verifyStoredPassword } from "../tools/crypto";
import { CommandExecutorReturn } from "./types";
import { ApiCustomError } from "../tools/customErrors";
import jwt from "jsonwebtoken"

const schema = ZodEmailPassword

function jwtSign(data: any) {
    const key = process.env.JWT_KEY
    if (!key) {
        throw new Error("environment variable JWT_KEY is not present.")
    }
    return jwt.sign({
        data
    }, key);
}

async function execute(params: z.infer<typeof schema>): Promise<CommandExecutorReturn> {
    const user = await prisma.user.findUnique({
        where: {
            email: params.email
        }
    })

    if (!user) {
        return [null, new ApiCustomError("Authentication failed!", 401)]
    }

    const passwordVerified: boolean = await verifyStoredPassword(params.password, user.password)
    if (!passwordVerified) {
        return [null, new ApiCustomError("Authentication failed!", 401)]
    }
    const token = {
        id: user.id,
        email: user.email,
        hasDashboardAccess: user.hasDashboardAccess,
    }
    return [jwtSign(token), null]
}

export { schema, execute }