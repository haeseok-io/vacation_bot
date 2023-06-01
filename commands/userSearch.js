const { SlashCommandBuilder } = require('discord.js');
const { userData, userMatchData } = require('../modules/userData');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('매치조회')
		.setDescription('닉네임으로 검색하여 매치정보를 가져옵니다.')
        .addStringOption(option =>
			option
				.setName('유저명')
				.setDescription('유저명을 입력해주세요.')),
    async execute(interaction){
        // Val
        const username = interaction.options.getString('유저명');

        // Check
        if( !username ){
            await interaction.reply(`검색된 유저명이 없습니다. ( /유저검색 유저명 )`);
            return false;
        }

        // Data
        // - 유저 고유정보
        const user_data = await userData(username);
        
        if( user_data.error ){
            await interaction.reply(user_data.error);
            return false;
        }

        // - 유저 매치정보
        const user_match_data = await userMatchData(user_data.data.id);
        console.log(user_match_data);

        // 유저정보 반환
        await interaction.reply(`검색어: ${username}`);
    }
};