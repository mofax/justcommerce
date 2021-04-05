import { NextApiRequest, NextApiResponse } from "next"
import { graphql } from 'graphql'
import { graphqlSchema } from "../../../tools/graphql-schema";

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }
    graphql(graphqlSchema, req.body.query).then((result) => {
        res.status(200).json(result)
    });
}