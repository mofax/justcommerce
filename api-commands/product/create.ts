import * as z from 'zod';
import { prisma } from "../../prisma/client";
import { CommandExecutorReturn } from "../types";
import { defaultCurrency } from "../../tools/currencies";

const authContext = {
    dashboard: true
}

const schema = z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number()
})

async function execute(params: z.infer<typeof schema>): Promise<CommandExecutorReturn> {
    const product = await prisma.product.create({
        data: {
            name: params.name,
            description: params.description,
        }
    })
    return [product, null]
}

export { schema, execute, authContext }
