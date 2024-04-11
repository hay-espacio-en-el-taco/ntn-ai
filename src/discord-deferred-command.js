import { LambdaClient, InvokeCommand, InvocationType, LogType  } from "@aws-sdk/client-lambda";
import { InteractionResponseType } from 'discord-interactions';
import { getInteractionResponse } from './discord-interactions.js';
import { NoOp } from './discord-utils.js';

function getDeferredResponse(text) {
  const textResponse = text || 'reflexionando...';
  console.log('Wow, such deferred text', textResponse);

  return {
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: textResponse
    }
  };
};

export async function triggerDeferredCommand(discordCommand, body) {
  const payload = { body, isDeferred }
  const client = new LambdaClient({});
  const command = new InvokeCommand({
    InvocationType: InvocationType.Event,
    LogType: LogType.Tail,
    FunctionName: 'arn:aws:lambda:us-east-2:058264239687:function:ntnBot',
    Payload: JSON.stringify(payload),
  });

  try {
    await client.send(command);
  } catch (err) {
    console.error(new Error('Failed to trigger lambda'));
    console.error(err);

    return getDeferredResponse('Failed to trigger the deferred command');
  }

  const textFn = typeof discordCommand.getDeferredLoadingStateText === 'function' ? discordCommand.getDeferredLoadingStateText : NoOp;

  return getDeferredResponse( textFn() );
}


// import { InteractionType, InteractionResponseType } from 'discord-interactions';
// import DISCORD_BOT_COMMADS from './discord-bot-commads.js';
// import { DiscordRequest } from './discord-utils.js';

// const DISCORD_FUNCTIONS = {
//   [InteractionType.PING]: () => {
//     return { type: InteractionResponseType.PONG };
//   },
//   [InteractionType.APPLICATION_COMMAND]: async (body) => {
//     const { data, application_id, token } = body;
//     const { name } = data;
//     const command = DISCORD_BOT_COMMADS[name];

//     if (!command) {
//       return {
//         type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
//         data: {
//           content: '¡Ese comando ya no charcha! 😓'
//         },
//       };
//     }

//     const response = await command.handler(body);

//     /**
//      * Using the endpoint to update original response
//      * https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response
//      * 
//      * 
//      * Details about the payload:
//      * https://discord.com/developers/docs/resources/webhook#edit-webhook-message
//      */
//     await DiscordRequest(`/webhooks/${application_id}/${token}/messages/@original`, {
//       method: 'PATCH',
//       body: response
//     });
//   },
// }
export default async function(body) {
  const interactionResponse = getInteractionResponse(body);

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
    body: interactionResponse.data
  });
}
