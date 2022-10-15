import { CommandInteraction } from 'discord.js';

/**
 * Represents a basic application command.
 *
 * Commands primarily have three things:
 * 1) A name (string), which is used to distinguish between different commands
 * 2) A means of retrieving the command's data (IE SlashCommandBuilder from discord.js)
 * 3) The type of interaction that this command responds to (used in `process()` and `invoke()`)
 *
 * In most cases, this will not be used by end users, and is mainly for internal command definitions.
 */
export abstract class CommandBase<BuilderType, CommandInteractionType extends CommandInteraction> {
    protected readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    /**
     * Returns the name of this command.
     * @returns {string} The command name
     */
    getName() {
        return this.name;
    }

    /**
     * Returns the BuilderType data associated with this command.
     */
    abstract getData(): BuilderType;

    /**
     * Ran immediately prior to invoking this command, after parsing has taken place.
     * `invoke` will be automatically called afterwards ONLY if the interaction context was not replied to.
     * This is useful to allow handling of preconditions and producing error replies on failed preconditions.
     * @param {CommandInteractionType} ctx The interaction context
     */
    // eslint-disable-next-line
    async beforeInvoke(_: CommandInteractionType): Promise<void> {}

    /**
     * Parses the incoming context to determine if this command should be invoked.
     * @param {CommandInteractionType} ctx The interaction context
     */
    async parse(ctx: CommandInteractionType): Promise<void> {
        if (ctx.commandName === this.name) {
            await this.beforeInvoke(ctx);

            // Allows beforeInvoke to handle error messages/preconditions
            if (!ctx.replied) {
                await this.invoke(ctx);
            }
        }
    }

    /**
     * Invokes this command.
     * WARNING: Running this directly bypasses all checks, including name checks!
     * @param ctx The interaction context
     */
    abstract invoke(ctx: CommandInteractionType): Promise<void>
}

export * from './CommandListener';
export * from './slash';
