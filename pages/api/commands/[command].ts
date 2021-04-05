import { NextApiRequest, NextApiResponse } from "next"
import { CommandRequire } from "../../../api-commands/types";
import { ApiCustomError } from "../../../tools/customErrors";

type ExecutionResults = { state: "error", error: any } | { state: "success", data: any }

const knownCommands: { [key: string]: CommandRequire } = {
    authenticate: require("../../../api-commands/authenticate"),
    createAdmin: require("../../../api-commands/createAdmin")
}

async function executeCommand(name: string, params: any): Promise<ExecutionResults> {
    const commandTools = knownCommands[name];
    const validation = commandTools.schema.safeParse(params);
    if (!validation.success) {
        return {
            state: "error",
            error: { validation: validation.error.errors }
        }
    }

    const [data, error] = await commandTools.execute(params);
    if (error) {
        return {
            state: "error",
            error
        }
    }
    return {
        state: "success",
        data
    }
}

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    const { command } = req.query;
    if (typeof command !== "string") {
        return res.status(406).json({ error: "Invalid Command" })
    }

    if (!knownCommands[command]) {
        return res.status(406).json({ error: "Invalid Command" })
    }

    executeCommand(command, req.body).then(result => {
        if (result.state === "error") {
            let errorResponse;
            let status = 400;
            if (result.error instanceof ApiCustomError) {
                status = result.error.statusCode
                errorResponse = { message: result.error.message }
            }
            else if (result.error instanceof Error) {
                errorResponse = { message: result.error.message }
            } else {
                errorResponse = result.error
            }
            res.status(status).json({
                error: errorResponse
            })
        } else {
            res.status(200).json({
                data: result.data
            })
        }
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: "server error!" })
    })
}
