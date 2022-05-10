import { MiroAPI } from "./classes/MiroAPI.js";
import { MiroLayer } from "./classes/MiroLayer.js";
import { ActorHandler } from "./handlers/ActorHandler.js";
import { ItemHandler } from "./handlers/ItemHandler.js";
import { JournalEntryHandler } from "./handlers/JournalEntryHandler.js";
import { registerSettings, SETTINGS } from "./settings.js";
import { CONSTANTS } from "./shared/constants.js";
import { logger } from "./shared/helpers.js";

/** Starting point of the module */
class MiroConnector {
  /** Init all the proper components on init */
  static init() {
    logger("Initializing module");

    // Register settings
    registerSettings();

    // Mandatory settings
    const boardID = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.BOARD_ID);
    if (!boardID) return;

    // Is the API Properly configured?
    const accessToken = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.ACCESS_TOKEN);
    const corsProxyUrl = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.CORS_PROXY_URL);
    if (!accessToken || !corsProxyUrl) return;
    ActorHandler.init();
    ItemHandler.init();
    JournalEntryHandler.init();

    // Make the Miro API public
    setProperty(window, `${CONSTANTS.MODULE_NAME}.MiroAPI`, MiroAPI);
  }

  /** Init all the proper components on ready */
  static ready() {
    // Mandatory settings
    const boardID = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.BOARD_ID);
    if (!boardID) return;

    // Should the Miro board be displayed within Foundry VTT?
    const displayBoard = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.DISPLAY_BOARD);
    if (displayBoard) MiroLayer.init();
  }
}

// Wait for the proper hooks to fire
Hooks.once("init", MiroConnector.init);
Hooks.once("ready", MiroConnector.ready);
