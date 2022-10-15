import { CacheType, ChatInputCommandInteraction, SlashCommandSubcommandGroupBuilder } from 'discord.js';
import SlashCommandBase from '.';
import Subcommand from './Subcommand';

/**
 * Represents a group of slash command subcommands.
 */
export default abstract class SubcommandGroup extends SlashCommandBase<SlashCommandSubcommandGroupBuilder> {
    private readonly data = new SlashCommandSubcommandGroupBuilder();
    private readonly subcommands: Map<string, Subcommand> = new Map();

    constructor(name: string, description: string) {
        super(name);

        this.data
            .setName(name)
            .setDescription(description);
    }

    /**
     * Adds one or more subcommands to this subcommand group.
     * @param {Subcommand[]} subcommands The subcommands to add
     */
    addSubcommands(...subcommands: Subcommand[]) {
        for (const command of subcommands) {
            this.data.addSubcommand(command.getData());
            this.subcommands.set(command.getName(), command);
        }
    }

    /**
     * Returns the SlashCommandSubcommandGroupBuilder associated with this subcommand group.
     * @returns {SlashCommandSubcommandGroupBuilder} This command's subcommand group builder
     */
    override getData(): SlashCommandSubcommandGroupBuilder {
        return this.data;
    }

    override async parse(ctx: ChatInputCommandInteraction<CacheType>): Promise<void> {
        const name = ctx.options.getSubcommand(true);
        await this.subcommands.get(name)?.parse(ctx);
    }
}
