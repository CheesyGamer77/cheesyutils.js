import { ChatInputCommandInteraction } from 'discord.js';
import { CommandBase } from '..';

/**
 * Shorthand for CommandBase<BuilderType, ChatInputCommandInteraction>.
 * Serves as the base class for all Slash Command objects.
 */
// eslint-disable-next-line max-len
export default abstract class SlashCommandBase<BuilderType> extends CommandBase<BuilderType, ChatInputCommandInteraction> {}

export { default as SlashCommand } from './SlashCommand';
export { default as SubcommandGroup } from './SubcommandGroup';
export { default as Subcommand } from './Subcommand';
