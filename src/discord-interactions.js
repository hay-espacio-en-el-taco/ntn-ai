import { InteractionType, InteractionResponseType, verifyKey } from 'discord-interactions';
import DISCORD_BOT_COMMADS from './discord-bot-commads.js'
import { triggerDeferredCommand } from './discord-deferred-command.js';

const DISCORD_FUNCTIONS = {
  [InteractionType.PING]: () => {
    return { type: InteractionResponseType.PONG };
  },
  [InteractionType.APPLICATION_COMMAND]: async (body) => {
    const { data, _preventDeferred } = body;
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

    if (!_preventDeferred && command.isDeferred) {
      const deferredResponse = await triggerDeferredCommand(command, body);
      
      return deferredResponse;
    }

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: command.handler(body)
    };
  },
}

const TESTING_FN = (body, headers) => {
  return { body, headers };
}

export async function getInteractionResponse(body) {
  const { type } = body;

  return await (DISCORD_FUNCTIONS[type] || TESTING_FN)(body)
}

export async function main(signature, bodyRaw, discordPublicKey, isDevEnv = false) {
  let isValidRequest = false;
  const body = JSON.parse(bodyRaw);

  if (isDevEnv) {
    isValidRequest = true;
  } else {
    isValidRequest = verifyKey(bodyRaw, signature.ed25519, signature.timestamp, discordPublicKey);
  }

  if (!isValidRequest) {
    return {
      statusCode: 401,
      body: 'Bad request signature'
    };
  }

  const interactionResponse = await getInteractionResponse(body);

  return {
    statusCode: 200,
    body: JSON.stringify(interactionResponse)
  };
}

export default main;
