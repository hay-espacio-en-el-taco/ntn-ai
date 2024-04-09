import discordInteractions from './src/discord-interactions.js'

export const handler = async (event) => {
  const ed25519 = event.headers['x-signature-ed25519'];
  const timestamp = event.headers['x-signature-timestamp'];
  const response = await discordInteractions({ ed25519, timestamp}, event.body, process.env.DISCORD_PUBLIC_KEY);

  return response;
};