const fs = require('node:fs');
const path = require('node:path');
const { config } = require('dotenv');
const { Client, Events, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
config();

const token = process.env.TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });


// --------------------------------------------------------------
//  # 슬래시명령어 상호작용 등록
// --------------------------------------------------------------
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command);
    } else {
        console.log('커멘드 상호작용 파일 오류');
    }
}

// --------------------------------------------------------------
//  # 버튼 상호작용 등록
// --------------------------------------------------------------
client.buttons = new Collection();
const buttonsPath = path.join(__dirname, 'buttons');
const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));
for(const file of buttonFiles){
    const filePath = path.join(buttonsPath, file);
    const button = require(filePath);

    if('customId' in button && 'execute' in button){
        client.buttons.set(button.customId, button);
    } else {
        console.log('버튼 상호작용 파일 오류')
    }
}

// --------------------------------------------------------------
//  # 사용자 상호작용 처리
// --------------------------------------------------------------
client.on(Events.InteractionCreate, async interaction => {
    // 슬래시 커맨드
    if( interaction.isChatInputCommand() ){
        const command = interaction.client.commands.get(interaction.commandName);
        if( !command ){
            console.log(`${interaction.commandName} 로 매칭되는 슬래시커맨드가 없습니다.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch(error) {
            console.log(error);
            if( interaction.replied || interaction.deferred ) {
                await interaction.followUp({content: '명령어를 실행하는 도중 오류가 발생하였습니다.', ephemeral: true});
            } else {
                await interaction.reply({content: '명령어를 실행하는 도중 오류가 발생하였습니다.', ephemeral: true})
            }
        }
    }

    // 버튼 상호작용
    if( interaction.isButton() ){
        const button = interaction.client.buttons.get(interaction.customId);
        if( !button ){
            console.log(`${interaction.customId} 로 매칭되는 버튼이 없습니다.`);
            return;
        }

        try {
            await button.execute(interaction);
        } catch(error) {
            console.log(error);
            await interaction.reply({content: '버튼에 대한 작업을 처리 중 오류가 발생하였습니다.', ephemeral: true});
        }
    }
});

// 봇 실행
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

    // 참고: https://discord-api-types.dev/api/discord-api-types-v10/enum/ActivityType#Listening
    client.user.setActivity({
        type: ActivityType.Playing,
        name: '동우 욕',
    });
});

client.login(token).catch(console.error);