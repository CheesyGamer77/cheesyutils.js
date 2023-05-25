import { Guild, Snowflake } from "discord.js"
import { ExpiryCache } from "./cache"

/**
 * Represents a configuration associated with a particular guild.
 */
export type GuildConfig = {
    /** The id of the guild associated with this configuration. */
    guildId: Snowflake
}

/**
 * Represents a guild configuration that can be toggled.
 */
export type ToggleableGuildConfig = GuildConfig & {
    /** Whether the configuration is enabled or not. */
    enabled: boolean
}

/**
 * Represents an entity that holds a cached configuration for a particular guild.
 */
export abstract class GuildConfigHolder<C extends GuildConfig> extends ExpiryCache<Snowflake, C> {
    constructor(expiry_ms: number) {
        super(expiry_ms, c => c.guildId);
    }

    /**
     * Returns the default configuration to use for the given guild.
     * @param guild The guild to build the default configuration for.
     */
    protected abstract getDefaultConfig(guild: Guild): Promise<C>
}

/**
 * Represents an entity that holds a cached, toggleable configuration for a particular guild.
 */
export abstract class ToggleableGuildConfigHolder<C extends ToggleableGuildConfig> extends GuildConfigHolder<C> {
    /**
     * Enables or disables the configuration for a particular guild.
     *
     * If a configuration does not already exist for the guild, this will utilize a modified default configuration.
     * @param guild The guild to enable/disable the configuration for.
     * @param enabled true to enable the configuration, false to disable.
     */
    public async setEnabled(guild: Guild, enabled: boolean) {
        const config = await this.retrieve(guild.id);
        config.enabled = enabled;
        await this.add(config);
    }
}
