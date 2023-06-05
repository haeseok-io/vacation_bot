const fs = require('node:fs');
const path = require('node:path');
const { config } = require('dotenv');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
config();

const token = process.env.TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// 슬래시 명령어
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command);
    } else {
        console.log('커멘드 실행 오류');
    }
}

client.on(Events.InteractionCreate, async interaction => {
    // 슬래시 커맨드
    if( interaction.isChatInputCommand() ){
        // 커맨드명
        const command = interaction.client.commands.get(interaction.commandName);
        if( !command ){
            console.log(`${interaction.commandName} 로 매칭되는 명령어가 없습니다.`);
            return;
        }

        // 실행
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
        interaction.reply(`${interaction.customId} 버튼 클릭함!`);
    }
});

// 봇 실행
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);