const Discord = require('discord.js');
const { SlashCommand, CommandOptionType } = require('slash-create');
const client = require('../bot.js')
var config = require('../config.json');

module.exports = class blankCommand extends SlashCommand {
  constructor(creator) {
    super(creator, {
      name: 'blank',
      description: 'blank',
      guildIDs: [config.guild_id],
      throttling: {
        usages: config.uses,
        duration: config.latence,
      },
    });

    // Not required initially, but required for reloading with a fresh file.
    this.filePath = __filename;
  }

  async run(ctx) {
    ctx.send("blank")
  } 

}

