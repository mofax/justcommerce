import { NextApiRequest, NextApiResponse } from "next"
import { CommandRequire } from "../../../api-commands/types";
import { ApiCustomError } from "../../../tools/customErrors";
import { httpMethodAllowed } from "../../../tools/http-tools";
import { logger } from "../../../tools/logger";

type ExecutionResults = { state: "error", error: any } | { state: "success", data: any }

const knownCommands: { [key: string]: any } = {
    authenticate: require("../../../api-commands/authenticate"),
    createadmin: require("../../../api-commands/createadmin"),
    product: {
        create: require("../../../api-commands/product/create"),
    }
}

async function executeCommand(commandTools: CommandRequire, params: any): Promise<ExecutionResults> {
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
    if (!httpMethodAllowed(req, res, ["POST"])) {
        return;
    }

    const { command: commandSource } = req.query;

    if (typeof commandSource !== "string") {
        logger.warn({ data: commandSource }, "Invalid commandSource")
        return res.status(406).json({ error: "Invalid Command" })
    }

    const commandSourceSplit = commandSource.split(".")
    const [namespace, method] = commandSourceSplit

    let commandTools;
    if (method) {
        commandTools = knownCommands[namespace][method]
    } else {
        commandTools = knownCommands[namespace]
    }

    if (!commandTools) {
        logger.warn({ data: [namespace, method] }, "Invalid commandTools")
        return res.status(406).json({ error: "Invalid Command" })
    }

    executeCommand(commandTools, req.body).then(result => {
        let status = 200;
        if (result.state === "error") {
            let errorResponse;
            status = 400;
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
            logger.info({ status, command: commandSource, error: errorResponse }, "command unsuccessful")
        } else {
            res.status(status).json({
                data: result.data
            })
            logger.info({ status, command: commandSource }, "command successful")
        }
    }).catch(err => {
        const status = 500;
        logger.fatal(err, "command failed: unknown exeception")
        res.status(status).json({ error: "server error!" })
    })
}
