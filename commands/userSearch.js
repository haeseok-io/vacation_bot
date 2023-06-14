const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const userData = require("../modules/userData");

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
        
        interaction.client.userData.set(interaction.id, {id: user_data.id, name: user_data.name});

        // --------------------------------------------------------------
        //  # Process
        // --------------------------------------------------------------
        // 유저정보 Embed
        const user_embed = new EmbedBuilder();
        user_embed.setColor(0x0099FF);
        user_embed.setTitle(`${user_data.name}`);
        user_embed.setURL(`https://barracks.sa.nexon.com/${user_data.id}/match`);
        user_embed.setThumbnail(user_data.class_img);
        user_embed.setFooter({text: `서든어택 공식 홈페이지에서 조회되는 데이터 입니다.\n\n📌 해당 메세지는 xx분 뒤 자동으로 지워집니다. 📌`});
        user_embed.addFields(
            {name: '\u2009', value: '\u2009'},
            {name: '랭킹', value: user_data.rank},
            {name: '전적', value: user_data.record},
            {name: '승률', value: user_data.odd, inline: true},
            {name: 'kda', value: user_data.kda, inline: true},
            {name: '\u2009', value: '\u2009'},
        );

        if( user_data.clan_name || user_data.clan_cert ){
            const clan_obj = {name: user_data.clan_name};
            if( user_data.clan_cert )   clan_obj.iconURL = user_data.clan_cert;
            user_embed.setAuthor(clan_obj);
        }

        // --------------------------------------------------------------
        //  # Etc
        // --------------------------------------------------------------
        // 최근동향 버튼
        const btn_trend = new ButtonBuilder({
            style: ButtonStyle.Secondary,
            label: '최근동향',
            custom_id: 'userTrend',
            emoji: '🎯',
        });


        // 컴포넌트 생성
        const btn_component = new ActionRowBuilder()
            .addComponents(btn_trend);

        // --------------------------------------------------------------
        //  # Result
        // --------------------------------------------------------------
        const send_msg = await interaction.editReply({content: '', embeds: [user_embed], components: [btn_component]});
        
        setTimeout(async () => {
            try {
                await send_msg.delete();
                interaction.client.userData.delete(interaction.id);

                console.log(interaction.client.userData);
            } catch (error){
                console.log(error);
            }
        }, 5000);
    }
};