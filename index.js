require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
	],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    if (message.content.startsWith('!instantgaming')) {
      
      const args = message.content.split(' ');
  
      const game = args.slice(1).join(' ');
  
      if (!game) {
        message.reply('Podaj nazwę gry, np. `!instantgaming nazwa_gry`');
        return;
      }
  
      message.reply(`https://www.instant-gaming.com/pl/search/?q=${encodeURIComponent(game)}&igr=RadosnyGrajek`);
    }
  });

client.login(process.env.CLIENT_TOKEN);
