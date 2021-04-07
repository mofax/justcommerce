import * as z from 'zod';
import { prisma } from "../../prisma/client";
import { CommandExecutorReturn } from "../types";
import { ZodEmailPassword } from '../../tools/zod-schemas';
import { hashPassword } from '../../tools/crypto';
import { logger } from '../../tools/logger';

const authContext = {
    always: true
}

const schema = ZodEmailPassword

async function execute(params: z.infer<typeof schema>): Promise<CommandExecutorReturn> {
    const role = await prisma.role.findUnique({ where: { name: "customer" } })
    if (!role) {
        throw new Error("role with name 'customer' does not exist!");
    }

    const user = await prisma.user.create({
        data: {
            email: params.email,
            password: await hashPassword(params.password),
            roleId: role.id
        }
    })

    logger.info({ id: user.id }, "registered a new user");
    return [{ id: user.id }, null]
}

export { schema, execute, authContext }
