const { ChannelType } = require('discord.js');
const database = require('./database');

// ... 음성채널 생성
const voiceCreate = async (data, channel_name, create_user_id) => {
    // Val
    // Check
    // Data
    // ... 랜덤숫자
    let random = Math.floor(Math.random() * (9999-0+1))+0;
    random = String(random).padStart(4, '0');

    // ... 채널이름 뒤에 랜덤숫자 지정
    channel_name = `${channel_name} (${random})`;

    // Process
    // ... 음선채널 생성
    const channel = await data.guild.channels.create({
        name: channel_name,
        type: ChannelType.GuildVoice,
        parent: data.channel.parent
    });

    // ... 생성된 음성채널 로그 저장
    await database.dbQuery(`Insert Into user_create_voice (user_id, channel_id, status, date) Values ('${data.id}', '${channel.id}', 'A', now())`);

    // Result
    return channel.id;
}

// ... 음성채널 제거
const voiceDelete = async (data, channel_id) => {
    // Val
    // Check
    if( !channel_id )   return;

    // Data
    // ... 자동생성 로그에 있는지 체크
    const get_data = await database.dbData(`Select * From user_create_voice Where channel_id='${channel_id}' && status='A'`);

    // Process
    if( get_data ){
        // ... 음성채널 삭제
        data.channel.delete();

        // ... 음설채널 로그 상태값 변경
        await database.dbQuery(`Update user_create_voice Set status='Z' Where channel_id='${channel_id}'`);
    }

    // Result
    return channel_id;
}


module.exports = {
    voiceCreate,
    voiceDelete
}