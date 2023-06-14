const { EmbedBuilder } = require('discord.js');

module.exports = {
    customId: 'userInfo',
    execute: async interaction => {
        await interaction.reply('userInfo 버튼 클릭!')
    }
}