import { EmbedBuilder, RGBTuple } from '@discordjs/builders';
import { Colors, Guild, GuildMember, User } from 'discord.js';
import * as Checks from './checks';

type EmbedModifierArgs = {
    base?: EmbedBuilder
}

type SetEmbedTargetArgs = EmbedModifierArgs & {
    target: User | GuildMember | Guild,
    inferColor: boolean
}

type SplitAcrossEmbedFieldsArgs = EmbedModifierArgs & {
    content: string,
    title: string,
}

type ThemedEmbedArgs = EmbedModifierArgs & {
    message: string
}

function splitStringByLength(str: string, maxLength: number) {
    // Guard against negative, zero, and non-integer maxLength
    Checks.isInteger(maxLength, 'maxLength');
    Checks.isPositive(maxLength, 'maxLength');
    Checks.isNonZero(maxLength, 'maxLength');

    // eslint-disable-next-line no-useless-escape
    const regex = new RegExp(`\b[\w\s]{${maxLength},}?(?=\s)|.+$`, 'g');
    return str.match(regex) ?? [str];
}

/** Maximum length for embed field values */
export const MAX_EMBED_FIELD_VALUE_LENGTH = 1024;

/**
 * Returns an {@link EmbedBuilder} with the following:
 * - The `author` set to use the target's name and avatar/icon.
 * - The `footer` text set to the following format: `User (or 'Guild') ID: ${target.id}`.
 * - The `timestamp` set to the current timestamp.
 * @param {SetEmbedTargetArgs} opts The base embed builder, target, and whether to infer the embed color.
 * @returns {EmbedBuilder} The produced EmbedBuilder.
 */
export function setEmbedTarget(opts: SetEmbedTargetArgs) {
    let { base, inferColor } = opts;
    const { target } = opts;
    base = base ?? new EmbedBuilder();
    inferColor = inferColor ?? false;

    let name: string;
    let iconURL: string | undefined;

    // The only reason this is both null and undefined is
    // because of User#accentColor potentially being null | undefined :shrug:
    let color: number | null | undefined;

    if (target instanceof GuildMember) {
        name = target.nickname ?? target.user.tag;
        iconURL = target.avatarURL() ?? target.displayAvatarURL();
        color = target.displayColor;
    }
    else if (target instanceof User) {
        name = target.tag;
        iconURL = target.displayAvatarURL();
        color = target.accentColor;
    }
    else {
        name = target.name;
        iconURL = target.iconURL() ?? undefined;
    }

    if (inferColor && color !== undefined) {
        base.setColor(color);
    }

    const targetType = target instanceof Guild ? 'Guild' : 'User'

    return base
        .setAuthor({ name: name, iconURL: iconURL })
        .setFooter({ text: `${targetType} ID: ${target.id}` })
        .setTimestamp();
}

/**
 * Takes an input string `content` and adds as many embed fields as needed to fit said content.
 * The added fields will not be inline.
 * @param {SplitAcrossEmbedFieldsArgs} opts The base embed field, title, and content.
 * @returns {EmbedBuilder} The produced embed builder.
 */
export function splitAcrossEmbedFields(opts: SplitAcrossEmbedFieldsArgs) {
    let { base } = opts;
    const { content, title } = opts;
    base = base ?? new EmbedBuilder();

    const parts = splitStringByLength(content, MAX_EMBED_FIELD_VALUE_LENGTH);

    for (const part of parts) {
        base.addFields([{
            name: title,
            value: part,
        }]);
    }

    return base;
}

function getThemedEmbed(opts: ThemedEmbedArgs & {
    prep: string,
    color: number | RGBTuple | null
}) {
    let { base } = opts;
    const { prep, message, color } = opts;

    base = base ?? new EmbedBuilder();

    return base
        .setDescription(`${prep} ${message}`)
        .setColor(color);
}

/**
 * Returns an {@link EmbedBuilder} preset with the following:
 * - `description` set to `:x: ${message}`.
 * - `color` set to {@link Colors.Red}.
 * @param {ThemedEmbedArgs} opts The base embed builder and message string.
 * @returns {EmbedBuilder} The modified embed builder.
 */
export function failEmbed(opts: ThemedEmbedArgs) {
    return getThemedEmbed({
        ...opts,
        prep: ':x:',
        color: Colors.Red,
    });
}

/**
 * Returns an {@link EmbedBuilder} preset with the following:
 * - `description` set to `:white_checkmark: ${message}`.
 * - `color` set to {@link Colors.Green}.
 * @param {ThemedEmbedArgs} opts The base embed builder and message string.
 * @returns {EmbedBuilder} The modified embed builder.
 */
export function successEmbed(opts: ThemedEmbedArgs) {
    return getThemedEmbed({
        ...opts,
        prep: ':white_check_mark:',
        color: Colors.Green,
    });
}

/**
 * Returns an {@link EmbedBuilder} preset with the following:
 * - `description` set to `:warning: ${message}`.
 * - `color` set to {@link Colors.Gold}.
 * @param {ThemedEmbedArgs} opts The base embed builder and message string.
 * @returns {EmbedBuilder} The modified embed builder.
 */
export function warningEmbed(opts: ThemedEmbedArgs) {
    return getThemedEmbed({
        ...opts,
        prep: ':warning:',
        color: Colors.Gold,
    });
}
