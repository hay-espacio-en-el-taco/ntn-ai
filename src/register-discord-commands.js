import { DiscordRequest } from './discord-utils.js'
import ALL_COMMANDS from './discord-bot-commads.js';

function getAllCommandsForRegister() {
  return Object.entries(ALL_COMMANDS).map(
    ([name, commandObj]) => {
      return {
        name,
        description: commandObj.description,
        type: commandObj.type
      }
    }
  );
}

async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  try {
      // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
      const response = await DiscordRequest(`applications/${appId}/commands`, { method: 'PUT', body: commands });
      const data = await response.json()
      console.log('Commands pushed succesfully!', data);
  } catch (err) {
      console.error(err);
  }
}

InstallGlobalCommands(process.env.DISCORD_APP_ID, getAllCommandsForRegister());