import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import SlashCommandBase from '.';
import Subcommand from './Subcommand';
import SubcommandGroup from './SubcommandGroup';

/**
 * Represents a slash command. Should be extended in order to make your own slash commands.
 */
export default abstract class SlashCommand extends SlashCommandBase<SlashCommandBuilder> {
    protected readonly data = new SlashCommandBuilder();
    private readonly subcommandGroups: Map<string, SubcommandGroup> = new Map();
    private readonly subcommands: Map<string, Subcommand> = new Map();

    constructor(name: string, description: string) {
        super(name);

        this.data
            .setName(name)
            .setDescription(description);
    }

    /**
     * Returns the SlashCommandBuilder associated with this command.
     * @returns {SlashCommandBuilder} This command's slash command builder
     */
    override getData(): SlashCommandBuilder {
        return this.data;
    }

    /**
     * Returns the raw JSON associated with this command. Used for bulk updating slash commands.
     * @returns {RESTPostAPIApplicationCommandsJSONBody} This command's JSON data
     */
    toJSON() {
        return this.getData().toJSON();
    }

    /**
     * Adds one or more SubcommandGroups to this command.
     * @param {SubcommandGroup[]} groups The subcommand groups to add
     */
    addSubcommandGroups(...groups: SubcommandGroup[]) {
        for (const group of groups) {
            this.data.addSubcommandGroup(group.getData());
            this.subcommandGroups.set(group.getName(), group);
        }
    }

    /**
     * Adds one or more Subcommands to this command.
     * @param {Subcommand[]} subcommands The subcommands to add
     */
    addSubcommands(...subcommands: Subcommand[]) {
        for (const command of subcommands) {
            this.data.addSubcommand(command.getData());
            this.subcommands.set(command.getName(), command);
        }
    }

    /**
     * Main entrypoint for this command. Parses the incoming interaction context to determine whether a
     * subcommand or group should be further processed, or if this individual command should be directly invoked.
     * @param {ChatInputCommandInteraction<CacheType>} ctx The incoming interaction context
     */
    override async parse(ctx: ChatInputCommandInteraction<CacheType>): Promise<void> {
        if (ctx.isChatInputCommand() && ctx.commandName === this.name) {
            const subcommandGroup = ctx.options.getSubcommandGroup(false);
            const subcommand = ctx.options.getSubcommand(false);

            if (subcommandGroup === null && subcommand === null) {
                await this.beforeInvoke(ctx);
            } else if (subcommandGroup === null && subcommand !== null) {
                await this.subcommands.get(subcommand)?.parse(ctx);
            } else if (subcommandGroup !== null) {
                await this.subcommandGroups.get(subcommandGroup)?.parse(ctx);
            }
        }
    }
}
