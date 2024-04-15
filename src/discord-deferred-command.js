import { LambdaClient, InvokeCommand, InvocationType, LogType  } from "@aws-sdk/client-lambda";
import { InteractionResponseType } from 'discord-interactions';
import { getInteractionResponse } from './discord-interactions.js';
import { DiscordRequest } from './discord-utils.js';

export async function triggerDeferredCommand(body) {
  const payload = { body, isDeferred: true };
  const client = new LambdaClient({});
  const command = new InvokeCommand({
    InvocationType: InvocationType.Event,
    LogType: LogType.Tail,
    FunctionName: process.env.AWS_LAMBDA_ARN,
    Payload: JSON.stringify(payload),
  });

  try {
    await client.send(command);
  } catch (err) {
    console.error(new Error('Failed to trigger lambda'));
    console.error(err);

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      content: 'Failed to trigger lambda'
    };
  }

  return {
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  };
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
