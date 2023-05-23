const { config } = require('dotenv');
const { Client, Events, GatewayIntentBits } = require('discord.js');
config();

const token = process.env.TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);