import { InteractionType, InteractionResponseType, verifyKey } from 'discord-interactions';
import DISCORD_BOT_COMMADS from './discord-bot-commads.js'

// function getDeferredResponse(responseTextFn) {
//   const hasProceduralTextFn = typeof responseTextFn === 'function';
//   const textResponse = hasProceduralTextFn ? responseTextFn() : 'reflexionando...';

//   console.log('Wow, such deferred text', textResponse);

//   return {
//     type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
//     data: {
//       content: textResponse
//     }
//   };
// };

const DISCORD_FUNCTIONS = {
  [InteractionType.PING]: () => {
    return { type: InteractionResponseType.PONG };
  },
  [InteractionType.APPLICATION_COMMAND]: (body) => {
    const { data } = body;
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

    console.log('Wow, such payload', JSON.stringify(body));

    // if (command.isDeferred) {
    //   deferredResponse(command.handler, body);
    //   return getDeferredResponse(command.getDeferredLoadingStateText);
    // }

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: command.handler(body)
    };
  },
}

const TESTING_FN = (body, headers) => {
  return { body, headers };
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

  const { type } = body;
  return {
    statusCode: 200,
    body: JSON.stringify( (DISCORD_FUNCTIONS[type] || TESTING_FN)(body) )
  }
}

export default main;
