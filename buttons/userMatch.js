const { ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const database = require('../modules/database');
const userData = require("../modules/userData");
const embedTpl = require('../modules/embedTpl');

const prefix = 'userMatch';
module.exports = {
    customId: prefix,
    data: new ButtonBuilder({
        custom_id: prefix,
        style: ButtonStyle.Secondary,
        label: '최근 매치기록',
    }),
    execute: async interaction => {
        // --------------------------------------------------------------
        //  # Val
        // --------------------------------------------------------------
        // ... 유저정보 Embed
        const user_embed = new EmbedBuilder(interaction.message.embeds[0]);

        // --------------------------------------------------------------
        //  # Init
        // --------------------------------------------------------------
        await interaction.deferUpdate();

        // 로딩 Embed 노출
        const loading_embed = embedTpl.loadingEmbed(`최근 매치기록 조회중...`);
        await interaction.editReply({content: '', embeds: [user_embed, loading_embed]});

        // --------------------------------------------------------------
        //  # Data
        // --------------------------------------------------------------
        // 검색 로그 DB 정보
        const sql = `Select * From user_search_log Where message_key='${interaction.message.interaction.id}'`;
        const data = await database.dbData(sql);

        // 유저 최근매치 정보 가져오기
        const get_data = await userData.userMatchData(data.match_id);
        if( get_data.error ){
            await interaction.editReply(`최근동향 정보를 가져오지 못했습니다.`);
            return;
        }

        // 유저 최근동향 Embed
        const match_data = get_data.data;
        const match_embed = embedTpl.userMatchEmbed(match_data);

        // --------------------------------------------------------------
        //  # Result
        // --------------------------------------------------------------
        await interaction.editReply({embeds: [user_embed, match_embed]});
    }
}