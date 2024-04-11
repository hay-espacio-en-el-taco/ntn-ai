import discordInteractions from './src/discord-interactions.js';
import deferredDiscordCommand from './src/discord-deferred-command.js';

export const handler = async (event) => {
  console.log('Wow, such debugging', event);

  if (event.isDeferred) {
    return await deferredDiscordCommand(event.body);
  }

  const ed25519 = event.headers['x-signature-ed25519'];
  const timestamp = event.headers['x-signature-timestamp'];

  return await discordInteractions({ ed25519, timestamp}, event.body, process.env.DISCORD_PUBLIC_KEY);
};
