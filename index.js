require('dotenv').config();
const axios = require('axios');

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
	],
});

const INTERVAL_TIME = 15 * 60 * 1000;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    if (message.content.startsWith('!instantgaming')) {
      
      const args = message.content.split(' ');
  
      const game = args.slice(1).join(' ');
  
      if (!game) {
        message.reply('Podaj nazwę gry, np. `!instantgaming mafia`');
        return;
      }
  
      message.reply(`https://www.instant-gaming.com/pl/search/?q=${encodeURIComponent(game)}&igr=RadosnyGrajek`);
    }
  });

client.login(process.env.CLIENT_TOKEN);

async function checkLiveStream() {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        channelId: process.env.YOUTUBE_CHANNEL_ID,
        eventType: 'live',
        type: 'video',
        key: process.env.API_KEY
      }
    });

    const liveStream = response.data.items;

    if (liveStream.length > 0) {
      console.log(`Kanał rozpoczął transmisję na żywo: https://www.youtube.com/watch?v=${liveStream[0].id.videoId}`);
      const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
      if (channel) {
        channel.send(`Kanał rozpoczął transmisję na żywo! Oglądaj tutaj: https://www.youtube.com/watch?v=${liveStream[0].id.videoId}`);
      } else {
        console.error('Nie znaleziono kanału Discord!');
      }
    } else {
      console.log('Brak transmisji na żywo.');
    }
  } catch (error) {
    console.error('Błąd podczas sprawdzania transmisji:', error.message);
  }
}

setInterval(checkLiveStream, INTERVAL_TIME);
