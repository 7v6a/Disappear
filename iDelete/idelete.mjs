import gradient from 'gradient-string';
import { Client } from 'discord.js-selfbot-v13';
import readlineSync from 'readline-sync';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const token = config.token;
const client = new Client();

const runScript = async () => {
  console.log(gradient('purple', 'pink')('Selfbot is online and ready.'));

  while (true) {
    const channelId = readlineSync.question('Enter the channel ID (or type "exit" to quit): ');
    if (channelId.toLowerCase() === 'exit') {
      console.log('Exiting...');
      break;
    }

    const authorId = readlineSync.question('Enter the author ID: ');

    let channel;

    try {
      channel = await client.channels.fetch(channelId);
    } catch (err) {
      console.log(gradient('red', 'yellow')('Invalid channel ID'));
      continue;
    }

    if (channel.type === 'DM') {
      console.log(gradient('green', 'yellow')(`DM Channel detected`));
    } else if (channel.type !== 'GUILD_TEXT') {
      console.log(gradient('red', 'yellow')('Not a valid text channel or DM'));
      continue;
    }

    let fetchedMessages;
    let lastMessageId;
    let messageCount = 0;

    const deleteMessages = async () => {
      while (true) {
        fetchedMessages = await channel.messages.fetch({
          limit: 100,
          before: lastMessageId,
        });

        if (fetchedMessages.size === 0) break;

        for (const [id, message] of fetchedMessages) {
          if (message.author.id === authorId) {
            try {
              await message.delete();
              messageCount++;
              console.log(gradient('purple', 'pink')(`[${messageCount} / ${fetchedMessages.size}] Deleted | ${message.content}`));

              if (messageCount % 7 === 0) {
                console.log(gradient('purple', 'pink')('Pausing for 3 seconds...'));
                await new Promise(resolve => setTimeout(resolve, 3000)); 
              }

              await new Promise(resolve => setTimeout(resolve, 800));
            } catch (error) {
              if (error.code === 10008) {
                console.log(gradient('red', 'yellow')('Message already deleted or does not exist.'));
                continue;
              }
              console.error(gradient('red', 'yellow')(`Error deleting message: ${error.message}`));
            }
          }
        }

        lastMessageId = fetchedMessages.last().id;
      }

      console.log(gradient('purple', 'pink')('Message deletion completed.'));
    };

    await deleteMessages();
  }
};

client.on('ready', async () => {
  await runScript();
});

client.login(token);
