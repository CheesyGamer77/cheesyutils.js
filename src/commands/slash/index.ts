import { ChatInputCommandInteraction } from 'discord.js';
import { CommandBase } from '..';

/**
 * Shorthand for CommandBase<BuilderType, ChatInputCommandInteraction>.
 * Serves as the base class for all Slash Command objects.
 */
// eslint-disable-next-line max-len
export abstract class SlashCommandBase<BuilderType> extends CommandBase<BuilderType, ChatInputCommandInteraction> {}

export * from './SlashCommand';
export * from './SubcommandGroup';
export * from './Subcommand';
