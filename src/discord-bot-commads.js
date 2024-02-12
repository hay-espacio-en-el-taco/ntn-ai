import { InteractionResponseType } from 'discord-interactions';

/**
 * Application Command Types
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types
 */
const CHAT_INPUT = '1'; // Slash commands; a text-based command that shows up when a user types /
const USER       = '2'; // A UI-based command that shows up when you right click or tap on a user
const MESSAGE    = '3'; // A UI-based command that shows up when you right click or tap on a message


export default {
  'pilinga': {
    description: 'Basic command',
    type: CHAT_INPUT,
    handler: () => {
      const pilingaLength = Math.floor(27 * Math.random());

      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Te mide ${pilingaLength}cm`
        },
      };
    }
  },
};
