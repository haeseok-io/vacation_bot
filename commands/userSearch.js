const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const userData = require("../modules/userData");
const database = require("../modules/database");

module.exports = {
    data: new SlashCommandBuilder()
		.setName('유저조회')
		.setDescription('유저명을 입력하여 정보를 조회합니다.')
        .addStringOption(option =>
			option
				.setName('유저명')
				.setDescription('유저명 입력')),
    async execute(interaction){
        // --------------------------------------------------------------
        //  # Val
        // --------------------------------------------------------------
        const user_name = interaction.options.getString('유저명');

        // --------------------------------------------------------------
        //  # Init
        // --------------------------------------------------------------
        await interaction.deferReply();

        // --------------------------------------------------------------
        //  # Check
        // --------------------------------------------------------------
        if( !user_name ){
            await interaction.editReply('유저명을 입력해주세요.');
            return;
        }

        // --------------------------------------------------------------
        //  # Data
        // --------------------------------------------------------------
        await interaction.editReply(`${user_name} 유저에 대한 정보를 조회하는 중 입니다...`);

        // 유저정보
        const user_info = await userData.userInfo(user_name);
        const user_data = user_info.data;
        if( user_info.error ){
            interaction.editReply(user_info.error);
            return;
        }
        
        // --------------------------------------------------------------
        //  # Process
        // --------------------------------------------------------------
        // 유저정보 Embed
        const user_embed = new EmbedBuilder();
        user_embed.setColor(0x0099FF);
        user_embed.setTitle(`${user_data.name}`);
        user_embed.setURL(`https://barracks.sa.nexon.com/${user_data.id}/match`);
        user_embed.setThumbnail(user_data.class_img);
        user_embed.setFooter({text: `서든어택 공식 홈페이지에서 조회되는 데이터 입니다.`});
        user_embed.addFields(
            // {name: '닉네임', value: user_data.name},
            {name: '\u2009', value: '\u2009'},
            {name: '랭킹', value: user_data.rank, inline: true},
            {name: '고유ID', value: user_data.id, inline: true},
            {name: '\u2009', value: '\u2009'},


            // {name: '\u2009', value: '\u2009'},
            // {name: '📋 통합정보', value: `\u2009`},
            // {name: '\u2009', value: `> **랭킹**\n> ${user_data.rank}`},
            // {name: '\u2009', value: '\u2009'},
            // {name: '> 랭킹', value: `> ${user_data.rank}`},
            // {name: '\u2009', value: `> **전적**\n> ${user_data.record}`},
            // {name: '승률', value: user_data.odd, inline: true},
            // {name: 'kda', value: user_data.kda, inline: true},
            // {name: '\u2009', value: '\u2009'},
        );

        if( user_data.clan_name || user_data.clan_cert ){
            const clan_obj = {name: user_data.clan_name};
            if( user_data.clan_cert )   clan_obj.iconURL = user_data.clan_cert;
            user_embed.setAuthor(clan_obj);
        }

        // 하단 Button
        // ... 최근동향 버튼
        const btn_trend = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: '최근동향',
            custom_id: 'userTrend',
            emoji: '🔥',
        });

        // ... 최근 매치기록 버튼
        const btn_match = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: '최근 매치기록',
            custom_id: 'userMatch',
            emoji: '📋'
        })

        // ... 버튼 컴포넌트 생성
        const btn_component = new ActionRowBuilder()
            .addComponents(btn_trend, btn_match);

        // --------------------------------------------------------------
        //  # Etc
        // --------------------------------------------------------------
        // 발송된 메세지에 대한 로그 저장
        const sql = `Insert Into user_search_log (user, name, match_id, match_name, message_key, date) Values ('${interaction.user.id}', '${interaction.user.username}', '${user_data.id}', '${user_data.name}', '${interaction.id}', now())`;
        const rs = await database.dbQuery(sql);

        // --------------------------------------------------------------
        //  # Result
        // --------------------------------------------------------------
        await interaction.editReply({content: '', embeds: [user_embed], components: [btn_component]});
    }
};