const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const cheerio = require('cheerio');
const { axiosCrolling } = require('../modules/crollring');

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
        const user_data = {id: '', name: '', rank: '', class: '', clan: '', record: '', odds: '', kill: ''};

        // Check
        if( !user_name ){
            await interaction.reply(`검색된 유저명이 없습니다. ( /유저검색 유저명 )`);
            return false;
        }

        // Data
        const get_url = `https://sa.nexon.com/ranking/total/ranklist.aspx?strSearch=${user_name}`;
        const get_data = await axiosCrolling(get_url);

        // Process
        const $ = cheerio.load(get_data.data);
        $(".boardList .relative table tbody tr").each((dex, element)=>{
            const $data = $(element);
            const $item = $data.find('td');

            // 조회된 유저명
            const match_name = $item.eq(2).find('a>b').text();

            // 조회된 유저명이 검색한 닉네임과 일치하는 경우
            if( user_name===match_name ){
                // 고유ID 추출
                const match_user_data = [];
                const match_user_regex = /'([^']*)'/g;
                const match_user_info = $item.eq(2).find('a').attr('onclick');

                while( match_user_item = match_user_regex.exec(match_user_info) ){
                    match_user_data.push(match_user_item[1]);
                }

                // 가공
                user_data.id = match_user_data[1];
                user_data.name = match_name;
                user_data.rank = $item.eq(0).find('b').text();
                user_data.class = $item.eq(2).find('span>img').attr('src');
                user_data.odds = $item.eq(3).text();
                user_data.kill = $item.eq(4).text();
                user_data.record = $item.eq(5).text();
                user_data.clan = $item.eq(6).find('a>b').text();
            }
        });

        if( !user_data.id ){
            await interaction.reply(`검색하신 닉네임으로 조회되는 정보가 없습니다.`);
            return false;
        }

        user_data.clan = user_data.clan ? user_data.clan : '-';

        // Etc
        // - button 생성
        const userTrendBtn = new ButtonBuilder()
            .setCustomId('userTrendData')
            .setLabel('최근동향')
            .setStyle(ButtonStyle.Primary);
        const userMatchBtn = new ButtonBuilder()
            .setCustomId('userMatchData')
            .setLabel('매치기록')
            .setStyle(ButtonStyle.Primary);
        const userBtn = new ActionRowBuilder()
            .addComponents(userTrendBtn, userMatchBtn);

        // - embed 생성
        const embed_obj = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${user_data.name} (${user_data.id})`)
            .setURL(`https://barracks.sa.nexon.com/${user_data.id}/match`)
            .setThumbnail(user_data.class)
            .addFields(
                {name: '랭킹', value: user_data.rank},
                {name: '소속클랜', value: user_data.clan},
                {name: '전적', value: user_data.record},
                {name: '승률', value: user_data.odds, inline: true},
                {name: '킬데스', value: user_data.kill, inline: true},
            );



        // Result
        await interaction.reply({
            embeds: [embed_obj],
            components: [userBtn]
        });
    }
};