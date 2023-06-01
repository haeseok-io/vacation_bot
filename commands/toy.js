const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('toy')
		.setDescription('어떤문구가 나올까요?'),
    async execute(interaction){
        await interaction.reply('유동우는 병신이다 다들 인정? 어~인정~');
    }
};