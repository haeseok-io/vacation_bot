const { EmbedBuilder } = require('discord.js');
const userData = require("../modules/userData");

module.exports = {
    customId: 'userTrend',
    execute: async interaction => {
        const user_data = interaction.client.userData.get(interaction.message.interaction.id);
        const user_embed = new EmbedBuilder(interaction.message.embeds[0]);

        console.log(user_data);
        // const user_data = interaction.client.userData.get('id');
        // console.log(user_data);
        // const test = interaction.client.enteredValues.get(interaction.user.id);

        // console.log(interaction.options.getString('유저명'));
        // console.log(interaction.message.interaction);
        // const user_trend = await userData.userTrendData();



        
        // user_embed.data.fields = [
            // {name: 'test', value: 'test'}
        // ];

        // console.log(user_embed);

        // user_embed.addFields(
            // {name: '최근전적', value: '최근전적 데이터 노출'}
        // );


        // console.log(user_embed);
        // user_embed.setTitle("테스트");

        // interaction.update({content: 'test', embeds: [user_embed]});
    }
}