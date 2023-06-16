const { EmbedBuilder } = require('discord.js');
const userData = require("../modules/userData");
const database = require('../modules/database');

module.exports = {
    customId: 'userTrend',
    execute: async interaction => {
        // Val

        await interaction.deferUpdate();

        // Data
        // ... 부모메세지 정보 가져오기
        const sql = `Select * From user_search_log Where message_key='${interaction.message.interaction.id}'`;
        const data = await database.dbData(sql);

        // ... 유저 최근동향 정보 가져오기
        const get_data = await userData.userTrendData(data.match_id);
        if( get_data.error ){
            await interaction.editReply(`최근동향 정보를 가져오지 못했습니다.`);
            return;
        }

        // Process
        // ... 부모메세지 정보 변경
        const user_embed = new EmbedBuilder(interaction.message.embeds[0]);
        user_embed.data.fields = get_data.format;


        // console.log(user_embed);

        // user_embed.addFields(
            // {name: '최근전적', value: '최근전적 데이터 노출'}
        // );


        // console.log(user_embed);
        // user_embed.setTitle("테스트");

        await interaction.editReply({embeds: [user_embed]});
        // interaction.update({content: 'test', embeds: [user_embed]});
    }
}