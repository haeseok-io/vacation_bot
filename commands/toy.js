const { SlashCommandBuilder } = require('discord.js');
const { userData } = require('../modules/userData');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('유저검색')
		.setDescription('유저명으로 검색하여 정보를 가져옵니다.')
        .addStringOption(option =>
			option
				.setName('유저명')
				.setDescription('유저명을 입력해주세요.')),
    async execute(interaction){
        const reason = interaction.options.getString('유저명');

        if( !reason ){
            await interaction.reply(`검색된 유저명이 없습니다. ( /유저검색 유저명 )`);
            return false;
        }

        // 


        await interaction.reply(`검색어: ${reason}`);
    }
};