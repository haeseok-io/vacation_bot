const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toy')
        .setDescription('유동우(김동우)에 대해 알아보자'),
    async execute(interaction){
        await interaction.reply('유동우(김동우)는 병신이다!!!!');
    }
};