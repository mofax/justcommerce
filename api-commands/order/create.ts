import * as z from 'zod';
import { prisma } from '../../prisma/client';
import { CommandContext, CommandExecutorReturn } from '../types';
import { ZodEmailPassword } from '../../tools/zod-schemas';
import { hashPassword } from '../../tools/crypto';
import { logger } from '../../tools/logger';

const schema = z.object({
    variants: z.array(
        z.object({
            id: z.number(),
            numberOfItems: z.number(),
        })
    ),
});

async function execute(
    params: z.infer<typeof schema>,
    context: CommandContext
): Promise<CommandExecutorReturn> {
    const { auth } = context;
    const orderItems = params.variants.forEach(async (variant) => {
        const variantValue = await prisma.productVariantValue.findUnique({
            where: { id: variant.id },
        });
    });

    return [order, null];
}

export { schema, execute };
