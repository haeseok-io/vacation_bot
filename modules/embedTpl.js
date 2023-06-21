const { EmbedBuilder, Embed } = require('discord.js');

// --------------------------------------------------------------
//  # 로딩
// --------------------------------------------------------------
const loadingEmbed = msg => {
    // Val
    const embed = new EmbedBuilder();

    // Check
    if( !msg )  return;

    // Data
    embed.setColor('#ffff00');
    embed.setTitle(`🛸 ${msg}`);

    // Result
    return embed;
};

// --------------------------------------------------------------
//  # 유저 정보 (통합)
// --------------------------------------------------------------
const userInfoEmbed = (user_id, user_name, classes, user_rank, clan_name, clan_cert) => {
    // Val
    const embed = new EmbedBuilder();

    // Check
    if( !user_id || !user_name || !classes || !user_rank ){
        return;
    }

    // Data

    // Process
    embed.setColor('#00aaea');
    embed.setTitle(user_name)
    embed.setURL(`https://barracks.sa.nexon.com/${user_id}/match`);
    embed.setThumbnail(classes);
    embed.setFooter({text: `서든어택 공식 홈페이지에서 조회되는 데이터 입니다.`});

    // ... 클랜정보가 있을 경우 클랜정보 표기
    if( clan_name ){
        const clan_obj = {name: clan_name};
        
        if( clan_cert ){
            clan_obj.iconURL = clan_cert;
        }

        embed.setAuthor(clan_obj);
    }
    
    embed.addFields(
        {name: '\u2009', value: '\u2009'},
        {name: '랭킹', value: user_rank, inline: true},
        {name: '고유ID', value: user_id, inline: true},
        {name: '\u2009', value: '\u2009'},
    )

    // Result
    return embed;
};

// --------------------------------------------------------------
//  # 유저 최근 동향
// --------------------------------------------------------------
const userTrendEmbed = (odd, kda, rifle, sniper) => {
    // Val
    const embed = new EmbedBuilder();

    // Check
    if( !odd || !kda || !rifle || !sniper ){
        return;
    }

    // Process
    embed.setColor('#379c6f');
    embed.setAuthor({name: '🔥 최근동향'});
    embed.addFields(
        {name: '승률', value: `${odd} %`, inline: true},
        {name: 'KDA', value: `${kda} %`, inline: true},
        {name: '\u2009', value: '\u2009'},
        {name: '라플', value: `${rifle} %`, inline: true},
        {name: '스나', value: `${sniper} %`, inline: true},
    );

    // Result
    return embed;
};

// --------------------------------------------------------------
//  # 유저 최근 매치
// --------------------------------------------------------------
const userMatchEmbed = match_data => {
    // Val
    const embed = new EmbedBuilder();

    // Check
    if( !match_data ){
        return;
    }

    // Data
    const embed_data = [];
    match_data.forEach((data) => {
        embed_data.push({
            name: `\`${data.stat}\` ${data.map} (${data.date}) \`${data.type}\` `,
            value: `> 킬: ${data.kill} / 데스: ${data.death} / 어시: ${data.assist} / 헤드: ${data.head} / 데미지: ${data.damage}`});
    });

    // Process
    embed.setColor('#379c6f');
    embed.setAuthor({name: '📋 최근 매치기록'});
    embed.addFields(embed_data);
    
    // Result
    return embed;
}

module.exports = {loadingEmbed, userInfoEmbed, userTrendEmbed, userMatchEmbed};