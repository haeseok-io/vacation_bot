const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const database = require("../modules/database");
const userData = require("../modules/userData");
const embedTpl = require('../modules/embedTpl');
const userTrendBtn = require('../buttons/userTrend');
const userMatchBtn = require('../buttons/userMatch');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('유저조회')
		.setDescription('유저명을 입력하여 정보를 조회합니다.')
        .addStringOption(option =>
			option
				.setName('유저명')
				.setDescription('유저명 입력')
        ),
    async execute(interaction){
        // --------------------------------------------------------------
        //  # Val
        // --------------------------------------------------------------
        const user_name = interaction.options.getString('유저명');

        // --------------------------------------------------------------
        //  # Check
        // --------------------------------------------------------------
        if( !user_name ){
            await interaction.editReply('유저명을 입력해주세요.');
            return;
        }

        // --------------------------------------------------------------
        //  # Init
        // --------------------------------------------------------------
        await interaction.deferReply();

        // 로딩 Embed 노출
        const loading_embed = embedTpl.loadingEmbed(`${user_name} 유저에 대한 정보 조회중...`);
        await interaction.editReply({content: '', embeds: [loading_embed]});

        // --------------------------------------------------------------
        //  # Data
        // --------------------------------------------------------------
        // 유저정보 가져오기
        const user_info = await userData.userInfo(user_name);
        const user_data = user_info.data;
        if( user_info.error ){
            interaction.editReply(user_info.error);
            return;
        }

        // 유저정보 Embed
        const user_embed = embedTpl.userInfoEmbed(user_data.id, user_data.name, user_data.class_img, user_data.rank, user_data.clan_name, user_data.clan_cert);
        
        // 버튼
        // ... 최근동향
        const trend_btn = userTrendBtn.data;
        const match_btn = userMatchBtn.data;

        // ... 컴포넌트 생성
        const button_component = new ActionRowBuilder({
            components: [trend_btn, match_btn]
        });

        // --------------------------------------------------------------
        //  # Etc
        // --------------------------------------------------------------
        // DB에 검색 로그 저장
        const sql = `Insert Into user_search_log (user, name, match_id, match_name, message_key, date) Values ('${interaction.user.id}', '${interaction.user.username}', '${user_data.id}', '${user_data.name}', '${interaction.id}', now())`;
        const rs = await database.dbQuery(sql);

        // --------------------------------------------------------------
        //  # Result
        // --------------------------------------------------------------
        await interaction.editReply({content: '', embeds: [user_embed], components: [button_component]});
    }
};