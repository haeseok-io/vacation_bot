const { EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const database = require('../modules/database');
const embedTpl = require('../modules/embedTpl');

const userData = require('../modules/user/userData');
const userEmbed = require('../modules/user/userEmbed');
const userButton = require('../modules/user/userButton');


const prefix = 'userBadDelete';
module.exports = {
    customId: prefix,
    data: new ButtonBuilder({
        custom_id: prefix,
        style: ButtonStyle.Primary,
        label: '핵/비매너 해제',
    }),
    execute: async interaction => {
        // --------------------------------------------------------------
        //  # Val
        // --------------------------------------------------------------
        const user_embed = new EmbedBuilder(interaction.message.embeds[0]);

        // --------------------------------------------------------------
        //  # Init
        // --------------------------------------------------------------
        await interaction.deferUpdate();

        // 로딩 Embed 노출
        const loading_embed = embedTpl.loadingEmbed(`핵/비매너 유저 해제중...`);
        await interaction.editReply({content: '', embeds: [user_embed, loading_embed]});
        
        // --------------------------------------------------------------
        //  # Data
        // --------------------------------------------------------------
        // 로그 정보
        const log_sql = `Select * From user_search_log Where message_key='${interaction.message.interaction.id}'`;
        const log_data = await database.dbData(log_sql);

        // 비매너 정보
        const bad_sql = `Select * From user_bad_manners Where user_id='${log_data.match_id}'`;
        const bad_data = await database.dbData(bad_sql);

        // --------------------------------------------------------------
        //  # Process
        // --------------------------------------------------------------
        // 비매너 유저 등록
        if( bad_data ){
            const delete_sql = `Delete From user_bad_manners Where user_id='${log_data.match_id}'`; 
            const delete_rs = await database.dbQuery(delete_sql);

            user_embed.setColor('#00aaea');
            user_embed.data.footer = undefined;
        }

        // --------------------------------------------------------------
        //  # Etc
        // --------------------------------------------------------------
        // 유저정보 버튼 재 생성
        const button_component = await userButton.userSearchButton(log_data.match_id);

        // --------------------------------------------------------------
        //  # Result
        // --------------------------------------------------------------
        await interaction.editReply({embeds: [user_embed], components: [button_component]});
    }
};
