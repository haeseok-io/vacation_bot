const { EmbedBuilder, Embed } = require('discord.js');

// --------------------------------------------------------------
//  # 로딩
// --------------------------------------------------------------
const loadingEmbed = msg => {
    // Val
    const embed = new EmbedBuilder();

    // Check
    if( !msg ){
        rs_data.error = '전달 데이터 오류';
        return rs_data;
    }

    // Process
    embed.setColor('#ffff00');
    embed.setTitle(`🛸 ${msg}`);

    // Result
    return embed;
};

// --------------------------------------------------------------
//  # export
// --------------------------------------------------------------
module.exports = {loadingEmbed};