import { DiscordRequest } from './discord-utils.js'
import ALL_COMMANDS from './discord-bot-commads.js';

function getAllCommandsForRegister() {
  return Object.entries(ALL_COMMANDS).map(
    ([name, commandObj]) => {
      return {
        name,
        description: commandObj.description,
        type: commandObj.type,
        options: commandObj.options || undefined
      }
    }
  );
}

async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
  const response = await DiscordRequest(`applications/${appId}/commands`, { method: 'PUT', body: commands });
  const data = await response.json()
  console.log('Commands pushed succesfully!', data);
}

InstallGlobalCommands(process.env.DISCORD_APP_ID, getAllCommandsForRegister())
.catch(
  err => {
    console.error(err);
    process.exit(1);
  }
);