import { NextApiRequest, NextApiResponse } from "next"
import * as z from 'zod';
import { prisma } from "../../../prisma/client"

const creators = {
    async Product() {

    }
}

const schemas: { [key: string]: z.Schema<any> } = {
    Product: z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number()
    })
}

export default (req: NextApiRequest, res: NextApiResponse) => {
    const body: { model: string, data: any } = req.body;
    const modelSchema = schemas[body.model];
    const validation = modelSchema.safeParse(body.data);

    if (!validation.success) {
        return {
            state: "error",
            error: { validation: validation.error.errors }
        }
    }

}