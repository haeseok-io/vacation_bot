const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { userData } = require("../modules/userData");

module.exports = {
    data: new SlashCommandBuilder()
		.setName('유저조회')
		.setDescription('유저명을 입력하여 정보를 조회합니다.')
        .addStringOption(option =>
			option
				.setName('유저명')
				.setDescription('유저명 입력')),
    async execute(interaction){
        // Val
        const user_name = interaction.options.getString('유저명');

        // Data
        const get_data = await userData(user_name);
        if( get_data.error ){
            interaction.reply(get_data.error);
            return;
        }

        const user_data = get_data.data;

        // Etc
        // - Embed
        const embed_obj = new EmbedBuilder();
        embed_obj.setColor(0x0099FF);
        embed_obj.setTitle(`${user_data.name}`);
        embed_obj.setURL(`https://barracks.sa.nexon.com/${user_data.id}/match`);
        embed_obj.setThumbnail(user_data.class_img);
        embed_obj.setFooter({text: `통합검색 페이지에서 조회되는 내용 입니다.`});
        embed_obj.addFields(
            {name: '랭킹', value: user_data.rank},
            {name: '전적', value: user_data.record},
            {name: '승률', value: user_data.odd, inline: true},
            {name: 'kda', value: user_data.kda, inline: true}
        );

        // -- 클랜 노출
        if( user_data.clan_name || user_data.clan_cert ){
            const clan_obj = {};
            if( user_data.clan_name ) clan_obj.name = user_data.clan_name;
            if( user_data.clan_cert ) clan_obj.iconURL = user_data.clan_cert;

            embed_obj.setAuthor(clan_obj);
        }

        // - Button
        // -- 최근동향
        const btn_trend = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: ' 최근동향',
            custom_id: 'userTrend',
            emoji: '🎯'
        });

        const btn_match = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: ' 최근매치',
            custom_id: 'userMatch',
            emoji: '🎮'
        });

        // -- 병영보기
        const btn_link = new ButtonBuilder({
            style: ButtonStyle.Link,
            label: '병영보기',
            url: `https://barracks.sa.nexon.com/${user_data.id}/match`
        });
    
        // -- 버튼 컴포넌트 생성
        const btn_component = new ActionRowBuilder()
            .addComponents(btn_trend,btn_match,btn_link);

        // Result
        await interaction.reply({embeds: [embed_obj], components: [btn_component]});
    }
};