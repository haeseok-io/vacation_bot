const { EmbedBuilder } = require('discord.js');
const database = require("../database");

// --------------------------------------------------------------
//  # userInfoEmbed (유저정보)
// --------------------------------------------------------------
const userInfoEmbed = async data => {
    // Val
    const embed = new EmbedBuilder();

    // Data
    // ... 비매너 등록여부
    const bad_sql = `Select * From user_bad_manners Where user_id='${data.id}'`;
    const bad_data = await database.dbData(bad_sql);

    // ... 비매너 색상
    const bad_color = bad_data ? "#ff0000" : "#00aaea";

    // ... 비매너 문구
    if( bad_data ){
        embed.setFooter({text: '🚨 비매너 유저 입니다. 🚨'});
    }

    // Process
    embed.setColor(bad_color);
    embed.setTitle(`${data.name}`);
    embed.setURL(`https://barracks.sa.nexon.com/${data.id}/match`);
    embed.setThumbnail(data.class_img);
    embed.addFields(
        {name: '\u2009', value: '\u2009'},
        {name: '랭킹', value: data.rank, inline: true},
        {name: '고유ID', value: data.id, inline: true},
        {name: '\u2009', value: '\u2009'},
    );

    // Etc
    // ... 클랜정보 표기
    if( data.clan_name ){
        const clan_obj = {name: data.clan_name};
        if( data.clan_cert ){
            clan_obj.iconURL = data.clan_cert;
        }

        embed.setAuthor(clan_obj);
    }

    // Result
    return embed;
}

// --------------------------------------------------------------
//  # userTrendEmbed (최근동향)
// --------------------------------------------------------------
const userTrendEmbed = async data => {
    // Val
    const embed = new EmbedBuilder();

    // Data
    // Process
    embed.setColor('#379c6f');
    embed.setAuthor({name: '🔥 최근동향'});
    embed.addFields(
        {name: '승률', value: `${data.odd} %`, inline: true},
        {name: 'KDA', value: `${data.kda} %`, inline: true},
        {name: '\u2009', value: '\u2009'},
        {name: '라플', value: `${data.rifle} %`, inline: true},
        {name: '스나', value: `${data.sniper} %`, inline: true},
    );

    // Result
    return embed;
}

// --------------------------------------------------------------
//  # userMatchEmbed (최근매치)
// --------------------------------------------------------------
const userMatchEmbed = async data => {
    // Val
    const embed = new EmbedBuilder();

    // Data
    const embed_data = [];
    data.forEach((item) => {
        embed_data.push({
            name: `\`${item.stat}\` ${item.map} (${item.date}) \`${item.type}\` `,
            value: `> 킬: ${item.kill} / 데스: ${item.death} / 어시: ${item.assist} / 헤드: ${item.head} / 데미지: ${item.damage}`});
    });

    // Process
    embed.setColor('#379c6f');
    embed.setAuthor({name: '📋 최근 매치기록'});
    embed.addFields(embed_data);

    // Result
    return embed;   
}

// --------------------------------------------------------------
//  # export
// --------------------------------------------------------------
module.exports = {
    userInfoEmbed,
    userTrendEmbed,
    userMatchEmbed
};