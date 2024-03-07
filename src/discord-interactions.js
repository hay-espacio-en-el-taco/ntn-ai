import fs from 'node:fs';
import { argv } from 'node:process';
import { InteractionType, InteractionResponseType, verifyKey } from 'discord-interactions';
import DISCORD_BOT_COMMADS, { DEFERRED_RESPONSE } from './discord-bot-commads.js'

function getDeferredResponse(responseTextFn) {
  const hasProceduralTextFn = typeof responseTextFn === 'function';
  const textResponse = hasProceduralTextFn ? responseTextFn() : 'Pensando...';

  return {
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: textResponse
    }
  };
};

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

    if (typeof command.isDeferred) {
      return getDeferredResponse(command.getDeferredLoadingStateText);
    }

    return command.handler(body);
  },
}

const TESTING_FN = (body, headers) => {
  return { body, headers };
}

async function main(bodyRaw, headersRaw, env) {
  const headers = JSON.parse(headersRaw);
  const isDevEnv = headers['host'].includes('dev.modal.run');
  const body = JSON.parse(bodyRaw);
  let isValidRequest = false;

  if (isDevEnv) {
    isValidRequest = true;
  } else {
    const signature = headers['x-signature-ed25519'];
    const timestamp = headers['x-signature-timestamp'];
    isValidRequest = verifyKey(bodyRaw, signature, timestamp, env.DISCORD_PUBLIC_KEY);
  }

  if (!isValidRequest) {
    throw new Error('Not a valid request');
  }

  const { type } = body;
  return (DISCORD_FUNCTIONS[type] || TESTING_FN)(body, headers);
}

main(argv[2], argv[3], process.env)
  .then(
    (response) => {
      const text = JSON.stringify(response);
      fs.writeFileSync('result.json', text);
    }
  )
  .catch(
    (err) => {
      console.error(err);
      const text = JSON.stringify({
        error: {
          type: err.name,
          message: err.message
        }
      });
      fs.writeFileSync('result.json', text);
    }
  );
