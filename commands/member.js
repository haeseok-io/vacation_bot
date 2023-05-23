const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('member')
        .setDescription('현재 클랜원 정보를 알려줘요!'),
    async execute(interaction){
        await interaction.reply('클랜원 정보 반환!');
    }
};