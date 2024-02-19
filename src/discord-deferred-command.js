import fs from 'node:fs';
import { argv } from 'node:process';
import { InteractionType, InteractionResponseType } from 'discord-interactions';
import DISCORD_BOT_COMMADS from './discord-bot-commads.js';
import { DiscordRequest } from './discord-utils.js';


const DISCORD_FUNCTIONS = {
  [InteractionType.PING]: () => {
    return { type: InteractionResponseType.PONG };
  },
  [InteractionType.APPLICATION_COMMAND]: async (body) => {
    const { data, application_id, token } = body;
    const { name } = data;
    const command = DISCORD_BOT_COMMADS[name];

    if (!command) {
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: '¡Ese comando ya no charcha! 😓'
        },
      };
    }

    const response = await command.handler(body);

    /**
     * Using the endpoint to update original response
     * https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response
     * 
     * 
     * Details about the payload:
     * https://discord.com/developers/docs/resources/webhook#edit-webhook-message
     */
    await DiscordRequest(`/webhooks/${application_id}/${token}/messages/@original`, {
      method: 'PATCH',
      body: response
    });
  },
}

const TESTING_FN = (body) => {
  return { body };
}

async function main(bodyRaw) {
  const body = JSON.parse(bodyRaw);
  const { type } = body;

  return await (DISCORD_FUNCTIONS[type] || TESTING_FN)(body);
}

main(argv[2]).catch(
  (err) => {
    console.error(err);
  }
);
