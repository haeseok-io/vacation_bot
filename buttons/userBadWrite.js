const { ButtonBuilder, ButtonStyle } = require('discord.js');
const database = require('../modules/database');

const prefix = 'userBadWrite';
module.exports = {
    customId: prefix,
    data: new ButtonBuilder({
        custom_id: prefix,
        style: ButtonStyle.Danger,
        label: '핵/비매너 등록',
    }),
    execute: async interaction => {
        interaction.reply(`💻 개발중`)
    }
};
