import gradient from 'gradient-string';
import { Client } from 'discord.js-selfbot-v13';
import fs from 'fs/promises';
import { createInterface } from 'readline';

const { token } = JSON.parse(await fs.readFile('config.json', 'utf8'));
const client = new Client({ checkUpdate: false });
const rl = createInterface({ input: process.stdin, output: process.stdout });

const constants = {
  DELETE_DELAY: 800,       // Delay between individual message deletions (ms)
  BATCH_SIZE: 7,           // Number of messages before a longer pause
  BATCH_PAUSE: 3000,       // Pause after each batch (ms)
  MAX_RETRIES: 3           // Max retry attempts for failed operations
};

const question = (query) => new Promise(resolve => rl.question(query, resolve));

const deleteMessages = async (channel, authorId) => {
  let count = 0, lastId, retries = 0;

  while (retries < constants.MAX_RETRIES) {
    try {
      const messages = await channel.messages.fetch({ limit: 100, before: lastId });
      if (!messages.size) break;

      for (const [_, msg] of messages) {
        if (msg.author.id === authorId) {
          try {
            await msg.delete();
            count++;
            console.log(gradient('purple', 'pink')(
              `[${count}] Deleted | ${msg.content.substring(0, 50)}${msg.content.length > 50 ? '...' : ''}`
            ));

            await new Promise(r => setTimeout(r, 
              count % constants.BATCH_SIZE ? constants.DELETE_DELAY : constants.BATCH_PAUSE
            ));
          } catch (e) {
            if (e.code !== 10008) {
              retries++;
              await new Promise(r => setTimeout(r, 2000 * retries));
            }
          }
        }
      }
      lastId = messages.last()?.id;
      retries = 0;
    } catch (e) {
      retries++;
      await new Promise(r => setTimeout(r, 5000 * retries));
    }
  }
  return count;
};

const processChannels = async (channels, authorId, type) => {
  let total = 0;
  for (const [_, ch] of channels) {
    const name = type === 'DM' ? ch.recipient?.username : 
                type === 'GROUP' ? ch.name : ch.name;
    console.log(gradient('purple', 'pink')(`\nProcessing ${type} ${name ? 'with ' + name : ''}...`));
    const deleted = await deleteMessages(ch, authorId);
    total += deleted;
    console.log(gradient('green', 'yellow')(`Deleted ${deleted} messages.`));
  }
  return total;
};

const run = async () => {
  console.log(gradient('purple', 'pink')('Selfbot ready.'));
  const authorId = client.user.id;

  while (true) {
    const input = await question('Enter: dm | server <ID> | channel ID | exit\n> ');
    if (input.toLowerCase() === 'exit') break;

    if (input === 'dm') {
      const dms = client.channels.cache.filter(ch => ['DM', 'GROUP_DM'].includes(ch.type));
      const total = await processChannels(dms, authorId, dms.first()?.type === 'DM' ? 'DM' : 'GROUP');
      console.log(gradient('purple', 'pink')(`\nTotal deleted: ${total}`));
      continue;
    }

    if (input.startsWith('server ')) {
      const guild = await client.guilds.fetch(input.split(' ')[1]);
      const channels = guild.channels.cache.filter(ch => ['GUILD_TEXT', 'GUILD_NEWS'].includes(ch.type));
      const total = await processChannels(channels, authorId, 'SERVER');
      console.log(gradient('purple', 'pink')(`\nTotal deleted: ${total}`));
      continue;
    }

    try {
      const channel = await client.channels.fetch(input);
      if (!['GUILD_TEXT', 'GUILD_NEWS', 'DM', 'GROUP_DM'].includes(channel.type)) continue;
      const deleted = await deleteMessages(channel, authorId);
      console.log(gradient('purple', 'pink')(`Deleted ${deleted} messages.`));
    } catch (_) {}
  }

  rl.close();
};

client.on('ready', async () => {
  try {
    await run();
  } finally {
    client.destroy();
    process.exit();
  }
});

client.on('error', console.error);
client.login(token).catch(() => process.exit(1));
