module.exports = {
    customId: 'userMatch',
    data: new ButtonBuilder({
        custom_id: this.customId,
        style: ButtonStyle.Secondary,
        label: '최근 매치기록',
        emoji: '📋'
    }),
    execute: async interaction => {
        await interaction.reply('userMatch 버튼 클릭!')
    }
}