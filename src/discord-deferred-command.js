import { LambdaClient, InvokeCommand, InvocationType, LogType  } from "@aws-sdk/client-lambda";
import { InteractionResponseType } from 'discord-interactions';
import { getInteractionResponse } from './discord-interactions.js';
import { DiscordRequest, NoOp } from './discord-utils.js';

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
  const payload = { body, isDeferred: true };
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

export default async function(body) {
  const interactionResponse = await getInteractionResponse({
    ...body,
    _preventDeferred: true,
  });
  const { application_id, token } = body;

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
