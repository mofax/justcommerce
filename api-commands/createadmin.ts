import { ZodEmailPassword } from "../tools/zod-schemas";
import * as z from 'zod';
import { prisma } from "../prisma/client";
import { hashPassword } from "../tools/crypto";
import { CommandExecutorReturn } from "./types";

const schema = ZodEmailPassword

async function execute(params: z.infer<typeof schema>): Promise<CommandExecutorReturn> {
    const count = await prisma.user.findMany({ orderBy: { id: "asc" }, take: 1 })
    if (count.length !== 0) {
        return [null, new Error("Cannot create an admin user")]
    }

    const createUserOperation = prisma.user.create({
        data: {
            email: params.email.toLowerCase(),
            password: await hashPassword(params.password),
            hasDashboardAccess: true,
            role: {
                create: { name: "admin" }
            }
        }
    })

    const createCustomerRoleOperation = prisma.role.create({
        data: { name: "customer" }
    })

    const [user] = await prisma.$transaction([createUserOperation, createCustomerRoleOperation])

    return [{ id: user.id }, null]
}

export { schema, execute }