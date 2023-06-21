const { EmbedBuilder } = require('discord.js');

module.exports = {
    customId: 'userInfo',
    execute: async interaction => {
        // Val

        // Init
        interaction.deferUpdate();

        // Data
        // ... 유저정보
        const user_embed = new EmbedBuilder(interaction.message.embeds[0]);
        
        await interaction.reply('userInfo 버튼 클릭!')
    }
}