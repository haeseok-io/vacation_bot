const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const { voiceCreate } = require('../modules/voiceAutoCreate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toy')
        .setDescription('재미용 명령어'),
    async execute(interaction){
        // --------------------------------------------------------------
        //  # Val
        // --------------------------------------------------------------
        // const name = interaction.options.getString('이름');

        // --------------------------------------------------------------
        //  # Check
        // --------------------------------------------------------------
        // if( !name ){
            // await interaction.reply('이름이 입력되지 않았습니다.');
            // return;
        // }

        // console.log(interaction.id);
        // --------------------------------------------------------------
        //  # Init
        // --------------------------------------------------------------
        await interaction.deferReply();

        // await voiceCreate(interaction, 'test', interaction.user.id);

        // await interaction.editReply(`${name} 에 대해 알아보는중...`);

        // const channel = await interaction.guild.channels.create({
            // name: `테스트`,
            // type: ChannelType.GuildVoice,
            // parent: interaction.channel.parent
        // });
        // console.log(interaction.guild);

        // await voiceCreate(interaction, 'test');

        // --------------------------------------------------------------
        //  # Data
        // --------------------------------------------------------------
        // 이름배열
        // const user_list = [
            // {name: '유동우', value: '- 서든 개 ㅈ밥\n- 피파 개 ㅈ밥\n- 롤체 개 ㅈ밥'}
        // ];
        // const user_data = user_list.filter(obj => console.log(obj.name));

        // --------------------------------------------------------------
        //  # Process
        // --------------------------------------------------------------
        // const embed = new EmbedBuilder();
        // embed.setColor('#ffffff');
        // embed.setTitle('유동우는 피파도모대 서든도모대 롤체도모대 다모대');

        // Result
        await interaction.editReply('동우메롱');
        // await interaction.editReply({embeds: [embed]});
    }
}