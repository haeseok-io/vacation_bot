const { EmbedBuilder } = require('discord.js');
const userData = require("../modules/userData");
const database = require('../modules/database');

module.exports = {
    customId: 'userTrend',
    execute: async interaction => {
        // Val

        // Init
        await interaction.deferUpdate();

        // Data
        // ... 유저정보
        const user_embed = new EmbedBuilder(interaction.message.embeds[0]);

        // ... 로딩
        const loading_embed = new EmbedBuilder();
        loading_embed.setColor('#ffff00');
        loading_embed.setTitle('👾 최근동향 정보를 가져오는 중 입니다...');

        await interaction.editReply({embeds: [user_embed, loading_embed]});

        // Process
        // ... 부모메세지 정보 가져오기
        const sql = `Select * From user_search_log Where message_key='${interaction.message.interaction.id}'`;
        const data = await database.dbData(sql);

        // ... 유저 최근동향 정보 가져오기
        const get_data = await userData.userTrendData(data.match_id);
        if( get_data.error ){
            await interaction.editReply(`최근동향 정보를 가져오지 못했습니다.`);
            return;
        }

        // Etc
        const trend_embed = new EmbedBuilder();
        trend_embed.setColor('#ff0000');
        trend_embed.setTitle(`🔥 최근동향`);
        trend_embed.addFields(get_data.format);

        // Result
        await interaction.editReply({embeds: [user_embed, trend_embed]});
    }
}