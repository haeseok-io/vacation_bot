const { config } = require('dotenv');
const { REST, Routes } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');
config();

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`커맨드 명령어 등록 중 입니다. ${commands.length}`);

        const data = await rest.put(Routes.applicationCommands(process.env.CLIENTID), {body: commands});

        console.log(`커맨드 명력어 등록 완료`);
    } catch(error) {
        console.log(error);
    }
})();