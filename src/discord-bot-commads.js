import pilingaFn from './pilinga-command/pilinga-command.js'

const APPLICATION_COMMAND_TYPES = {
    /**
     * Application Command Types
     * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types
     */
    CHAT_INPUT: '1', // Slash commands; a text-based command that shows up when a user types /
    USER      : '2', // A UI-based command that shows up when you right click or tap on a user
    MESSAGE   : '3', // A UI-based command that shows up when you right click or tap on a message
};

const COMMAND_OPTION_TYPES = {
  SUB_COMMAND: 1, // 
  SUB_COMMAND_GROUP: 2, // 
  STRING: 3, // 
  INTEGER: 4, // Any integer between -2^53 and 2^53
  BOOLEAN: 5, // 
  USER: 6, // 
  CHANNEL: 7, // Includes all channel types + categories
  ROLE: 8, // 
  MENTIONABLE: 9, // Includes users and roles
  NUMBER: 10, // 	Any double between -2^53 and 2^53
  ATTACHMENT: 11, // 	attachment object
};


export default {
  'pilinga': {
    description: 'El bot te mide la pilinga, o bien, si eliges un usuario entonces se la mides tú a dicho usuario',
    type: APPLICATION_COMMAND_TYPES.CHAT_INPUT,
    handler: pilingaFn,
    options: [
      {
          "name": "usuario",
          "description": "Usuario a quien se la quieres medir",
          "type": COMMAND_OPTION_TYPES.USER,
          "required": false
      },
    ],
  },
  'deferred-test': {
    isDeferred: true,
    description: 'El bot te mide la pilinga, o bien, si eliges un usuario entonces se la mides tú a dicho usuario',
    type: APPLICATION_COMMAND_TYPES.CHAT_INPUT,
    handler: pilingaFn,
    options: [
      {
          "name": "usuario",
          "description": "Usuario a quien se la quieres medir",
          "type": COMMAND_OPTION_TYPES.USER,
          "required": false
      },
    ],
  },
};
