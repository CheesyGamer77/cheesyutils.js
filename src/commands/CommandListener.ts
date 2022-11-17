import { CommandInteraction } from 'discord.js';
import { SlashCommand } from './slash/SlashCommand';

/**
 * Represents a container of slash commands.
 */
export class CommandListener {
    private readonly commandMap: Map<string, SlashCommand> = new Map();

    constructor(...commands: SlashCommand[]) {
        for (const command of commands) {
            this.commandMap.set(command.getName(), command);
        }
    }

    /**
     * Returns the raw JSON for all the commands this command listener handles.
     * @returns {RESTPostAPIApplicationCommandsJSONBody[]} The JSON of this listener's commands
     */
    getCommands() {
        const data = [];

        for (const command of this.commandMap.values()) {
            data.push(command.toJSON());
        }

        return data;
    }

    /**
     * Processes an incoming command interaction.
     * @param {CommandInteraction} ctx The incoming interaction context
     */
    async process(ctx: CommandInteraction) {
        if (ctx.isChatInputCommand()) {
            await this.commandMap.get(ctx.commandName)?.parse(ctx);
        }
    }
}
