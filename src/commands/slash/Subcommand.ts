import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import SlashCommandBase from '.';

/**
 * Represents a subcommand for slash commands.
 */
export default abstract class Subcommand extends SlashCommandBase<SlashCommandSubcommandBuilder> {
    protected readonly data = new SlashCommandSubcommandBuilder();

    constructor(name: string, description: string) {
        super(name);

        this.data
            .setName(name)
            .setDescription(description);
    }

    /**
     * Returns the SlashCommandSubcommandBuilder associated with this subcommand.
     * @returns {SlashCommandSubcommandBuilder} This command's subcommand builder
     */
    override getData(): SlashCommandSubcommandBuilder {
        return this.data;
    }

    /**
     * Processes the incoming context to determine whether this command should be invoked.
     * @param {ChatInputCommandInteraction<CacheType>} ctx The incoming interaction context
     */
    override async parse(ctx: ChatInputCommandInteraction<CacheType>): Promise<void> {
        if (ctx.options.getSubcommand(false) === this.name) {
            await this.beforeInvoke(ctx);
        }
    }
}
