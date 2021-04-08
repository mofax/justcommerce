import * as z from 'zod';
import { prisma, PrismaDecimal } from '../../prisma/client';
import { CommandContext, CommandExecutorReturn } from '../types';
import { ZodEmailPassword } from '../../tools/zod-schemas';
import { hashPassword } from '../../tools/crypto';
import { logger } from '../../tools/logger';

const schema = z.object({
    variants: z.array(
        z.object({
            id: z.string(),
            numberOfItems: z.number(),
        })
    ),
});

async function execute(
    params: z.infer<typeof schema>,
    context: CommandContext
): Promise<CommandExecutorReturn> {
    const { auth } = context;
    const cache: { [key: string]: typeof params.variants[number] } = {};

    const variantIDs = params.variants.map((v) => {
        cache[v.id] = v;
        return v.id;
    });

    const variantValues = await prisma.productVariantValue.findMany({
        where: { id: { in: variantIDs } },
    });

    const orderItems = variantValues.map((variantValue) => {
        const paramVariant = cache[variantValue.id];
        return {
            productVariantValueId: variantValue.id,
            numberOfItems: paramVariant.numberOfItems,
            pricePerItem: variantValue.price,
            totalPrice: variantValue.price.times(paramVariant.numberOfItems),
        };
    });

    let orderPrice = new PrismaDecimal(0);
    orderItems.forEach((item) => {
        orderPrice = orderPrice.plus(item.totalPrice);
    });

    const order = await prisma.order.create({
        data: {
            userId: auth.user.id,
            price: orderPrice,
            orderItems: {
                createMany: { data: orderItems },
            },
        },
    });

    return [order, null];
}

export { schema, execute };
