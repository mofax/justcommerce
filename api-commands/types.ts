import * as z from 'zod';

type CommandExecutorReturn = [null, Error] | [any, null];

interface CommandContext {
    auth: { user: { id: string; email: string; hasDashboardAccess: boolean } };
}

type CommandExecutor = (
    params: any,
    context: CommandContext
) => Promise<CommandExecutorReturn>;

interface CommandRequire {
    schema: z.ZodSchema<any>;
    execute: CommandExecutor;
}

export type { CommandRequire, CommandExecutorReturn, CommandContext };
