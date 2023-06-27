const { SlashCommandBuilder } = require('discord.js');
const database = require("../modules/database");
const embedTpl = require('../modules/embedTpl');

const userData = require('../modules/user/userData');
const userEmbed = require('../modules/user/userEmbed');
const userButton = require('../modules/user/userButton');


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
        // 유저정보 데이터 추출
        const get_user_data = await userData.userInfoData(user_name);
        const user_data = get_user_data.data;
        if( get_user_data.error ){
            interaction.editReply({content: get_user_data.error, embeds: []});
            return;
        }

        // 유저정보 Embed
        const user_embed = await userEmbed.userInfoEmbed(user_data);
        
        // 유저정보 Button
        const button_component = await userButton.userSearchButton(user_data.id);

        // --------------------------------------------------------------
        //  # Etc
        // --------------------------------------------------------------
        // 로그저장
        const sql = `Insert Into user_search_log (user, name, match_id, match_name, message_key, date) Values ('${interaction.user.id}', '${interaction.user.username}', '${user_data.id}', '${user_data.name}', '${interaction.id}', now())`;
        const rs = await database.dbQuery(sql);

        // --------------------------------------------------------------
        //  # Result
        // --------------------------------------------------------------
        await interaction.editReply({content: '', embeds: [user_embed], components: [button_component]});
    }
};