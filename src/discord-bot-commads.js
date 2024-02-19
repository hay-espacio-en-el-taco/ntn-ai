import { InteractionResponseType } from 'discord-interactions';
import pilingaFn from './pilinga-command.js'

/**
 * Application Command Types
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types
 */
const CHAT_INPUT = '1'; // Slash commands; a text-based command that shows up when a user types /
const USER       = '2'; // A UI-based command that shows up when you right click or tap on a user
const MESSAGE    = '3'; // A UI-based command that shows up when you right click or tap on a message

export const DEFERRED_RESPONSE = {
  type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
  data: {
    content: 'Pensando...'
  }
};

export default {
  'pilinga': {
    isDeferred: true,
    description: 'Basic command',
    type: CHAT_INPUT,
    handler: pilingaFn
  },
};
