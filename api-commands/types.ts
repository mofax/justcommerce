import * as z from 'zod';

type CommandExecutorReturn = [null, Error] | [any, null]

type CommandExecutor = (params: any) => Promise<CommandExecutorReturn>

interface CommandRequire {
    schema: z.ZodSchema<any>
    execute: CommandExecutor
}

export type { CommandRequire, CommandExecutorReturn }