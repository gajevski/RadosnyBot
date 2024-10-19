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
let lastStreamId = null;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

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
      const currentStreamId = liveStream[0].id.videoId;

      if (lastStreamId !== currentStreamId) {
        console.log(`Kanał rozpoczął nową transmisję na żywo: https://www.youtube.com/watch?v=${currentStreamId}`);
        const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
        
        if (channel) {
          channel.send(`@Widz Nadajemy na żywo! Oglądaj tutaj: https://www.youtube.com/watch?v=${currentStreamId}`);
        } else {
          console.error('Nie znaleziono kanału Discord!');
        }

        lastStreamId = currentStreamId;
      } else {
        console.log('Stream trwa, brak nowej transmisji.');
      }
    } else {
      console.log('Kanał nie jest na żywo.');
      lastStreamId = null;
    }
  } catch (error) {
    console.error('Błąd podczas sprawdzania transmisji:', error.message);
  }
}

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

setInterval(checkLiveStream, INTERVAL_TIME);

client.login(process.env.CLIENT_TOKEN);
