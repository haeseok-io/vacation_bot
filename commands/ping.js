const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pong! 하고 대답해요!'),
    async execute(interaction){
        await interaction.reply('pong!');
    }
};